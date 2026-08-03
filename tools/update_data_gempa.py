#!/usr/bin/env python3
"""Konversi Excel data gempa menjadi GeoJSON + metadata untuk QuakePulse.

Tidak membutuhkan library tambahan. Mendukung file .xlsx standar dan mencoba
mengenali nama kolom Indonesia/Inggris secara otomatis.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import shutil
import sys
import unicodedata
from collections import Counter
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path, PurePosixPath
from statistics import mean
from typing import Any, Iterable
from xml.etree import ElementTree as ET
from zipfile import BadZipFile, ZipFile

MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
NS = {"m": MAIN_NS, "r": REL_NS, "pr": PKG_REL_NS}

MONTHS_ID = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]
MONTHS_EN = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]
MONTH_ALIASES = {
    "januari": 1, "january": 1, "jan": 1,
    "februari": 2, "february": 2, "feb": 2,
    "maret": 3, "march": 3, "mar": 3,
    "april": 4, "apr": 4,
    "mei": 5, "may": 5,
    "juni": 6, "june": 6, "jun": 6,
    "juli": 7, "july": 7, "jul": 7,
    "agustus": 8, "august": 8, "agu": 8, "aug": 8,
    "september": 9, "sep": 9, "sept": 9,
    "oktober": 10, "october": 10, "okt": 10, "oct": 10,
    "november": 11, "nov": 11,
    "desember": 12, "december": 12, "des": 12, "dec": 12,
}

ALIASES = {
    "id": {"no", "nomor", "id", "number", "nomer"},
    "datetime": {
        "datetime", "dateandtime", "tanggalwaktu", "tanggaljam", "timestamp",
        "waktukejadian", "eventdatetime", "originatetime", "origintime",
    },
    "date": {"date", "tanggal", "tanggalkejadian", "eventdate", "origindate"},
    "time": {"time", "jam", "waktu", "eventtime", "ime"},
    "latitude": {"latitude", "lat", "lintang", "koordinatlintang", "y"},
    "longitude": {"longitude", "long", "lon", "lng", "bujur", "koordinatbujur", "x"},
    "depth": {"depth", "depthkm", "kedalaman", "kedalamankm", "focaldepth"},
    "magnitude": {"magnitude", "magnitudo", "mag", "magnitudom", "m"},
    "location": {
        "eventlocationname", "location", "lokasi", "wilayah", "region", "area",
        "keteranganlokasi", "namalokasi", "eventlocation",
    },
    "felt": {"dirasakan", "felt", "wilayahdirasakan", "intensitas", "mmi"},
    "tsunami": {
        "potensi", "potensitsunami", "tsunami", "statuspotensitsunami",
        "tsunamipotential", "keteranganpotensi",
    },
    "shakemap": {"shakemap", "shakemapurl", "urlshakemap", "peta guncangan", "petaguncangan"},
    "note": {"catatan", "note", "notes", "keterangan", "bmkg_note", "keteranganbmkg"},
}

REQUIRED_FIELDS = ("latitude", "longitude", "depth", "magnitude")


def normalize_header(value: Any) -> str:
    text = unicodedata.normalize("NFKD", str(value or ""))
    text = "".join(char for char in text if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", text.lower()).strip()


def column_index(cell_ref: str) -> int:
    letters = re.match(r"[A-Za-z]+", cell_ref)
    if not letters:
        return 0
    index = 0
    for char in letters.group(0).upper():
        index = index * 26 + (ord(char) - 64)
    return index - 1


def xml_text(node: ET.Element | None) -> str:
    if node is None:
        return ""
    return "".join(part.text or "" for part in node.iter() if part.tag.endswith("}t"))


def resolve_xlsx_path(base: PurePosixPath, target: str) -> str:
    target_path = PurePosixPath(target)
    if target_path.is_absolute():
        return str(target_path).lstrip("/")
    parts: list[str] = []
    for part in (base / target_path).parts:
        if part == "..":
            if parts:
                parts.pop()
        elif part not in ("", "."):
            parts.append(part)
    return "/".join(parts)


class XlsxReader:
    def __init__(self, path: Path):
        self.path = path
        try:
            self.archive = ZipFile(path)
        except (BadZipFile, OSError) as exc:
            raise ValueError(f"File bukan .xlsx yang valid: {path.name}") from exc
        self.names = set(self.archive.namelist())
        self.shared_strings = self._read_shared_strings()
        self.date_1904 = False
        self.sheets = self._read_sheet_list()

    def close(self) -> None:
        self.archive.close()

    def _read_shared_strings(self) -> list[str]:
        if "xl/sharedStrings.xml" not in self.names:
            return []
        root = ET.fromstring(self.archive.read("xl/sharedStrings.xml"))
        return [xml_text(item) for item in root.findall("m:si", NS)]

    def _read_sheet_list(self) -> list[tuple[str, str]]:
        workbook_path = "xl/workbook.xml"
        rels_path = "xl/_rels/workbook.xml.rels"
        if workbook_path not in self.names or rels_path not in self.names:
            raise ValueError("Struktur workbook .xlsx tidak lengkap.")

        workbook_root = ET.fromstring(self.archive.read(workbook_path))
        workbook_pr = workbook_root.find("m:workbookPr", NS)
        self.date_1904 = bool(workbook_pr is not None and workbook_pr.get("date1904") in {"1", "true", "True"})

        rels_root = ET.fromstring(self.archive.read(rels_path))
        rel_map = {
            rel.get("Id", ""): rel.get("Target", "")
            for rel in rels_root.findall("pr:Relationship", NS)
        }

        sheets: list[tuple[str, str]] = []
        for sheet in workbook_root.findall("m:sheets/m:sheet", NS):
            name = sheet.get("name", "Sheet")
            rel_id = sheet.get(f"{{{REL_NS}}}id", "")
            target = rel_map.get(rel_id, "")
            if target:
                path = resolve_xlsx_path(PurePosixPath("xl"), target)
                if path in self.names:
                    sheets.append((name, path))
        if not sheets:
            raise ValueError("Tidak ada worksheet yang dapat dibaca.")
        return sheets

    def read_sheet(self, sheet_path: str) -> list[list[Any]]:
        root = ET.fromstring(self.archive.read(sheet_path))
        rows: list[list[Any]] = []
        for row_node in root.findall(".//m:sheetData/m:row", NS):
            values: dict[int, Any] = {}
            max_index = -1
            for cell in row_node.findall("m:c", NS):
                ref = cell.get("r", "A1")
                idx = column_index(ref)
                max_index = max(max_index, idx)
                values[idx] = self._cell_value(cell)
            rows.append([values.get(index, "") for index in range(max_index + 1)] if max_index >= 0 else [])
        return rows

    def _cell_value(self, cell: ET.Element) -> Any:
        cell_type = cell.get("t", "")
        if cell_type == "inlineStr":
            return xml_text(cell.find("m:is", NS))
        value_node = cell.find("m:v", NS)
        if value_node is None or value_node.text is None:
            return ""
        raw = value_node.text
        if cell_type == "s":
            try:
                return self.shared_strings[int(raw)]
            except (ValueError, IndexError):
                return raw
        if cell_type in {"str", "e"}:
            return raw
        if cell_type == "b":
            return raw == "1"
        try:
            number = float(raw)
            return int(number) if number.is_integer() else number
        except ValueError:
            return raw


def first_nonempty(values: Iterable[Any]) -> Any:
    for value in values:
        if str(value).strip() != "":
            return value
    return ""


def sample_kind(values: list[Any]) -> str:
    samples = [value for value in values if str(value).strip() != ""][:25]
    if not samples:
        return "unknown"
    numeric: list[float] = []
    text = []
    for value in samples:
        try:
            numeric.append(float(value))
        except (TypeError, ValueError):
            text.append(str(value).strip())
    if numeric and len(numeric) >= len(samples) * 0.7:
        avg = sum(numeric) / len(numeric)
        if avg > 1000:
            fractional = any(abs(item - round(item)) > 1e-8 for item in numeric)
            return "datetime_serial" if fractional else "date_serial"
        if 0 <= avg < 1.1:
            return "time_serial"
    joined = " ".join(text).lower()
    if ":" in joined and re.search(r"\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}", joined):
        return "datetime_text"
    if ":" in joined:
        return "time_text"
    if re.search(r"\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}", joined) or any(month in joined for month in MONTH_ALIASES):
        return "date_text"
    return "text"


def field_for_header(header: Any) -> str | None:
    normalized = normalize_header(header)
    if not normalized:
        return None
    for field, aliases in ALIASES.items():
        if normalized in {normalize_header(alias) for alias in aliases}:
            return field
    return None


def detect_columns(rows: list[list[Any]]) -> tuple[int, dict[str, int], list[str]]:
    best: tuple[int, int, dict[str, int], list[str]] | None = None
    for row_index, row in enumerate(rows[:30]):
        direct: dict[str, int] = {}
        time_like: list[int] = []
        normalized_headers = [normalize_header(value) for value in row]

        for col_index, header in enumerate(row):
            field = field_for_header(header)
            if field in {"date", "time", "datetime"}:
                time_like.append(col_index)
            elif field and field not in direct:
                direct[field] = col_index

        data_rows = rows[row_index + 1: row_index + 31]
        for col_index in time_like:
            header_field = field_for_header(row[col_index])
            samples = [data[col_index] if col_index < len(data) else "" for data in data_rows]
            kind = sample_kind(samples)
            if kind.startswith("datetime") and "datetime" not in direct:
                direct["datetime"] = col_index
            elif kind.startswith("date") and "date" not in direct:
                direct["date"] = col_index
            elif kind.startswith("time") and "time" not in direct:
                direct["time"] = col_index
            elif header_field and header_field not in direct:
                direct[header_field] = col_index

        score = sum(field in direct for field in REQUIRED_FIELDS) * 3
        score += 2 if "datetime" in direct or ("date" in direct and "time" in direct) else 0
        score += 1 if "location" in direct else 0
        if best is None or score > best[0]:
            best = (score, row_index, direct, normalized_headers)

    if best is None:
        raise ValueError("Baris header tidak ditemukan.")

    score, header_row, columns, normalized_headers = best
    missing = [field for field in REQUIRED_FIELDS if field not in columns]
    if "datetime" not in columns and "date" not in columns:
        missing.append("date/datetime")
    if missing:
        available = ", ".join(str(value) for value in rows[header_row] if str(value).strip())
        raise ValueError(
            "Kolom wajib tidak ditemukan: " + ", ".join(missing) +
            f". Header yang terbaca: {available}"
        )
    return header_row, columns, normalized_headers


def excel_datetime(serial: float, date_1904: bool = False) -> datetime:
    origin = datetime(1904, 1, 1) if date_1904 else datetime(1899, 12, 30)
    return origin + timedelta(days=float(serial))


def replace_month_words(text: str) -> str:
    result = text.strip()
    for name, month_number in sorted(MONTH_ALIASES.items(), key=lambda item: len(item[0]), reverse=True):
        result = re.sub(rf"\b{re.escape(name)}\b", f"{month_number:02d}", result, flags=re.IGNORECASE)
    return result


def parse_date_value(value: Any, date_1904: bool = False) -> date:
    if isinstance(value, (int, float)):
        return excel_datetime(float(value), date_1904).date()
    text = replace_month_words(str(value).strip())
    if not text:
        raise ValueError("tanggal kosong")
    text = re.sub(r"\s+", " ", text)
    candidates = [
        "%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%Y/%m/%d", "%m/%d/%Y",
        "%d.%m.%Y", "%Y.%m.%d", "%d %m %Y", "%Y %m %d",
        "%d-%m-%y", "%d/%m/%y", "%y-%m-%d",
    ]
    iso_candidate = text.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(iso_candidate).date()
    except ValueError:
        pass
    for fmt in candidates:
        try:
            return datetime.strptime(text, fmt).date()
        except ValueError:
            continue
    raise ValueError(f"format tanggal tidak dikenali: {value}")


def parse_time_value(value: Any) -> time:
    if value in (None, ""):
        return time(0, 0, 0)
    if isinstance(value, (int, float)):
        fraction = float(value) % 1
        total_seconds = int(round(fraction * 86400)) % 86400
        return time(total_seconds // 3600, (total_seconds % 3600) // 60, total_seconds % 60)
    text = str(value).strip().upper().replace("WIB", "").replace("WITA", "").replace("WIT", "").strip()
    for fmt in ("%H:%M:%S", "%H:%M", "%H.%M.%S", "%H.%M", "%I:%M:%S %p", "%I:%M %p"):
        try:
            return datetime.strptime(text, fmt).time()
        except ValueError:
            continue
    raise ValueError(f"format jam tidak dikenali: {value}")


def parse_datetime_value(value: Any, date_1904: bool = False) -> datetime:
    if isinstance(value, (int, float)):
        return excel_datetime(float(value), date_1904)
    text = str(value).strip()
    if not text:
        raise ValueError("datetime kosong")
    iso_candidate = text.replace("Z", "+00:00")
    try:
        parsed = datetime.fromisoformat(iso_candidate)
        return parsed
    except ValueError:
        pass

    normalized = replace_month_words(text)
    normalized = re.sub(r"\s+", " ", normalized)
    formats = (
        "%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M", "%d-%m-%Y %H:%M:%S",
        "%d-%m-%Y %H:%M", "%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M",
        "%Y/%m/%d %H:%M:%S", "%Y/%m/%d %H:%M", "%d %m %Y %H:%M:%S",
        "%d %m %Y %H:%M",
    )
    for fmt in formats:
        try:
            return datetime.strptime(normalized, fmt)
        except ValueError:
            continue
    raise ValueError(f"format tanggal-waktu tidak dikenali: {value}")


def parse_number(value: Any, field_name: str) -> float:
    if isinstance(value, bool):
        raise ValueError(f"{field_name} bukan angka")
    if isinstance(value, (int, float)):
        result = float(value)
    else:
        text = str(value).strip().upper()
        if not text:
            raise ValueError(f"{field_name} kosong")
        text = text.replace("−", "-")
        match = re.search(r"[-+]?\d+(?:[.,]\d+)?", text)
        if not match:
            raise ValueError(f"{field_name} bukan angka: {value}")
        result = float(match.group(0).replace(",", "."))
    if not math.isfinite(result):
        raise ValueError(f"{field_name} tidak valid")
    return result


def parse_coordinate(value: Any, kind: str) -> float:
    result = parse_number(value, kind)
    text = str(value).upper()
    if kind == "latitude":
        if re.search(r"\b(LS|S)\b", text) and result > 0:
            result = -result
        if not -90 <= result <= 90:
            raise ValueError(f"latitude di luar rentang: {result}")
    else:
        if re.search(r"\b(BB|W)\b", text) and result > 0:
            result = -result
        if not -180 <= result <= 180:
            raise ValueError(f"longitude di luar rentang: {result}")
    return result


def depth_class(depth_km: float) -> str:
    if depth_km < 60:
        return "Dangkal"
    if depth_km <= 300:
        return "Menengah"
    return "Dalam"


def magnitude_class(magnitude: float) -> str:
    if magnitude < 3:
        return "lt3"
    if magnitude < 5:
        return "3to5"
    return "gte5"


def estimated_radius_km(magnitude: float, depth_km: float) -> float:
    if magnitude < 3:
        base = 3 + magnitude * 2.2
    elif magnitude < 5:
        base = 12 + (magnitude - 3) * 18
    else:
        base = 50 + (magnitude - 5) * 42
    depth_factor = max(0.45, min(1.0, 1 - depth_km / 650))
    return max(3.0, round(base * depth_factor, 1))


def value_at(row: list[Any], columns: dict[str, int], field: str) -> Any:
    index = columns.get(field)
    return row[index] if index is not None and index < len(row) else ""


def combine_datetime(row: list[Any], columns: dict[str, int], date_1904: bool) -> datetime:
    if "datetime" in columns:
        return parse_datetime_value(value_at(row, columns, "datetime"), date_1904)
    parsed_date = parse_date_value(value_at(row, columns, "date"), date_1904)
    parsed_time = parse_time_value(value_at(row, columns, "time")) if "time" in columns else time(0, 0, 0)
    return datetime.combine(parsed_date, parsed_time)


def safe_text(value: Any, fallback: str = "") -> str:
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text or fallback


def iso_without_microseconds(value: datetime) -> str:
    return value.replace(microsecond=0).isoformat()


def period_labels(start_date: date, end_date: date) -> dict[str, str]:
    if start_date.year == end_date.year and start_date.month == end_date.month:
        return {
            "period_label_id": f"{MONTHS_ID[start_date.month]} {start_date.year}",
            "period_label_en": f"{MONTHS_EN[start_date.month]} {start_date.year}",
            "period_short_id": f"{MONTHS_ID[start_date.month].upper()} {start_date.year}",
            "period_short_en": f"{MONTHS_EN[start_date.month].upper()} {start_date.year}",
        }
    if start_date.year == end_date.year:
        label_id = f"{start_date.day} {MONTHS_ID[start_date.month]}–{end_date.day} {MONTHS_ID[end_date.month]} {end_date.year}"
        label_en = f"{MONTHS_EN[start_date.month]} {start_date.day}–{MONTHS_EN[end_date.month]} {end_date.day}, {end_date.year}"
    else:
        label_id = f"{start_date.day} {MONTHS_ID[start_date.month]} {start_date.year}–{end_date.day} {MONTHS_ID[end_date.month]} {end_date.year}"
        label_en = f"{MONTHS_EN[start_date.month]} {start_date.day}, {start_date.year}–{MONTHS_EN[end_date.month]} {end_date.day}, {end_date.year}"
    return {
        "period_label_id": label_id,
        "period_label_en": label_en,
        "period_short_id": label_id.upper(),
        "period_short_en": label_en.upper(),
    }


def unique_key(feature: dict[str, Any]) -> tuple[str, float, float, float]:
    props = feature["properties"]
    lon, lat = feature["geometry"]["coordinates"]
    return props["datetime"], round(lat, 5), round(lon, 5), round(props["magnitude"], 2)


def convert_workbook(input_path: Path) -> tuple[dict[str, Any], dict[str, Any], str]:
    reader = XlsxReader(input_path)
    errors: list[str] = []
    selected_sheet = ""
    selected_rows: list[list[Any]] | None = None
    header_row = 0
    columns: dict[str, int] = {}

    try:
        candidates: list[tuple[int, str, list[list[Any]], int, dict[str, int]]] = []
        sheet_errors: list[str] = []
        for sheet_name, sheet_path in reader.sheets:
            rows = reader.read_sheet(sheet_path)
            try:
                detected_header, detected_columns, _ = detect_columns(rows)
                score = sum(field in detected_columns for field in REQUIRED_FIELDS)
                score += 1 if "datetime" in detected_columns or "date" in detected_columns else 0
                candidates.append((score, sheet_name, rows, detected_header, detected_columns))
            except ValueError as exc:
                sheet_errors.append(f"{sheet_name}: {exc}")
        if not candidates:
            raise ValueError("Tidak ada sheet yang cocok. " + " | ".join(sheet_errors))
        _, selected_sheet, selected_rows, header_row, columns = max(candidates, key=lambda item: item[0])

        features: list[dict[str, Any]] = []
        duplicate_count = 0
        seen: set[tuple[str, float, float, float]] = set()

        for excel_row_number, row in enumerate(selected_rows[header_row + 1:], start=header_row + 2):
            if not any(str(value).strip() for value in row):
                continue
            try:
                event_datetime = combine_datetime(row, columns, reader.date_1904)
                latitude = parse_coordinate(value_at(row, columns, "latitude"), "latitude")
                longitude = parse_coordinate(value_at(row, columns, "longitude"), "longitude")
                depth_km = parse_number(value_at(row, columns, "depth"), "kedalaman")
                magnitude = parse_number(value_at(row, columns, "magnitude"), "magnitudo")
                if depth_km < 0:
                    raise ValueError("kedalaman tidak boleh negatif")
                if not -2 <= magnitude <= 10:
                    raise ValueError(f"magnitudo di luar rentang wajar: {magnitude}")

                location = safe_text(value_at(row, columns, "location"), "Lokasi tidak diketahui")
                radius_km = estimated_radius_km(magnitude, depth_km)
                source_id = value_at(row, columns, "id")
                feature_id = safe_text(source_id, str(excel_row_number - header_row - 1))

                properties = {
                    "id": feature_id,
                    "datetime": iso_without_microseconds(event_datetime),
                    "date": event_datetime.date().isoformat(),
                    "time": event_datetime.time().replace(microsecond=0).isoformat(),
                    "latitude": round(latitude, 8),
                    "longitude": round(longitude, 8),
                    "depth_km": round(depth_km, 2),
                    "depth_class": depth_class(depth_km),
                    "magnitude": round(magnitude, 2),
                    "magnitude_class": magnitude_class(magnitude),
                    "location": location,
                    "estimated_radius_km": radius_km,
                    "estimated_radius_m": int(round(radius_km * 1000)),
                    "felt": safe_text(value_at(row, columns, "felt")),
                    "tsunami_potential": safe_text(value_at(row, columns, "tsunami")),
                    "shakemap_url": safe_text(value_at(row, columns, "shakemap")),
                    "bmkg_note": safe_text(value_at(row, columns, "note")),
                    "source": "Rekap bulanan",
                    "source_row": excel_row_number,
                }
                feature = {
                    "type": "Feature",
                    "id": feature_id,
                    "geometry": {
                        "type": "Point",
                        "coordinates": [round(longitude, 8), round(latitude, 8)],
                    },
                    "properties": properties,
                }
                key = unique_key(feature)
                if key in seen:
                    duplicate_count += 1
                    continue
                seen.add(key)
                features.append(feature)
            except Exception as exc:  # mencatat baris invalid tanpa menghentikan semua data
                errors.append(f"Baris {excel_row_number}: {exc}")

        if not features:
            raise ValueError("Tidak ada baris valid yang dapat dikonversi. Periksa format kolom dan isi Excel.")

        features.sort(key=lambda feature: feature["properties"]["datetime"])
        dates = [datetime.fromisoformat(feature["properties"]["datetime"]).date() for feature in features]
        datetimes = [feature["properties"]["datetime"] for feature in features]
        magnitudes = [feature["properties"]["magnitude"] for feature in features]
        depths = [feature["properties"]["depth_km"] for feature in features]
        locations = [feature["properties"]["location"] for feature in features]
        latitudes = [feature["properties"]["latitude"] for feature in features]
        longitudes = [feature["properties"]["longitude"] for feature in features]
        depth_counts = Counter(feature["properties"]["depth_class"] for feature in features)
        magnitude_counts = Counter(feature["properties"]["magnitude_class"] for feature in features)
        location_counts = Counter(locations)
        period = period_labels(min(dates), max(dates))

        geojson = {
            "type": "FeatureCollection",
            "name": "Rekap Gempa Bulanan",
            "features": features,
        }

        header_values = selected_rows[header_row]
        mapping = {
            field: str(header_values[index]) if index < len(header_values) else ""
            for field, index in columns.items()
        }
        metadata = {
            "title": "QuakePulse - Monitoring Gempa",
            "dataset_name": f"Gempa {period['period_label_id']}",
            **period,
            "source_file": input_path.name,
            "source_sheet": selected_sheet,
            "record_count": len(features),
            "invalid_row_count": len(errors),
            "duplicate_row_count": duplicate_count,
            "date_start": min(dates).isoformat(),
            "date_end": max(dates).isoformat(),
            "datetime_start": min(datetimes),
            "datetime_end": max(datetimes),
            "magnitude_min": min(magnitudes),
            "magnitude_max": max(magnitudes),
            "magnitude_average": round(mean(magnitudes), 2),
            "depth_min_km": min(depths),
            "depth_max_km": max(depths),
            "depth_average_km": round(mean(depths), 2),
            "depth_class_counts": dict(depth_counts),
            "magnitude_class_counts": dict(magnitude_counts),
            "top_locations": [
                {"location": location, "count": count}
                for location, count in location_counts.most_common(10)
            ],
            "coordinate_bounds": {
                "south": min(latitudes), "north": max(latitudes),
                "west": min(longitudes), "east": max(longitudes),
            },
            "depth_class_definition": {
                "Dangkal": "< 60 km", "Menengah": "60-300 km", "Dalam": "> 300 km",
            },
            "magnitude_class_definition": {
                "lt3": "M < 3,0", "3to5": "3,0 ≤ M < 5,0", "gte5": "M ≥ 5,0",
            },
            "buffer_method": {
                "label": "Estimasi jangkauan getaran untuk visualisasi",
                "formula": "Mengikuti fungsi buffer pada app.js berdasarkan magnitudo dan faktor kedalaman.",
            },
            "column_mapping": mapping,
            "generated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            "generator": "tools/update_data_gempa.py",
        }

        report_lines = [
            "LAPORAN UPDATE DATA GEMPA",
            "=" * 40,
            f"File sumber       : {input_path.name}",
            f"Sheet             : {selected_sheet}",
            f"Periode           : {period['period_label_id']}",
            f"Baris valid       : {len(features)}",
            f"Baris tidak valid : {len(errors)}",
            f"Duplikat dilewati : {duplicate_count}",
            "",
            "Pemetaan kolom:",
        ]
        report_lines.extend(f"- {field}: {header}" for field, header in mapping.items())
        if errors:
            report_lines.extend(["", "Baris yang dilewati:", *[f"- {error}" for error in errors]])
        report = "\n".join(report_lines) + "\n"
        return geojson, metadata, report
    finally:
        reader.close()


def atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp_path = path.with_suffix(path.suffix + ".tmp")
    temp_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(temp_path, path)


def create_backup(data_dir: Path) -> Path | None:
    existing = [data_dir / "gempa.geojson", data_dir / "metadata.json", data_dir / "update-report.txt"]
    if not any(path.exists() for path in existing):
        return None
    backup_dir = data_dir / "backup" / datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir.mkdir(parents=True, exist_ok=True)
    for path in existing:
        if path.exists():
            shutil.copy2(path, backup_dir / path.name)
    return backup_dir


def find_input(input_arg: str | None, project_root: Path) -> Path:
    if input_arg:
        candidate = Path(input_arg).expanduser()
        if not candidate.is_absolute():
            candidate = (Path.cwd() / candidate).resolve()
        if candidate.exists() and candidate.suffix.lower() == ".xlsx":
            return candidate
        raise FileNotFoundError(f"File Excel tidak ditemukan: {candidate}")

    preferred = project_root / "update-data" / "data-gempa.xlsx"
    if preferred.exists():
        return preferred
    candidates = [
        path for path in (project_root / "update-data").glob("*.xlsx")
        if not path.name.startswith("~$")
    ]
    if not candidates:
        candidates = [path for path in project_root.glob("*.xlsx") if not path.name.startswith("~$")]
    if not candidates:
        raise FileNotFoundError(
            "File .xlsx tidak ditemukan. Taruh Excel di folder update-data atau seret file ke UPDATE_DATA_GEMPA.bat."
        )
    return max(candidates, key=lambda path: path.stat().st_mtime)


def main() -> int:
    parser = argparse.ArgumentParser(description="Update data rekap bulanan WebGIS gempa dari Excel.")
    parser.add_argument("input", nargs="?", help="Path file .xlsx. Jika kosong, mencari update-data/data-gempa.xlsx.")
    parser.add_argument("--project-root", default=None, help="Folder root WebGIS. Default: parent folder tools.")
    parser.add_argument("--backup", action="store_true", help="Simpan backup data lama sebelum ditimpa.")
    args = parser.parse_args()

    script_root = Path(__file__).resolve().parent
    project_root = Path(args.project_root).resolve() if args.project_root else script_root.parent
    data_dir = project_root / "data"

    try:
        input_path = find_input(args.input, project_root)
        print(f"Membaca: {input_path}")
        geojson, metadata, report = convert_workbook(input_path)
        backup_dir = create_backup(data_dir) if args.backup else None
        atomic_write_json(data_dir / "gempa.geojson", geojson)
        atomic_write_json(data_dir / "metadata.json", metadata)
        (data_dir / "update-report.txt").write_text(report, encoding="utf-8")

        print("\nUPDATE BERHASIL")
        print(f"Periode     : {metadata['period_label_id']}")
        print(f"Data valid  : {metadata['record_count']}")
        print(f"Dilewati    : {metadata['invalid_row_count']}")
        print(f"Duplikat    : {metadata['duplicate_row_count']}")
        print(f"GeoJSON     : {data_dir / 'gempa.geojson'}")
        print(f"Metadata    : {data_dir / 'metadata.json'}")
        print(f"Laporan     : {data_dir / 'update-report.txt'}")
        if backup_dir:
            print(f"Backup lama : {backup_dir}")
        return 0
    except Exception as exc:
        print(f"\nUPDATE GAGAL: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
