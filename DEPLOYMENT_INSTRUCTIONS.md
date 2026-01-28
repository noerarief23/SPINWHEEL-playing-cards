# Instruksi Deployment ke GitHub Pages

## Langkah-langkah untuk mengaktifkan GitHub Pages:

### 1. Merge Pull Request ini
Pertama, merge Pull Request ini ke branch `main` untuk menambahkan workflow deployment.

### 2. Aktifkan GitHub Pages di Repository Settings

1. Buka repository di GitHub: https://github.com/noerarief23/SPINWHEEL-playing-cards
2. Klik tab **Settings** (Pengaturan)
3. Scroll ke bawah dan klik **Pages** di sidebar kiri
4. Di bagian **Source** (Sumber):
   - Pilih **GitHub Actions** sebagai source
5. Klik **Save** (Simpan)

### 3. Tunggu Deployment Selesai

Setelah merge, workflow akan otomatis berjalan:
1. Buka tab **Actions** di repository
2. Lihat workflow "Deploy to GitHub Pages" sedang berjalan
3. Tunggu hingga selesai (biasanya 1-2 menit)
4. Jika berhasil, akan muncul tanda centang hijau ✅

### 4. Akses Website Anda

Setelah deployment selesai, website dapat diakses di:

**https://noerarief23.github.io/SPINWHEEL-playing-cards/**

## Automatic Deployment

Setelah setup awal, setiap kali Anda push perubahan ke branch `main`, website akan otomatis ter-update di GitHub Pages!

## Manual Deployment (Opsional)

Anda juga bisa trigger deployment secara manual:
1. Buka tab **Actions**
2. Pilih workflow "Deploy to GitHub Pages"
3. Klik tombol **Run workflow**
4. Pilih branch `main`
5. Klik **Run workflow**

---

## Troubleshooting

### Jika deployment gagal:
1. Pastikan GitHub Pages sudah diaktifkan di Settings
2. Pastikan source sudah diubah ke "GitHub Actions"
3. Periksa logs di tab Actions untuk melihat error

### Jika website tidak muncul:
1. Tunggu beberapa menit setelah deployment pertama
2. Clear cache browser (Ctrl+F5 atau Cmd+Shift+R)
3. Pastikan URL yang diakses benar: https://noerarief23.github.io/SPINWHEEL-playing-cards/

---

**Selamat! Website Anda sekarang sudah online dan dapat diakses oleh siapa saja melalui internet! 🎉**
