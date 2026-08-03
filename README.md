Langsung melalui GitHub

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
