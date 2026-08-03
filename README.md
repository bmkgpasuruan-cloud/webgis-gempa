# QuakePulse — WebGIS Gempa Dua Mode + Update Excel Otomatis

WebGIS ini memiliki dua mode:

1. **Real-time BMKG** — mengambil gempa terbaru dari feed resmi BMKG dan memperbarui data setiap 5 menit.
2. **Rekap Bulanan** — membaca `data/gempa.geojson` yang dibuat otomatis dari file Excel.

## Update rekap bulanan tanpa mengetik ulang

### Di komputer Windows

1. Ganti `update-data/data-gempa.xlsx` dengan Excel terbaru.
2. Klik dua kali `UPDATE_DATA_GEMPA.bat`.
3. Script otomatis memperbarui:
   - `data/gempa.geojson`
   - `data/metadata.json`
   - `data/update-report.txt`
4. Commit tiga file tersebut ke GitHub.

File Excel juga dapat diseret langsung ke `UPDATE_DATA_GEMPA.bat`.

### Langsung melalui GitHub

Repository sudah dilengkapi GitHub Actions. Setelah seluruh paket diunggah:

1. Buka folder `update-data` pada repository.
2. Ganti `data-gempa.xlsx` dengan Excel terbaru.
3. Commit perubahan.
4. Workflow **Update Rekap Gempa dari Excel** otomatis mengonversi Excel dan meng-commit hasilnya ke folder `data`.

Label periode, jumlah kejadian, judul rekap, badge sumber, dan footer dibaca dari `metadata.json`. Jadi bulan dan jumlah data tidak perlu diedit manual di HTML atau JavaScript.

## Kolom Excel

Kolom wajib:

- tanggal atau DateTime;
- latitude/lintang;
- longitude/bujur;
- depth/kedalaman;
- magnitude/magnitudo.

Kolom lokasi disarankan. Kolom `Dirasakan`, `Potensi Tsunami`, `ShakeMap`, dan `Catatan` bersifat opsional. Script mencoba mengenali beberapa variasi nama kolom Indonesia dan Inggris secara otomatis.

## Klasifikasi otomatis

Kedalaman:

- Dangkal: kurang dari 60 km;
- Menengah: 60–300 km;
- Dalam: lebih dari 300 km.

Magnitudo:

- M < 3,0;
- 3,0 ≤ M < 5,0;
- M ≥ 5,0.

## Struktur utama

- `index.html` — struktur halaman dan pemilih mode;
- `style.css` — tampilan WebGIS;
- `app.js` — peta, filter, real-time BMKG, dan label rekap dinamis;
- `tools/update_data_gempa.py` — konverter Excel tanpa library tambahan;
- `UPDATE_DATA_GEMPA.bat` — tombol update satu klik untuk Windows;
- `.github/workflows/update-data-gempa.yml` — update otomatis di GitHub;
- `update-data/data-gempa.xlsx` — file Excel yang diganti saat ada data baru;
- `data/gempa.geojson` — hasil konversi untuk peta;
- `data/metadata.json` — periode, statistik, dan informasi dataset;
- `data/update-report.txt` — laporan baris valid, dilewati, dan duplikat.

## Menjalankan website lokal

Gunakan Live Server di VS Code atau jalankan:

```bash
python -m http.server 8000
```

Lalu buka `http://localhost:8000`.
