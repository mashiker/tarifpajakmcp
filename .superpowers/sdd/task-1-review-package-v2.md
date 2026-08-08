# Task 1 Re-review Package

## Status
```text
 M .gitignore
 M package.json
 M pnpm-lock.yaml
 M public/api.json
 M public/consolidated.json
 M public/llms.txt
 M public/rates.json
 M public/regulations.json
 M src/build-api.ts
 M src/build.ts
 M tsconfig.json
 M website/public/api.json
 M website/public/api/v1/bppu/22-100.json
 M website/public/api/v1/bppu/22-101.json
 M website/public/api/v1/bppu/22-102.json
 M website/public/api/v1/bppu/22-200.json
 M website/public/api/v1/bppu/22-401.json
 M website/public/api/v1/bppu/22-403.json
 M website/public/api/v1/bppu/22-404.json
 M website/public/api/v1/bppu/22-405.json
 M website/public/api/v1/bppu/22-900.json
 M website/public/api/v1/bppu/22-910.json
 M website/public/api/v1/bppu/24-100.json
 M website/public/api/v1/bppu/24-101.json
 M website/public/api/v1/bppu/24-102.json
 M website/public/api/v1/bppu/24-103.json
 M website/public/api/v1/bppu/24-104.json
 M website/public/api/v1/bppu/24-105.json
 M website/public/api/v1/bppu/28-401.json
 M website/public/api/v1/bppu/28-402.json
 M website/public/api/v1/bppu/28-403.json
 M website/public/api/v1/bppu/28-404.json
 M website/public/api/v1/bppu/28-405.json
 M website/public/api/v1/bppu/28-406.json
 M website/public/api/v1/bppu/28-407.json
 M website/public/api/v1/bppu/28-408.json
 M website/public/api/v1/bppu/28-409.json
 M website/public/api/v1/bppu/28-410.json
 M website/public/api/v1/bppu/28-411.json
 M website/public/api/v1/bppu/28-413.json
 M website/public/api/v1/bppu/28-417.json
 M website/public/api/v1/bppu/28-419.json
 M website/public/api/v1/bppu/28-421.json
 M website/public/api/v1/bppu/28-423.json
 M website/public/api/v1/bppu/28-499.json
 M website/public/api/v1/bppu/29-101.json
 M website/public/api/v1/bppu/index.json
 M website/public/api/v1/by-year/1984.json
 M website/public/api/v1/by-year/1985.json
 M website/public/api/v1/by-year/1986.json
 M website/public/api/v1/by-year/1987.json
 M website/public/api/v1/by-year/1988.json
 M website/public/api/v1/by-year/1989.json
 M website/public/api/v1/by-year/1990.json
 M website/public/api/v1/by-year/1991.json
 M website/public/api/v1/by-year/1992.json
 M website/public/api/v1/by-year/1993.json
 M website/public/api/v1/by-year/1994.json
 M website/public/api/v1/by-year/1995.json
 M website/public/api/v1/by-year/1996.json
 M website/public/api/v1/by-year/1997.json
 M website/public/api/v1/by-year/1998.json
 M website/public/api/v1/by-year/1999.json
 M website/public/api/v1/by-year/2000.json
 M website/public/api/v1/by-year/2001.json
 M website/public/api/v1/by-year/2002.json
 M website/public/api/v1/by-year/2003.json
 M website/public/api/v1/by-year/2004.json
 M website/public/api/v1/by-year/2005.json
 M website/public/api/v1/by-year/2006.json
 M website/public/api/v1/by-year/2007.json
 M website/public/api/v1/by-year/2008.json
 M website/public/api/v1/by-year/2009.json
 M website/public/api/v1/by-year/2010.json
 M website/public/api/v1/by-year/2011.json
 M website/public/api/v1/by-year/2012.json
 M website/public/api/v1/by-year/2013.json
 M website/public/api/v1/by-year/2014.json
 M website/public/api/v1/by-year/2015.json
 M website/public/api/v1/by-year/2016.json
 M website/public/api/v1/by-year/2017.json
 M website/public/api/v1/by-year/2018.json
 M website/public/api/v1/by-year/2019.json
 M website/public/api/v1/by-year/2020.json
 M website/public/api/v1/by-year/2021.json
 M website/public/api/v1/by-year/2022.json
 M website/public/api/v1/by-year/2023.json
 M website/public/api/v1/by-year/2024.json
 M website/public/api/v1/by-year/2025.json
 M website/public/api/v1/by-year/2026.json
 M website/public/api/v1/calculator/index.json
 M website/public/api/v1/calculator/pph-21.json
 M website/public/api/v1/calculator/pph-23.json
 M website/public/api/v1/calculator/pph-badan.json
 M website/public/api/v1/calculator/ppn.json
 M website/public/api/v1/categories/bea-masuk.json
 M website/public/api/v1/categories/bea-meterai.json
 M website/public/api/v1/categories/bphtb.json
 M website/public/api/v1/categories/cukai.json
 M website/public/api/v1/categories/index.json
 M website/public/api/v1/categories/pajak-daerah.json
 M website/public/api/v1/categories/pbb.json
 M website/public/api/v1/categories/pph-21.json
 M website/public/api/v1/categories/pph-22.json
 M website/public/api/v1/categories/pph-23.json
 M website/public/api/v1/categories/pph-26.json
 M website/public/api/v1/categories/pph-4-2-final.json
 M website/public/api/v1/categories/pph-badan.json
 M website/public/api/v1/categories/pph-umkm.json
 M website/public/api/v1/categories/ppn.json
 M website/public/api/v1/categories/ppnbm.json
 M website/public/api/v1/consolidated/index.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-1.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-10.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-11.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-12.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-13.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-14.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-15.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-16.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-17.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-17A.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-18.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-19.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-2.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-20.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-21.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-22.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-23.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-24.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-25.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-26.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-27.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-28.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-29.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-2A.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-3.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-30.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-31.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-32.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-33.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-34.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-35.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-36.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-37.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-38.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-39.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-4.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-40.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-41.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-42.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-43.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-43A.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-43B.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44A.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44B.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44C.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44D.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44E.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-45.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-46.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-47.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-48.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-49.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-5.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-6.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-7.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-8.json
 M website/public/api/v1/consolidated/uu-kup-konsolidasi/pasal-9.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-1.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-10.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-11.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-12.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-13.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-14.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-15.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-16.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-17.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-17A.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-18.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-18A.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-19.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-2.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-20.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-21.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-22.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-23.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-24.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-25.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-26.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-27.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-28.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-29.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-2A.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-2B.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-3.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-30.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-31.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-31A.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-31B.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-32.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-33.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-34.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-35.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-36.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-37.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-4.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-5.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-6.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-6A.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-7.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-8.json
 M website/public/api/v1/consolidated/uu-pph-konsolidasi/pasal-9.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-1.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-10.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-11.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-12.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-13.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-13A.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-14.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-15.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16A.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16B.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16C.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16D.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16E.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16F.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-17.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-18.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-19.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-2.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-20.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-21.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-22.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-23.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-24.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-25.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-26.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-27.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-28.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-29.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-3.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-30.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-31.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-32.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-33.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-34.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-4.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-4A.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-5.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-6.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-6A.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-7.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-8.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-9.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-9A.json
 M website/public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-9B.json
 M website/public/api/v1/entries/bea-masuk-anti-dumping.json
 M website/public/api/v1/entries/bea-masuk-asean-atiga.json
 M website/public/api/v1/entries/bea-masuk-bmt.json
 M website/public/api/v1/entries/bea-masuk-umum-mf.json
 M website/public/api/v1/entries/bea-meterai-1000.json
 M website/public/api/v1/entries/bea-meterai-3000.json
 M website/public/api/v1/entries/bea-meterai-cek-bilyet.json
 M website/public/api/v1/entries/bea-meterai-dokumen-2021.json
 M website/public/api/v1/entries/bea-meterai-kontrak.json
 M website/public/api/v1/entries/bea-meterai-nota-kredit.json
 M website/public/api/v1/entries/bea-meterai-pre2021.json
 M website/public/api/v1/entries/bea-meterai-surat-berharga.json
 M website/public/api/v1/entries/bphtb-pengalihan-dinkes.json
 M website/public/api/v1/entries/bphtb-perolehan-umum.json
 M website/public/api/v1/entries/bphtb-perolehan-waris.json
 M website/public/api/v1/entries/cukai-ecigarette.json
 M website/public/api/v1/entries/cukai-eti-alkohol.json
 M website/public/api/v1/entries/cukai-hasil-tembakau.json
 M website/public/api/v1/entries/index.json
 M website/public/api/v1/entries/pajak-daerah-air-tanah.json
 M website/public/api/v1/entries/pajak-daerah-hiburan.json
 M website/public/api/v1/entries/pajak-daerah-hotel.json
 M website/public/api/v1/entries/pajak-daerah-mineral-air.json
 M website/public/api/v1/entries/pajak-daerah-parkir.json
 M website/public/api/v1/entries/pajak-daerah-penerangan-jalan.json
 M website/public/api/v1/entries/pajak-daerah-reklame.json
 M website/public/api/v1/entries/pajak-daerah-restoran.json
 M website/public/api/v1/entries/pbb-kehutanan.json
 M website/public/api/v1/entries/pbb-perkebunan.json
 M website/public/api/v1/entries/pbb-perkotaan.json
 M website/public/api/v1/entries/pbb-pertambangan.json
 M website/public/api/v1/entries/pph-15-buta-charter.json
 M website/public/api/v1/entries/pph-15-pelayaran-domestik.json
 M website/public/api/v1/entries/pph-15-penerbangan-domestik.json
 M website/public/api/v1/entries/pph-15-perusahaan-asuransi.json
 M website/public/api/v1/entries/pph-15-perusahaan-kontraktor.json
 M website/public/api/v1/entries/pph-15-pma-opec.json
 M website/public/api/v1/entries/pph-21-dana-pensiun.json
 M website/public/api/v1/entries/pph-21-honorarium-bukan-pegawai.json
 M website/public/api/v1/entries/pph-21-natura-kenikmatan.json
 M website/public/api/v1/entries/pph-21-non-taxable-income.json
 M website/public/api/v1/entries/pph-21-norma-akuntan.json
 M website/public/api/v1/entries/pph-21-norma-arsitek.json
 M website/public/api/v1/entries/pph-21-norma-dokter.json
 M website/public/api/v1/entries/pph-21-norma-konsultan.json
 M website/public/api/v1/entries/pph-21-norma-notaris.json
 M website/public/api/v1/entries/pph-21-norma-pedagang.json
 M website/public/api/v1/entries/pph-21-norma-pengacara.json
 M website/public/api/v1/entries/pph-21-norma-pengusaha-kecil.json
 M website/public/api/v1/entries/pph-21-norma-petani.json
 M website/public/api/v1/entries/pph-21-pegawai-tidak-tetap.json
 M website/public/api/v1/entries/pph-21-progressive-annual-2024.json
 M website/public/api/v1/entries/pph-21-progressive-monthly-pre2024.json
 M website/public/api/v1/entries/pph-21-progressive-pre2009.json
 M website/public/api/v1/entries/pph-21-progressive-pre2022.json
 M website/public/api/v1/entries/pph-21-progressive-uulama1983.json
 M website/public/api/v1/entries/pph-21-progressive-uulama1994.json
 M website/public/api/v1/entries/pph-21-ptkp-1984.json
 M website/public/api/v1/entries/pph-21-ptkp-1995.json
 M website/public/api/v1/entries/pph-21-ptkp-2005.json
 M website/public/api/v1/entries/pph-21-ptkp-2009.json
 M website/public/api/v1/entries/pph-21-shu-koperasi.json
 M website/public/api/v1/entries/pph-21-ter-a-detail.json
 M website/public/api/v1/entries/pph-21-ter-b-detail.json
 M website/public/api/v1/entries/pph-21-ter-c-detail.json
 M website/public/api/v1/entries/pph-21-ter-monthly-2024.json
 M website/public/api/v1/entries/pph-22-bendaharawan.json
 M website/public/api/v1/entries/pph-22-bumn-pembelian.json
 M website/public/api/v1/entries/pph-22-ekspor-batubara.json
 M website/public/api/v1/entries/pph-22-impor-2024.json
 M website/public/api/v1/entries/pph-22-impor-api-produsen.json
 M website/public/api/v1/entries/pph-22-kripto.json
 M website/public/api/v1/entries/pph-22-pembelian-barang-2024.json
 M website/public/api/v1/entries/pph-22-pengadaan-pemerintah.json
 M website/public/api/v1/entries/pph-22-penjualan-barang-2024.json
 M website/public/api/v1/entries/pph-22-pmse.json
 M website/public/api/v1/entries/pph-22-pre2024.json
 M website/public/api/v1/entries/pph-23-hadiah-penghargaan.json
 M website/public/api/v1/entries/pph-23-jasa-2001.json
 M website/public/api/v1/entries/pph-23-jasa-katering-2pct.json
 M website/public/api/v1/entries/pph-23-jasa-lain-2pct.json
 M website/public/api/v1/entries/pph-23-jasa-lain-4pct.json
 M website/public/api/v1/entries/pph-23-jasa-pre2001.json
 M website/public/api/v1/entries/pph-23-katering-pre2015.json
 M website/public/api/v1/entries/pph-23-sewa-tanah-bangunan.json
 M website/public/api/v1/entries/pph-26-bunga.json
 M website/public/api/v1/entries/pph-26-but.json
 M website/public/api/v1/entries/pph-26-dividen.json
 M website/public/api/v1/entries/pph-26-general-2024.json
 M website/public/api/v1/entries/pph-26-jasa-dan-sewa.json
 M website/public/api/v1/entries/pph-26-royalti.json
 M website/public/api/v1/entries/pph-26-tax-treaty.json
 M website/public/api/v1/entries/pph-badan-2022-plus.json
 M website/public/api/v1/entries/pph-badan-go-public.json
 M website/public/api/v1/entries/pph-badan-ikn-0pct.json
 M website/public/api/v1/entries/pph-badan-ikn-10y.json
 M website/public/api/v1/entries/pph-badan-pre2001.json
 M website/public/api/v1/entries/pph-badan-pre2010.json
 M website/public/api/v1/entries/pph-badan-pre2022.json
 M website/public/api/v1/entries/pph-badan-umkm.json
 M website/public/api/v1/entries/pph-final-bunga-deposito.json
 M website/public/api/v1/entries/pph-final-bunga-koperasi.json
 M website/public/api/v1/entries/pph-final-bunga-pre2009.json
 M website/public/api/v1/entries/pph-final-hadiah-undian.json
 M website/public/api/v1/entries/pph-final-investasi-lpi.json
 M website/public/api/v1/entries/pph-final-konstruksi.json
 M website/public/api/v1/entries/pph-final-migas.json
 M website/public/api/v1/entries/pph-final-pengalihan-pp131.json
 M website/public/api/v1/entries/pph-final-pengalihan-pp71.json
 M website/public/api/v1/entries/pph-final-sewa-tanah.json
 M website/public/api/v1/entries/pph-final-transaksi-saham-bursa.json
 M website/public/api/v1/entries/pph-final-transportasi.json
 M website/public/api/v1/entries/pph-umkm-05pct-2018.json
 M website/public/api/v1/entries/pph-umkm-05pct-2023.json
 M website/public/api/v1/entries/pph-umkm-1pct-pp46.json
 M website/public/api/v1/entries/ppn-10pct.json
 M website/public/api/v1/entries/ppn-11pct-2022.json
 M website/public/api/v1/entries/ppn-11pct-effective-2025.json
 M website/public/api/v1/entries/ppn-dpp-penghitungan.json
 M website/public/api/v1/entries/ppn-ekspor-bkp.json
 M website/public/api/v1/entries/ppn-ekspor-jkp.json
 M website/public/api/v1/entries/ppn-impor-bkp.json
 M website/public/api/v1/entries/ppn-jasa-kegiatan-usaha-persewaan.json
 M website/public/api/v1/entries/ppn-jasa-telekomunikasi.json
 M website/public/api/v1/entries/ppn-jasa-tenaga-listrik.json
 M website/public/api/v1/entries/ppn-jkpt-industri.json
 M website/public/api/v1/entries/ppn-pengkreditan.json
 M website/public/api/v1/entries/ppn-pmse.json
 M website/public/api/v1/entries/ppn-tidak-kena-pajak.json
 M website/public/api/v1/entries/ppnbm-general.json
 M website/public/api/v1/entries/ppnbm-kapal-pesiar.json
 M website/public/api/v1/entries/ppnbm-perlengkapan-mewah.json
 M website/public/api/v1/entries/ppnbm-pesawat-pribadi.json
 M website/public/api/v1/entries/ppnbm-rumah-mewah.json
 M website/public/api/v1/entries/ppnbm-sedan-station-wagon.json
 M website/public/api/v1/entries/ppnbm-suv-4x4.json
 M website/public/api/v1/entries/ppnbm-van-wagon.json
 M website/public/api/v1/index.json
 M website/public/api/v1/openapi.json
 M website/public/api/v1/regulations/index.json
 M website/public/api/v1/regulations/perpres-55-2013.json
 M website/public/api/v1/regulations/pmk-122-2015.json
 M website/public/api/v1/regulations/pmk-131-2024.json
 M website/public/api/v1/regulations/pmk-138-2005.json
 M website/public/api/v1/regulations/pmk-141-2015.json
 M website/public/api/v1/regulations/pmk-162-2009.json
 M website/public/api/v1/regulations/pmk-168-2023.json
 M website/public/api/v1/regulations/pmk-202-2023.json
 M website/public/api/v1/regulations/pmk-43-2022.json
 M website/public/api/v1/regulations/pmk-523-2002.json
 M website/public/api/v1/regulations/pp-131-2000.json
 M website/public/api/v1/regulations/pp-14-2002.json
 M website/public/api/v1/regulations/pp-16-2009.json
 M website/public/api/v1/regulations/pp-23-2000.json
 M website/public/api/v1/regulations/pp-23-2018.json
 M website/public/api/v1/regulations/pp-28-2023.json
 M website/public/api/v1/regulations/pp-40-2009.json
 M website/public/api/v1/regulations/pp-44-2022.json
 M website/public/api/v1/regulations/pp-46-2013.json
 M website/public/api/v1/regulations/pp-51-2008.json
 M website/public/api/v1/regulations/pp-55-2022.json
 M website/public/api/v1/regulations/pp-58-2023.json
 M website/public/api/v1/regulations/pp-60-2023.json
 M website/public/api/v1/regulations/pp-71-2008.json
 M website/public/api/v1/regulations/pp-80-2007.json
 M website/public/api/v1/regulations/pp-94-2010.json
 M website/public/api/v1/regulations/uu-1-2022-hkpd.json
 M website/public/api/v1/regulations/uu-10-1994.json
 M website/public/api/v1/regulations/uu-10-1995.json
 M website/public/api/v1/regulations/uu-10-2020-bea-meterai.json
 M website/public/api/v1/regulations/uu-13-1985.json
 M website/public/api/v1/regulations/uu-17-2000.json
 M website/public/api/v1/regulations/uu-28-2009.json
 M website/public/api/v1/regulations/uu-36-2008.json
 M website/public/api/v1/regulations/uu-39-2007.json
 M website/public/api/v1/regulations/uu-42-2009.json
 M website/public/api/v1/regulations/uu-7-1983-pph.json
 M website/public/api/v1/regulations/uu-7-2021-hpp.json
 M website/public/api/v1/regulations/uu-8-1983-ppn.json
 M website/public/api/v1/search-index.json
 M website/public/api/v1/stats.json
 M website/public/api/v1/timeline/bea-meterai.json
 M website/public/api/v1/timeline/index.json
 M website/public/api/v1/timeline/pph-21-monthly.json
 M website/public/api/v1/timeline/pph-21-progressive.json
 M website/public/api/v1/timeline/pph-21-ptkp.json
 M website/public/api/v1/timeline/pph-23-jasa.json
 M website/public/api/v1/timeline/pph-badan.json
 M website/public/api/v1/timeline/pph-final-bunga.json
 M website/public/api/v1/timeline/pph-final-pengalihan.json
 M website/public/api/v1/timeline/pph-umkm.json
 M website/public/api/v1/timeline/ppn.json
 M website/public/llms.txt
 M website/public/rates.json
 M website/public/regulations.json
?? .superpowers/
?? docs/
?? pnpm-workspace.yaml
?? public/api/
?? public/generated-manifest.json
?? public/release.json
?? src/core/
?? src/generate.ts
?? src/paths.ts
?? src/pipeline.ts
?? src/sync-website.ts
?? src/validate.ts
?? src/validation/
?? tests/
?? vitest.config.ts
?? website/pnpm-workspace.yaml
?? website/public/consolidated.json
?? website/public/generated-manifest.json
?? website/public/release.json

```

## Diff Stat
```text
 .gitignore                                         |     1 +
 package.json                                       |    20 +-
 pnpm-lock.yaml                                     |  1008 +
 public/api.json                                    |     2 +-
 public/llms.txt                                    |     6 +-
 src/build-api.ts                                   |   518 +-
 src/build.ts                                       |   247 +-
 tsconfig.json                                      |    11 +-
 website/public/api.json                            |  1988 +-
 website/public/api/v1/bppu/22-100.json             |     2 +-
 website/public/api/v1/bppu/22-101.json             |    18 +-
 website/public/api/v1/bppu/22-102.json             |    16 +-
 website/public/api/v1/bppu/22-200.json             |     2 +-
 website/public/api/v1/bppu/22-401.json             |     2 +-
 website/public/api/v1/bppu/22-403.json             |     2 +-
 website/public/api/v1/bppu/22-404.json             |    10 +-
 website/public/api/v1/bppu/22-405.json             |    20 +-
 website/public/api/v1/bppu/22-900.json             |    10 +-
 website/public/api/v1/bppu/22-910.json             |    10 +-
 website/public/api/v1/bppu/24-100.json             |    16 +-
 website/public/api/v1/bppu/24-101.json             |    10 +-
 website/public/api/v1/bppu/24-102.json             |    10 +-
 website/public/api/v1/bppu/24-103.json             |     2 +-
 website/public/api/v1/bppu/24-104.json             |   952 +-
 website/public/api/v1/bppu/24-105.json             |     2 +-
 website/public/api/v1/bppu/28-401.json             |    16 +-
 website/public/api/v1/bppu/28-402.json             |     2 +-
 website/public/api/v1/bppu/28-403.json             |     2 +-
 website/public/api/v1/bppu/28-404.json             |     2 +-
 website/public/api/v1/bppu/28-405.json             |     2 +-
 website/public/api/v1/bppu/28-406.json             |     2 +-
 website/public/api/v1/bppu/28-407.json             |     2 +-
 website/public/api/v1/bppu/28-408.json             |     2 +-
 website/public/api/v1/bppu/28-409.json             |    78 +-
 website/public/api/v1/bppu/28-410.json             |    10 +-
 website/public/api/v1/bppu/28-411.json             |    10 +-
 website/public/api/v1/bppu/28-413.json             |     2 +-
 website/public/api/v1/bppu/28-417.json             |     2 +-
 website/public/api/v1/bppu/28-419.json             |     2 +-
 website/public/api/v1/bppu/28-421.json             |     2 +-
 website/public/api/v1/bppu/28-423.json             |     2 +-
 website/public/api/v1/bppu/28-499.json             |    14 +-
 website/public/api/v1/bppu/29-101.json             |     2 +-
 website/public/api/v1/bppu/index.json              |  1350 +-
 website/public/api/v1/by-year/1984.json            |     2 +-
 website/public/api/v1/by-year/1985.json            |     2 +-
 website/public/api/v1/by-year/1986.json            |     2 +-
 website/public/api/v1/by-year/1987.json            |     2 +-
 website/public/api/v1/by-year/1988.json            |     2 +-
 website/public/api/v1/by-year/1989.json            |     2 +-
 website/public/api/v1/by-year/1990.json            |     2 +-
 website/public/api/v1/by-year/1991.json            |     2 +-
 website/public/api/v1/by-year/1992.json            |     2 +-
 website/public/api/v1/by-year/1993.json            |     2 +-
 website/public/api/v1/by-year/1994.json            |     2 +-
 website/public/api/v1/by-year/1995.json            |     2 +-
 website/public/api/v1/by-year/1996.json            |     2 +-
 website/public/api/v1/by-year/1997.json            |     2 +-
 website/public/api/v1/by-year/1998.json            |     2 +-
 website/public/api/v1/by-year/1999.json            |     2 +-
 website/public/api/v1/by-year/2000.json            |     2 +-
 website/public/api/v1/by-year/2001.json            |     2 +-
 website/public/api/v1/by-year/2002.json            |     2 +-
 website/public/api/v1/by-year/2003.json            |     2 +-
 website/public/api/v1/by-year/2004.json            |     2 +-
 website/public/api/v1/by-year/2005.json            |     2 +-
 website/public/api/v1/by-year/2006.json            |     2 +-
 website/public/api/v1/by-year/2007.json            |     2 +-
 website/public/api/v1/by-year/2008.json            |     2 +-
 website/public/api/v1/by-year/2009.json            |     2 +-
 website/public/api/v1/by-year/2010.json            |     2 +-
 website/public/api/v1/by-year/2011.json            |     2 +-
 website/public/api/v1/by-year/2012.json            |     2 +-
 website/public/api/v1/by-year/2013.json            |     2 +-
 website/public/api/v1/by-year/2014.json            |     2 +-
 website/public/api/v1/by-year/2015.json            |     2 +-
 website/public/api/v1/by-year/2016.json            |     2 +-
 website/public/api/v1/by-year/2017.json            |     2 +-
 website/public/api/v1/by-year/2018.json            |     2 +-
 website/public/api/v1/by-year/2019.json            |     2 +-
 website/public/api/v1/by-year/2020.json            |     2 +-
 website/public/api/v1/by-year/2021.json            |     2 +-
 website/public/api/v1/by-year/2022.json            |     2 +-
 website/public/api/v1/by-year/2023.json            |     2 +-
 website/public/api/v1/by-year/2024.json            |     2 +-
 website/public/api/v1/by-year/2025.json            |     2 +-
 website/public/api/v1/by-year/2026.json            |     2 +-
 website/public/api/v1/calculator/index.json        |     2 +-
 website/public/api/v1/calculator/pph-21.json       |     2 +-
 website/public/api/v1/calculator/pph-23.json       |     2 +-
 website/public/api/v1/calculator/pph-badan.json    |     2 +-
 website/public/api/v1/calculator/ppn.json          |     2 +-
 website/public/api/v1/categories/bea-masuk.json    |     2 +-
 website/public/api/v1/categories/bea-meterai.json  |     2 +-
 website/public/api/v1/categories/bphtb.json        |     2 +-
 website/public/api/v1/categories/cukai.json        |     2 +-
 website/public/api/v1/categories/index.json        |     2 +-
 website/public/api/v1/categories/pajak-daerah.json |     2 +-
 website/public/api/v1/categories/pbb.json          |     2 +-
 website/public/api/v1/categories/pph-21.json       |     2 +-
 website/public/api/v1/categories/pph-22.json       |     2 +-
 website/public/api/v1/categories/pph-23.json       |     2 +-
 website/public/api/v1/categories/pph-26.json       |     2 +-
 .../public/api/v1/categories/pph-4-2-final.json    |     2 +-
 website/public/api/v1/categories/pph-badan.json    |     2 +-
 website/public/api/v1/categories/pph-umkm.json     |     2 +-
 website/public/api/v1/categories/ppn.json          |     2 +-
 website/public/api/v1/categories/ppnbm.json        |     2 +-
 website/public/api/v1/consolidated/index.json      |     2 +-
 .../api/v1/consolidated/uu-kup-konsolidasi.json    |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-1.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-10.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-11.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-12.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-13.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-14.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-15.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-16.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-17.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-17A.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-18.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-19.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-2.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-20.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-21.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-22.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-23.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-24.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-25.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-26.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-27.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-28.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-29.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-2A.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-3.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-30.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-31.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-32.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-33.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-34.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-35.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-36.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-37.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-38.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-39.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-4.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-40.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-41.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-42.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-43.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-43A.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-43B.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44A.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44B.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44C.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44D.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44E.json |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-45.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-46.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-47.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-48.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-49.json  |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-5.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-6.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-7.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-8.json   |     2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-9.json   |     2 +-
 .../api/v1/consolidated/uu-pph-konsolidasi.json    |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-1.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-10.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-11.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-12.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-13.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-14.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-15.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-16.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-17.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-17A.json |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-18.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-18A.json |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-19.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-2.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-20.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-21.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-22.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-23.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-24.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-25.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-26.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-27.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-28.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-29.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-2A.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-2B.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-3.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-30.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-31.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-31A.json |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-31B.json |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-32.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-33.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-34.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-35.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-36.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-37.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-4.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-5.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-6.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-6A.json  |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-7.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-8.json   |     2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-9.json   |     2 +-
 .../api/v1/consolidated/uu-ppn-konsolidasi.json    |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-1.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-10.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-11.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-12.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-13.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-13A.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-14.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-15.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16A.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16B.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16C.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16D.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16E.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16F.json |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-17.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-18.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-19.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-2.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-20.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-21.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-22.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-23.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-24.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-25.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-26.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-27.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-28.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-29.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-3.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-30.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-31.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-32.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-33.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-34.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-4.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-4A.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-5.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-6.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-6A.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-7.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-8.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-9.json   |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-9A.json  |     2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-9B.json  |     2 +-
 .../api/v1/entries/bea-masuk-anti-dumping.json     |     2 +-
 .../api/v1/entries/bea-masuk-asean-atiga.json      |     2 +-
 website/public/api/v1/entries/bea-masuk-bmt.json   |     2 +-
 .../public/api/v1/entries/bea-masuk-umum-mf.json   |     2 +-
 .../public/api/v1/entries/bea-meterai-1000.json    |     2 +-
 .../public/api/v1/entries/bea-meterai-3000.json    |     2 +-
 .../api/v1/entries/bea-meterai-cek-bilyet.json     |     2 +-
 .../api/v1/entries/bea-meterai-dokumen-2021.json   |     2 +-
 .../public/api/v1/entries/bea-meterai-kontrak.json |     2 +-
 .../api/v1/entries/bea-meterai-nota-kredit.json    |     2 +-
 .../public/api/v1/entries/bea-meterai-pre2021.json |     2 +-
 .../api/v1/entries/bea-meterai-surat-berharga.json |     2 +-
 .../api/v1/entries/bphtb-pengalihan-dinkes.json    |     2 +-
 .../api/v1/entries/bphtb-perolehan-umum.json       |     2 +-
 .../api/v1/entries/bphtb-perolehan-waris.json      |     2 +-
 .../public/api/v1/entries/cukai-ecigarette.json    |     2 +-
 .../public/api/v1/entries/cukai-eti-alkohol.json   |     2 +-
 .../api/v1/entries/cukai-hasil-tembakau.json       |     2 +-
 website/public/api/v1/entries/index.json           |     2 +-
 .../api/v1/entries/pajak-daerah-air-tanah.json     |     2 +-
 .../api/v1/entries/pajak-daerah-hiburan.json       |     2 +-
 .../public/api/v1/entries/pajak-daerah-hotel.json  |     2 +-
 .../api/v1/entries/pajak-daerah-mineral-air.json   |     2 +-
 .../public/api/v1/entries/pajak-daerah-parkir.json |     2 +-
 .../v1/entries/pajak-daerah-penerangan-jalan.json  |     2 +-
 .../api/v1/entries/pajak-daerah-reklame.json       |     2 +-
 .../api/v1/entries/pajak-daerah-restoran.json      |     2 +-
 website/public/api/v1/entries/pbb-kehutanan.json   |     2 +-
 website/public/api/v1/entries/pbb-perkebunan.json  |     2 +-
 website/public/api/v1/entries/pbb-perkotaan.json   |     2 +-
 .../public/api/v1/entries/pbb-pertambangan.json    |     2 +-
 .../public/api/v1/entries/pph-15-buta-charter.json |     2 +-
 .../api/v1/entries/pph-15-pelayaran-domestik.json  |     2 +-
 .../v1/entries/pph-15-penerbangan-domestik.json    |     2 +-
 .../api/v1/entries/pph-15-perusahaan-asuransi.json |     2 +-
 .../v1/entries/pph-15-perusahaan-kontraktor.json   |     2 +-
 website/public/api/v1/entries/pph-15-pma-opec.json |     2 +-
 .../public/api/v1/entries/pph-21-dana-pensiun.json |     2 +-
 .../entries/pph-21-honorarium-bukan-pegawai.json   |     2 +-
 .../api/v1/entries/pph-21-natura-kenikmatan.json   |     2 +-
 .../api/v1/entries/pph-21-non-taxable-income.json  |     2 +-
 .../api/v1/entries/pph-21-norma-akuntan.json       |     2 +-
 .../api/v1/entries/pph-21-norma-arsitek.json       |     2 +-
 .../public/api/v1/entries/pph-21-norma-dokter.json |     2 +-
 .../api/v1/entries/pph-21-norma-konsultan.json     |     2 +-
 .../api/v1/entries/pph-21-norma-notaris.json       |     2 +-
 .../api/v1/entries/pph-21-norma-pedagang.json      |     2 +-
 .../api/v1/entries/pph-21-norma-pengacara.json     |     2 +-
 .../v1/entries/pph-21-norma-pengusaha-kecil.json   |     2 +-
 .../public/api/v1/entries/pph-21-norma-petani.json |     2 +-
 .../api/v1/entries/pph-21-pegawai-tidak-tetap.json |     2 +-
 .../v1/entries/pph-21-progressive-annual-2024.json |     2 +-
 .../pph-21-progressive-monthly-pre2024.json        |     2 +-
 .../api/v1/entries/pph-21-progressive-pre2009.json |     2 +-
 .../api/v1/entries/pph-21-progressive-pre2022.json |     2 +-
 .../v1/entries/pph-21-progressive-uulama1983.json  |     2 +-
 .../v1/entries/pph-21-progressive-uulama1994.json  |     2 +-
 .../public/api/v1/entries/pph-21-ptkp-1984.json    |     2 +-
 .../public/api/v1/entries/pph-21-ptkp-1995.json    |     2 +-
 .../public/api/v1/entries/pph-21-ptkp-2005.json    |     2 +-
 .../public/api/v1/entries/pph-21-ptkp-2009.json    |     2 +-
 .../public/api/v1/entries/pph-21-shu-koperasi.json |     2 +-
 .../public/api/v1/entries/pph-21-ter-a-detail.json |     2 +-
 .../public/api/v1/entries/pph-21-ter-b-detail.json |     2 +-
 .../public/api/v1/entries/pph-21-ter-c-detail.json |     2 +-
 .../api/v1/entries/pph-21-ter-monthly-2024.json    |     2 +-
 .../public/api/v1/entries/pph-22-bendaharawan.json |     2 +-
 .../api/v1/entries/pph-22-bumn-pembelian.json      |     2 +-
 .../api/v1/entries/pph-22-ekspor-batubara.json     |     2 +-
 .../public/api/v1/entries/pph-22-impor-2024.json   |     2 +-
 .../api/v1/entries/pph-22-impor-api-produsen.json  |     2 +-
 website/public/api/v1/entries/pph-22-kripto.json   |     2 +-
 .../v1/entries/pph-22-pembelian-barang-2024.json   |     2 +-
 .../v1/entries/pph-22-pengadaan-pemerintah.json    |     2 +-
 .../v1/entries/pph-22-penjualan-barang-2024.json   |     2 +-
 website/public/api/v1/entries/pph-22-pmse.json     |     2 +-
 website/public/api/v1/entries/pph-22-pre2024.json  |     2 +-
 .../api/v1/entries/pph-23-hadiah-penghargaan.json  |     2 +-
 .../public/api/v1/entries/pph-23-jasa-2001.json    |     2 +-
 .../api/v1/entries/pph-23-jasa-katering-2pct.json  |     2 +-
 .../api/v1/entries/pph-23-jasa-lain-2pct.json      |     2 +-
 .../api/v1/entries/pph-23-jasa-lain-4pct.json      |     2 +-
 .../public/api/v1/entries/pph-23-jasa-pre2001.json |     2 +-
 .../api/v1/entries/pph-23-katering-pre2015.json    |     2 +-
 .../api/v1/entries/pph-23-sewa-tanah-bangunan.json |     2 +-
 website/public/api/v1/entries/pph-26-bunga.json    |     2 +-
 website/public/api/v1/entries/pph-26-but.json      |     2 +-
 website/public/api/v1/entries/pph-26-dividen.json  |     2 +-
 .../public/api/v1/entries/pph-26-general-2024.json |     2 +-
 .../api/v1/entries/pph-26-jasa-dan-sewa.json       |     2 +-
 website/public/api/v1/entries/pph-26-royalti.json  |     2 +-
 .../public/api/v1/entries/pph-26-tax-treaty.json   |     2 +-
 .../public/api/v1/entries/pph-badan-2022-plus.json |     2 +-
 .../public/api/v1/entries/pph-badan-go-public.json |     2 +-
 .../public/api/v1/entries/pph-badan-ikn-0pct.json  |     2 +-
 .../public/api/v1/entries/pph-badan-ikn-10y.json   |     2 +-
 .../public/api/v1/entries/pph-badan-pre2001.json   |     2 +-
 .../public/api/v1/entries/pph-badan-pre2010.json   |     2 +-
 .../public/api/v1/entries/pph-badan-pre2022.json   |     2 +-
 website/public/api/v1/entries/pph-badan-umkm.json  |     2 +-
 .../api/v1/entries/pph-final-bunga-deposito.json   |     2 +-
 .../api/v1/entries/pph-final-bunga-koperasi.json   |     2 +-
 .../api/v1/entries/pph-final-bunga-pre2009.json    |     2 +-
 .../api/v1/entries/pph-final-hadiah-undian.json    |     2 +-
 .../api/v1/entries/pph-final-investasi-lpi.json    |     2 +-
 .../api/v1/entries/pph-final-konstruksi.json       |     2 +-
 website/public/api/v1/entries/pph-final-migas.json |     2 +-
 .../api/v1/entries/pph-final-pengalihan-pp131.json |     2 +-
 .../api/v1/entries/pph-final-pengalihan-pp71.json  |     2 +-
 .../api/v1/entries/pph-final-sewa-tanah.json       |     2 +-
 .../entries/pph-final-transaksi-saham-bursa.json   |     2 +-
 .../api/v1/entries/pph-final-transportasi.json     |     2 +-
 .../public/api/v1/entries/pph-umkm-05pct-2018.json |     2 +-
 .../public/api/v1/entries/pph-umkm-05pct-2023.json |     2 +-
 .../public/api/v1/entries/pph-umkm-1pct-pp46.json  |     2 +-
 website/public/api/v1/entries/ppn-10pct.json       |     2 +-
 website/public/api/v1/entries/ppn-11pct-2022.json  |     2 +-
 .../api/v1/entries/ppn-11pct-effective-2025.json   |     2 +-
 .../api/v1/entries/ppn-dpp-penghitungan.json       |     2 +-
 website/public/api/v1/entries/ppn-ekspor-bkp.json  |     2 +-
 website/public/api/v1/entries/ppn-ekspor-jkp.json  |     2 +-
 website/public/api/v1/entries/ppn-impor-bkp.json   |     2 +-
 .../entries/ppn-jasa-kegiatan-usaha-persewaan.json |     2 +-
 .../api/v1/entries/ppn-jasa-telekomunikasi.json    |     2 +-
 .../api/v1/entries/ppn-jasa-tenaga-listrik.json    |     2 +-
 .../public/api/v1/entries/ppn-jkpt-industri.json   |     2 +-
 .../public/api/v1/entries/ppn-pengkreditan.json    |     2 +-
 website/public/api/v1/entries/ppn-pmse.json        |     2 +-
 .../api/v1/entries/ppn-tidak-kena-pajak.json       |     2 +-
 website/public/api/v1/entries/ppnbm-general.json   |     2 +-
 .../public/api/v1/entries/ppnbm-kapal-pesiar.json  |     2 +-
 .../api/v1/entries/ppnbm-perlengkapan-mewah.json   |     2 +-
 .../api/v1/entries/ppnbm-pesawat-pribadi.json      |     2 +-
 .../public/api/v1/entries/ppnbm-rumah-mewah.json   |     2 +-
 .../api/v1/entries/ppnbm-sedan-station-wagon.json  |     2 +-
 website/public/api/v1/entries/ppnbm-suv-4x4.json   |     2 +-
 website/public/api/v1/entries/ppnbm-van-wagon.json |     2 +-
 website/public/api/v1/index.json                   |     2 +-
 website/public/api/v1/openapi.json                 |   148 +-
 website/public/api/v1/regulations/index.json       |     2 +-
 .../public/api/v1/regulations/perpres-55-2013.json |     2 +-
 .../public/api/v1/regulations/pmk-122-2015.json    |     2 +-
 .../public/api/v1/regulations/pmk-131-2024.json    |     2 +-
 .../public/api/v1/regulations/pmk-138-2005.json    |     2 +-
 .../public/api/v1/regulations/pmk-141-2015.json    |     2 +-
 .../public/api/v1/regulations/pmk-162-2009.json    |     2 +-
 .../public/api/v1/regulations/pmk-168-2023.json    |     2 +-
 .../public/api/v1/regulations/pmk-202-2023.json    |     2 +-
 website/public/api/v1/regulations/pmk-43-2022.json |     2 +-
 .../public/api/v1/regulations/pmk-523-2002.json    |     2 +-
 website/public/api/v1/regulations/pp-131-2000.json |     2 +-
 website/public/api/v1/regulations/pp-14-2002.json  |     2 +-
 website/public/api/v1/regulations/pp-16-2009.json  |     2 +-
 website/public/api/v1/regulations/pp-23-2000.json  |     2 +-
 website/public/api/v1/regulations/pp-23-2018.json  |     2 +-
 website/public/api/v1/regulations/pp-28-2023.json  |     2 +-
 website/public/api/v1/regulations/pp-40-2009.json  |     2 +-
 website/public/api/v1/regulations/pp-44-2022.json  |     2 +-
 website/public/api/v1/regulations/pp-46-2013.json  |     2 +-
 website/public/api/v1/regulations/pp-51-2008.json  |     2 +-
 website/public/api/v1/regulations/pp-55-2022.json  |     2 +-
 website/public/api/v1/regulations/pp-58-2023.json  |     2 +-
 website/public/api/v1/regulations/pp-60-2023.json  |     2 +-
 website/public/api/v1/regulations/pp-71-2008.json  |     2 +-
 website/public/api/v1/regulations/pp-80-2007.json  |     2 +-
 website/public/api/v1/regulations/pp-94-2010.json  |     2 +-
 .../public/api/v1/regulations/uu-1-2022-hkpd.json  |     2 +-
 website/public/api/v1/regulations/uu-10-1994.json  |     2 +-
 website/public/api/v1/regulations/uu-10-1995.json  |     2 +-
 .../api/v1/regulations/uu-10-2020-bea-meterai.json |     2 +-
 website/public/api/v1/regulations/uu-13-1985.json  |     2 +-
 website/public/api/v1/regulations/uu-17-2000.json  |     2 +-
 website/public/api/v1/regulations/uu-28-2009.json  |     2 +-
 website/public/api/v1/regulations/uu-36-2008.json  |     2 +-
 website/public/api/v1/regulations/uu-39-2007.json  |     2 +-
 website/public/api/v1/regulations/uu-42-2009.json  |     2 +-
 .../public/api/v1/regulations/uu-7-1983-pph.json   |     2 +-
 .../public/api/v1/regulations/uu-7-2021-hpp.json   |     2 +-
 .../public/api/v1/regulations/uu-8-1983-ppn.json   |     2 +-
 website/public/api/v1/search-index.json            | 18870 +++++++++----------
 website/public/api/v1/stats.json                   |     4 +-
 website/public/api/v1/timeline/bea-meterai.json    |     2 +-
 website/public/api/v1/timeline/index.json          |     2 +-
 website/public/api/v1/timeline/pph-21-monthly.json |     2 +-
 .../public/api/v1/timeline/pph-21-progressive.json |     2 +-
 website/public/api/v1/timeline/pph-21-ptkp.json    |     2 +-
 website/public/api/v1/timeline/pph-23-jasa.json    |     2 +-
 website/public/api/v1/timeline/pph-badan.json      |     2 +-
 .../public/api/v1/timeline/pph-final-bunga.json    |     2 +-
 .../api/v1/timeline/pph-final-pengalihan.json      |     2 +-
 website/public/api/v1/timeline/pph-umkm.json       |     2 +-
 website/public/api/v1/timeline/ppn.json            |     2 +-
 website/public/llms.txt                            |   796 +-
 452 files changed, 14986 insertions(+), 12029 deletions(-)

```

## Source Diff
```diff
diff --git a/.gitignore b/.gitignore
index c29f9f8..ccf5fea 100644
--- a/.gitignore
+++ b/.gitignore
@@ -7,3 +7,4 @@ dist/
 website/.astro/
 website/dist/
 website/node_modules/
+.staging/
diff --git a/package.json b/package.json
index 7c38791..51a1bb6 100644
--- a/package.json
+++ b/package.json
@@ -4,11 +4,17 @@
   "description": "Open database tarif pajak Indonesia - Indonesian tax rates open database",
   "type": "module",
   "scripts": {
-    "build": "node src/build.ts",
-    "validate": "node src/validate.ts",
-    "generate": "node src/generate.ts",
-    "build:api": "node src/build-api.ts",
-    "build:all": "npm run build && npm run build:api && cd website && npm run build"
+    "clean": "node --experimental-strip-types --eval \"import('./src/pipeline.ts').then(({ cleanGenerated }) => cleanGenerated())\"",
+    "validate": "node --experimental-strip-types src/validate.ts",
+    "test": "vitest run",
+    "test:contracts": "vitest run tests/contracts",
+    "generate": "node --experimental-strip-types src/generate.ts",
+    "sync": "node --experimental-strip-types src/sync-website.ts",
+    "build:site": "pnpm --dir website build",
+    "build": "node --experimental-strip-types src/pipeline.ts",
+    "check": "pnpm test && pnpm build",
+    "build:api": "node --experimental-strip-types src/build-api.ts",
+    "build:all": "pnpm build"
   },
   "keywords": [
     "pajak",
@@ -22,6 +28,8 @@
   "license": "MIT",
   "devDependencies": {
     "typescript": "^5.7.0",
-    "ajv": "^8.17.0"
+    "ajv": "^8.17.0",
+    "ajv-formats": "^3.0.1",
+    "vitest": "^3.2.4"
   }
 }
\ No newline at end of file
diff --git a/pnpm-lock.yaml b/pnpm-lock.yaml
index f6e5bf5..de61897 100644
--- a/pnpm-lock.yaml
+++ b/pnpm-lock.yaml
@@ -11,35 +11,818 @@ importers:
       ajv:
         specifier: ^8.17.0
         version: 8.20.0
+      ajv-formats:
+        specifier: ^3.0.1
+        version: 3.0.1(ajv@8.20.0)
       typescript:
         specifier: ^5.7.0
         version: 5.9.3
+      vitest:
+        specifier: ^3.2.4
+        version: 3.2.7
 
 packages:
 
+  '@esbuild/aix-ppc64@0.28.1':
+    resolution: {integrity: sha512-Svl7tq8k/08+p6CXPpRjQ1fKX+1odH/BQbb48fV6fj3CWHhsoIOoY87w1oHXm0qEpkIK3ZfVgp0hed3XBXzXMQ==}
+    engines: {node: '>=18'}
+    cpu: [ppc64]
+    os: [aix]
+
+  '@esbuild/android-arm64@0.28.1':
+    resolution: {integrity: sha512-34EGEbCIAgosYz6goLcopX6Mo7NyGv9tfwEM2/7Ce2VcVRk568iSvniGWcUXIy7wEDR1wzolcxcriFVrWYcwBg==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [android]
+
+  '@esbuild/android-arm@0.28.1':
+    resolution: {integrity: sha512-0k2F129Xdio1TdJfzJ8sy1Q47vUD2NnwdhiAf7drUN1EBTfPf4hsFCtmMgu/6m8JSzsBrlmVjudMBQqOfG8usQ==}
+    engines: {node: '>=18'}
+    cpu: [arm]
+    os: [android]
+
+  '@esbuild/android-x64@0.28.1':
+    resolution: {integrity: sha512-dbwY7ltSMDWsRatcRpCnES4F+im88OCUgGZjy52shC7GqHRE/cYlxNbB4Z4UpJswpcc4Qxd2oE/ufM0p61IKng==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [android]
+
+  '@esbuild/darwin-arm64@0.28.1':
+    resolution: {integrity: sha512-TZbWkQY7kvTAXbXUT7uVACR5cMHsDiSz9z7ZKAX/RTq/WJEk3QyRr0wZpNhBDX+/0CtdqUIJlOiodQcta6tY3Q==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [darwin]
+
+  '@esbuild/darwin-x64@0.28.1':
+    resolution: {integrity: sha512-zfdzgK9ACBNZLI/CyHTOx81SyNbM6YXn7rxSgX97VjyiPl9W1i4Ka4fgKECEoFCKGpvBj5qArWIGgQjOwkgskQ==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [darwin]
+
+  '@esbuild/freebsd-arm64@0.28.1':
+    resolution: {integrity: sha512-wG2EA8ENdEI0qhkSZMjfqrdY+ziCYCPMmtZjjIwOmXFjmyzEHn+UUxk5of+SYsjtfs3VpnlC7QLzSI5hY/rOAw==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [freebsd]
+
+  '@esbuild/freebsd-x64@0.28.1':
+    resolution: {integrity: sha512-i7dZ9vQgnvSCzi/rYCXNgtF/U+eKZNJBzu3eTQbRgHnM7tNSizLOkRFAl3qzVc/Op/u5YkHHa4pf/3DOYHthLQ==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [freebsd]
+
+  '@esbuild/linux-arm64@0.28.1':
+    resolution: {integrity: sha512-yHs+0uc8+nvEAfAfxrWQKK5peSNzBc4PegcMO0EJ2hT71uA7vB8Ihg2e77R2P7SG5uYjPbHlLLmve4LLLRCf0g==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [linux]
+
+  '@esbuild/linux-arm@0.28.1':
+    resolution: {integrity: sha512-qVXBOHQS+d5Y722GwJzJUtOLlX7km3CraOaGormF1pDtPd2C/l1SHRPgjLunLGe51Sh5YYWKMFDyV4SxgMQYTQ==}
+    engines: {node: '>=18'}
+    cpu: [arm]
+    os: [linux]
+
+  '@esbuild/linux-ia32@0.28.1':
+    resolution: {integrity: sha512-d1z4ZuP0ajrfz/FhGT4vv278rX8KnPPJx8i5+AtK7TYbx9Le9F1hyzurZpkEyjkGa9dUGhQow4C1NmeGvqxN2w==}
+    engines: {node: '>=18'}
+    cpu: [ia32]
+    os: [linux]
+
+  '@esbuild/linux-loong64@0.28.1':
+    resolution: {integrity: sha512-M5sRjUVZrkm1OAPR3dlOYzNmN+loZKGVi1VUQGrwuqLcbR6qeAz+famMhjASeH3YVKvZz+zT1jlh/keC3Rj/lg==}
+    engines: {node: '>=18'}
+    cpu: [loong64]
+    os: [linux]
+
+  '@esbuild/linux-mips64el@0.28.1':
+    resolution: {integrity: sha512-mRObBZeHh2OxcBFPWE/FjylkRgZdYuiTR3vaTozquCGOH14iP9oN4x4Ge81CoIDYQrXmIxpFumJBu5MtZpnQJQ==}
+    engines: {node: '>=18'}
+    cpu: [mips64el]
+    os: [linux]
+
+  '@esbuild/linux-ppc64@0.28.1':
+    resolution: {integrity: sha512-slScBsMAb3GFDcdrCgLwZtPYRoH2H/youv10QiZyRjmsP48fznoveWytSgCI/R0ZcUgpc0ZhIUEx6LHts8yrfQ==}
+    engines: {node: '>=18'}
+    cpu: [ppc64]
+    os: [linux]
+
+  '@esbuild/linux-riscv64@0.28.1':
+    resolution: {integrity: sha512-kw0owk1o0GFETUJyW0jc0G4Yzs0BHZn0JDZ8JRT088vjJYX777BAs1fDGxAC+q831qOs2DTC96mNsG2opdfyyQ==}
+    engines: {node: '>=18'}
+    cpu: [riscv64]
+    os: [linux]
+
+  '@esbuild/linux-s390x@0.28.1':
+    resolution: {integrity: sha512-/lAIjX8aYFRByhh6L5rYtPEDRqa9de/4V/juOXcta5frjvzXO4/sqEtyytse0g3zZFuWu5cDN0MkLz2qRDD2Ag==}
+    engines: {node: '>=18'}
+    cpu: [s390x]
+    os: [linux]
+
+  '@esbuild/linux-x64@0.28.1':
+    resolution: {integrity: sha512-u/anNYF2mmVOEDwLtnQ1wOr3EZ9sTNGLWrsYGYwHWzGA3Si84IOkHXlbWTD1NB+9/1lcnweYKO54uhxZydNzfA==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [linux]
+
+  '@esbuild/netbsd-arm64@0.28.1':
+    resolution: {integrity: sha512-oks0DYbLwWMmaakTsCb+zL4E+aHRVLom9IJZOAthMQEPiQmydXHkziYEsGYRx0uNV/IjEKGAV941JzH02pflqw==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [netbsd]
+
+  '@esbuild/netbsd-x64@0.28.1':
+    resolution: {integrity: sha512-aeL6lAnN89Hz43Mlh1G8ARasbuoYvSITDEx0tHh5b7jJnHcssqgjy9Yx430GDpmCa6OyrKoS0aNRjKundRizGg==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [netbsd]
+
+  '@esbuild/openbsd-arm64@0.28.1':
+    resolution: {integrity: sha512-MEFJe5C3R8pwXdZ5Y21oo6m7ePiS0d9pWucn99O/wvyJZChoIQKrQDxKrGeW8F5+T0okTHesAmDeiHDTIq0V/Q==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [openbsd]
+
+  '@esbuild/openbsd-x64@0.28.1':
+    resolution: {integrity: sha512-i/ZLIOafE0Z8cI/XANJAixoJL/uRAoS2xOA3rb0xN+KK0K177cMAsQYkzHtBrtMXAKuAc7HGgcWiZ/sRC1Nxgw==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [openbsd]
+
+  '@esbuild/openharmony-arm64@0.28.1':
+    resolution: {integrity: sha512-ge+Z7EXFNt2BO1oAMsVpiQ8EwndV9i1xXerAeTIK7AtPs3bKFXQM7nlRxDSIUIMeueR1CNXxqztLzdNeReKBJg==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [openharmony]
+
+  '@esbuild/sunos-x64@0.28.1':
+    resolution: {integrity: sha512-BEjgtECkL3vY+SaSQ6nzVfiALUeFxpawyp8Jmf5PtYhf1Ug40N1h/hxlhts+f1FvSvarEigdxS3BlSMI2PJLcQ==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [sunos]
+
+  '@esbuild/win32-arm64@0.28.1':
+    resolution: {integrity: sha512-lCv9eK/H6ZJWbE7bh2nw54CZ9M2nupBxJcTsdk/QQnWkdSjKGuxmmH8/GWrlT1eMmZfn4dGcCjRte397WqfQXA==}
+    engines: {node: '>=18'}
+    cpu: [arm64]
+    os: [win32]
+
+  '@esbuild/win32-ia32@0.28.1':
+    resolution: {integrity: sha512-zvb/mB2bSCoJOpoCBgYKKpX6YM6mJBlBUVUtVj41DlZJVEB6/0CKlRYxP5wWl1C1ILiCoAU5wZZ4q1P3qeS6Eg==}
+    engines: {node: '>=18'}
+    cpu: [ia32]
+    os: [win32]
+
+  '@esbuild/win32-x64@0.28.1':
+    resolution: {integrity: sha512-bm4Mowrv+GXMlpWX++EcXw/iLyd1o3+bJkC2DkWXYVvgZCqD/bSj9ctZeAMC3cIxgjRVR2Dufaiu4YPxr5gW1A==}
+    engines: {node: '>=18'}
+    cpu: [x64]
+    os: [win32]
+
+  '@jridgewell/sourcemap-codec@1.5.5':
+    resolution: {integrity: sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==}
+
+  '@napi-rs/lzma-linux-x64-gnu@1.5.1':
+    resolution: {integrity: sha512-oTXEIha4SsuXdTA4Iyskj0kpdx2yVXdhd75c2v3xGrHFfVMsbhTPZU/nMPL4sWKo4pBHm3aucLaqGlF696dTyQ==}
+    engines: {node: ^22.20 || ^24.12 || >=25}
+    cpu: [x64]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-android-arm-eabi@4.62.4':
+    resolution: {integrity: sha512-RrPokAb7dmbxFoeO3TloqHyOjgye8RkBhSqmp4aJMIex4c9r46ZstPnleDQOq1t46VOVjwIuwNogIqbodV1Vvg==}
+    cpu: [arm]
+    os: [android]
+
+  '@rollup/rollup-android-arm64@4.62.4':
+    resolution: {integrity: sha512-JKuJc+pnpks2pjy7L/N3v/cAkZxYlnmuZoD840ldbMI5KDbC4iO9NKwPKYdjYFCMAIIlBzYSFHxIJVYzRo2/8A==}
+    cpu: [arm64]
+    os: [android]
+
+  '@rollup/rollup-darwin-arm64@4.62.4':
+    resolution: {integrity: sha512-krw5uS2STmvJ02x0uTXHbqQNuz+9eZ1iw+qXk9dmW2gvV4jV7O2hEoOnuhFrpOPiel1mBFtqbxYZZtC46hXLOw==}
+    cpu: [arm64]
+    os: [darwin]
+
+  '@rollup/rollup-darwin-x64@4.62.4':
+    resolution: {integrity: sha512-wsTxtgApb4PrOsNJIm0FZ1h3WvCC+k9uxLJ4ad75hgoS4NiRes2SoJFlDAyMwiUY8IssDqGcHbXuN0sx1tfF1A==}
+    cpu: [x64]
+    os: [darwin]
+
+  '@rollup/rollup-freebsd-arm64@4.62.4':
+    resolution: {integrity: sha512-GUOnQlyZe3yAXhWOtOMsn5Qkrv5E5mZXa0thbARWi5Ei2szlVXJFQhddZ4HbAzh8q92w5twp+CQvs/eFanz9YQ==}
+    cpu: [arm64]
+    os: [freebsd]
+
+  '@rollup/rollup-freebsd-x64@4.62.4':
+    resolution: {integrity: sha512-/Y7f3QuxjzPKsjA/rfEDa3+0vXqyjmJ50Ln8dPpCmWkKTrUoWHG1cWhTqaAMLob2m2nESWuC7yGrREz019Ztqg==}
+    cpu: [x64]
+    os: [freebsd]
+
+  '@rollup/rollup-linux-arm-gnueabihf@4.62.4':
+    resolution: {integrity: sha512-81wiiX3v7aqy+T+bT61TJ78yJjRquqFFTTbAPt08imfQQzkPIW8t6aJbkTagtCCrXMNc9D66+geqlK7ydLPNqA==}
+    cpu: [arm]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-arm-musleabihf@4.62.4':
+    resolution: {integrity: sha512-9kmDIvNZqdoHOBZgNtpTBeLWYO/LVipM3H/j62P8848/l/VPEQL6N3uxU9pvP1oZAsXyC2MEnFP3ovRjo7WYNQ==}
+    cpu: [arm]
+    os: [linux]
+    libc: [musl]
+
+  '@rollup/rollup-linux-arm64-gnu@4.62.4':
+    resolution: {integrity: sha512-CcnXHWnXg69g+DX5VWL3FHts3qMRN2uVEHX+BZvGLdd07/gXkn3ePjYtO1LDJvxkGKVHMclKBRa1QUTH+6toYQ==}
+    cpu: [arm64]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-arm64-musl@4.62.4':
+    resolution: {integrity: sha512-iFOibiHnTRuhrWLlRsOQFdZJJIa7S8OwkneJr4ocALP16u5yk6lWLINFwhHaEqBFMsKDUZofLkGos7+CPzGB3g==}
+    cpu: [arm64]
+    os: [linux]
+    libc: [musl]
+
+  '@rollup/rollup-linux-loong64-gnu@4.62.4':
+    resolution: {integrity: sha512-XnWYMI7euHlb5a871xPja+Gm7DRCFU+FGRrtS2sMq9N8FvqtpagUy6gD4YOemC5MRk9xbh8+jYMEJbigFQwsgA==}
+    cpu: [loong64]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-loong64-musl@4.62.4':
+    resolution: {integrity: sha512-qGDAlO0U8xedCcsdRm9oaoQY8DAx/QT7uIxJWhCdx0ceIWX783UC9QSYkdpzAe29wNiVfp24+bZdQmn49o45SQ==}
+    cpu: [loong64]
+    os: [linux]
+    libc: [musl]
+
+  '@rollup/rollup-linux-ppc64-gnu@4.62.4':
+    resolution: {integrity: sha512-ru4H6ezD7ysA5EiEK6qkkaEb4modH8CTej6kUy/gQi20u3kB3G7Zn8snXXkeJSCOFKG/rbPPtM/+9Wgas1961w==}
+    cpu: [ppc64]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-ppc64-musl@4.62.4':
+    resolution: {integrity: sha512-2W4MO5WQVJnbJaZdvDb9rhBDuFU1nKIepPFpJUBsTh2k1YY2g+ODViaWuyOAjQ5cOP7NvrvLzt3wvHOoiAvc7w==}
+    cpu: [ppc64]
+    os: [linux]
+    libc: [musl]
+
+  '@rollup/rollup-linux-riscv64-gnu@4.62.4':
+    resolution: {integrity: sha512-+fxjfuoAmVMCYV5QyjoIpu0cp5DOiOTeqYFk1AVaxGr+/ravWLX89XfQmptsoWcaVy/TGf2hexzbUOrCQIL1CQ==}
+    cpu: [riscv64]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-riscv64-musl@4.62.4':
+    resolution: {integrity: sha512-jTn8JfHGL4djjFxPuM06LmNUJDsst2jeVlsd9OmIH6zc5sC9K6rIuO4YajXatLUpBmBKl6b35ro1QZocLi+tcA==}
+    cpu: [riscv64]
+    os: [linux]
+    libc: [musl]
+
+  '@rollup/rollup-linux-s390x-gnu@4.62.4':
+    resolution: {integrity: sha512-oCJCJL4pXsoDcP2QZ+JVlPTIRc6266zsIaeJJsWImmF7HO0W8nb6HuSgZlMWxJwaPf8ehbSw8yo0EUw925hKsA==}
+    cpu: [s390x]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-x64-gnu@4.62.4':
+    resolution: {integrity: sha512-W69hukhZ3KKNRCaMIEzKvcFye42hh0FE1+YoYaf5+Ikacuftoco6yO/xouz0hc5d5W/s3yBro5jRiuEE/Q5vUw==}
+    cpu: [x64]
+    os: [linux]
+    libc: [glibc]
+
+  '@rollup/rollup-linux-x64-musl@4.62.4':
+    resolution: {integrity: sha512-qiXbGG2jkjXhzXpsFZSR2Xpb8DN/UaxYsbb/STbuR/6fpaDgRmmaq1B/LmtF2wQFOFOSsK2jdE0RZ3a0zHn4QA==}
+    cpu: [x64]
+    os: [linux]
+    libc: [musl]
+
+  '@rollup/rollup-openbsd-x64@4.62.4':
+    resolution: {integrity: sha512-nWeM//hxv8mIo6jD7Hu4o48DVmV9pbV6gsKaWU+4NFyqHoPKwrkRiZGLKUhOBk8qNmDmpwFtPKg80Bo/Tn4xiQ==}
+    cpu: [x64]
+    os: [openbsd]
+
+  '@rollup/rollup-openharmony-arm64@4.62.4':
+    resolution: {integrity: sha512-s62SQ/vgsRSvMwDkOEfTqfgASF0f26ZNaQuTA6Aok5lrikf89yI2W0gFHvZb2Jpgc6N8JnOKZgCK2iciO3CsxQ==}
+    cpu: [arm64]
+    os: [openharmony]
+
+  '@rollup/rollup-win32-arm64-msvc@4.62.4':
+    resolution: {integrity: sha512-J6wGf8TVGbXJq+HH+ttTvrcfNKPbuZecV6KT1B8I18BC5IURUh5kl4Yl5OEP5eFIUoI5BWxCsyYMhFsDx8kekw==}
+    cpu: [arm64]
+    os: [win32]
+
+  '@rollup/rollup-win32-ia32-msvc@4.62.4':
+    resolution: {integrity: sha512-zmfrQd/0wu6oJs8Vq8KwY/YtsKSsLtKe/HwAP4Wqy8LhWjeT55fHRAkOhYQ12wI3ayS4Tt12d5CDRD7N96SAYQ==}
+    cpu: [ia32]
+    os: [win32]
+
+  '@rollup/rollup-win32-x64-gnu@4.62.4':
+    resolution: {integrity: sha512-qPzHqdj9rfUD+w79dtE07zi/kFwKyCJqplp5K5ygeLTp7jLpAoc16OAH39HSmRC9UpozaecsleI8uAdEj6v2yw==}
+    cpu: [x64]
+    os: [win32]
+
+  '@rollup/rollup-win32-x64-msvc@4.62.4':
+    resolution: {integrity: sha512-zD6NdeWEByGE9QF9vCrlJ5YQB4oq9q91kPZS37Jwj5hOkvR1lTBSpsKhKDw4IJtbQ35LsTS1HD9DZYGKIshU1Q==}
+    cpu: [x64]
+    os: [win32]
+
+  '@types/chai@5.2.3':
+    resolution: {integrity: sha512-Mw558oeA9fFbv65/y4mHtXDs9bPnFMZAL/jxdPFUpOHHIXX91mcgEHbS5Lahr+pwZFR8A7GQleRWeI6cGFC2UA==}
+
+  '@types/deep-eql@4.0.2':
+    resolution: {integrity: sha512-c9h9dVVMigMPc4bwTvC5dxqtqJZwQPePsWjPlpSOnojbor6pGqdk541lfA7AqFQr5pB1BRdq0juY9db81BwyFw==}
+
+  '@types/estree@1.0.9':
+    resolution: {integrity: sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==}
+
+  '@vitest/expect@3.2.7':
+    resolution: {integrity: sha512-E8eBXaKibuvH2pSZErOjdVb5vF4PbKYcrnluBTYxEk1l/VhhwZg1kZQsdtjq+CsF5CFydf2Rdkz7jDHKSisi3w==}
+
+  '@vitest/mocker@3.2.7':
+    resolution: {integrity: sha512-Trr0hYO9CM3Wj6ksWHRhK9IZpIY6wTMO5u/MqXurMxT57sWBaOPEtP3Oq60ihZuh5JsiagKfz95OcxdEP6dBrA==}
+    peerDependencies:
+      msw: ^2.4.9
+      vite: ^5.0.0 || ^6.0.0 || ^7.0.0-0
+    peerDependenciesMeta:
+      msw:
+        optional: true
+      vite:
+        optional: true
+
+  '@vitest/pretty-format@3.2.7':
+    resolution: {integrity: sha512-KUHlwqVu0sRlhCdyPdQ/wBoTfRahjUky1MubOmYw9fWfIZy1gNoHpuaaQBPAaMaVYdQYHJLurzj8ECCj5OwTqA==}
+
+  '@vitest/runner@3.2.7':
+    resolution: {integrity: sha512-sB9y4ovltoQP+WaUPwmSxO9WIg9Ig694Di5PalVPsYHklAdE027mehpWF2SQSVq+k6sFgaivbTjTJwZLSHbedA==}
+
+  '@vitest/snapshot@3.2.7':
+    resolution: {integrity: sha512-7C+MwShwtBSI5Buwoyg3s/iY1eHL9PKAf+O1wVh/TdnjXUtkoL/9YQtre90i4MtNXM6edP1wJ2zOBpfCyhIS7g==}
+
+  '@vitest/spy@3.2.7':
+    resolution: {integrity: sha512-Q2eQGI6d2L/hBtZ0qNuKcAGid68XK6cv1xsoaIma6PaJhHPoqcEJhYpXZ/5myCMqkNgtP6UKuBhbc0nHKnrkuQ==}
+
+  '@vitest/utils@3.2.7':
+    resolution: {integrity: sha512-x6BDOd7dyo3PFLY3I9/HJ25X/6OurhGXk2/B9gOZNPF7XDVjeBK4k01lQE5uvDpbuheErh91qYuE1E2OEjK3Rw==}
+
+  ajv-formats@3.0.1:
+    resolution: {integrity: sha512-8iUql50EUR+uUcdRQ3HDqa6EVyo3docL8g5WJ3FNcWmu62IbkGUue/pEyLBW8VGKKucTPgqeks4fIU1DA4yowQ==}
+    peerDependencies:
+      ajv: ^8.0.0
+    peerDependenciesMeta:
+      ajv:
+        optional: true
+
   ajv@8.20.0:
     resolution: {integrity: sha512-Thbli+OlOj+iMPYFBVBfJ3OmCAnaSyNn4M1vz9T6Gka5Jt9ba/HIR56joy65tY6kx/FCF5VXNB819Y7/GUrBGA==}
 
+  assertion-error@2.0.1:
+    resolution: {integrity: sha512-Izi8RQcffqCeNVgFigKli1ssklIbpHnCYc6AknXGYoB6grJqyeby7jv12JUQgmTAnIDnbck1uxksT4dzN3PWBA==}
+    engines: {node: '>=12'}
+
+  cac@6.7.14:
+    resolution: {integrity: sha512-b6Ilus+c3RrdDk+JhLKUAQfzzgLEPy6wcXqS7f/xe1EETvsDP6GORG7SFuOs6cID5YkqchW/LXZbX5bc8j7ZcQ==}
+    engines: {node: '>=8'}
+
+  chai@5.3.3:
+    resolution: {integrity: sha512-4zNhdJD/iOjSH0A05ea+Ke6MU5mmpQcbQsSOkgdaUMJ9zTlDTD/GYlwohmIE2u0gaxHYiVHEn1Fw9mZ/ktJWgw==}
+    engines: {node: '>=18'}
+
+  check-error@2.1.3:
+    resolution: {integrity: sha512-PAJdDJusoxnwm1VwW07VWwUN1sl7smmC3OKggvndJFadxxDRyFJBX/ggnu/KE4kQAB7a3Dp8f/YXC1FlUprWmA==}
+    engines: {node: '>= 16'}
+
+  debug@4.4.3:
+    resolution: {integrity: sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==}
+    engines: {node: '>=6.0'}
+    peerDependencies:
+      supports-color: '*'
+    peerDependenciesMeta:
+      supports-color:
+        optional: true
+
+  deep-eql@5.0.2:
+    resolution: {integrity: sha512-h5k/5U50IJJFpzfL6nO9jaaumfjO/f2NjK/oYB2Djzm4p9L+3T9qWpZqZ2hAbLPuuYq9wrU08WQyBTL5GbPk5Q==}
+    engines: {node: '>=6'}
+
+  es-module-lexer@1.7.0:
+    resolution: {integrity: sha512-jEQoCwk8hyb2AZziIOLhDqpm5+2ww5uIE6lkO/6jcOCusfk6LhMHpXXfBLXTZ7Ydyt0j4VoUQv6uGNYbdW+kBA==}
+
+  esbuild@0.28.1:
+    resolution: {integrity: sha512-HrJrvZv5ayxBzPfwphOoNzkzOIIlifzk0KJrGK2c8R4+LKpMtpYLQeUdjnwjWv/LZlkH2laZk+4w78pi99D4Vw==}
+    engines: {node: '>=18'}
+    hasBin: true
+
+  estree-walker@3.0.3:
+    resolution: {integrity: sha512-7RUKfXgSMMkzt6ZuXmqapOurLGPPfgj6l9uRZ7lRGolvk0y2yocc35LdcxKC5PQZdn2DMqioAQ2NoWcrTKmm6g==}
+
+  expect-type@1.4.0:
+    resolution: {integrity: sha512-KfYbmpRm0VbLjEvVa9yGwCi9GI34xvi7A/HXYWQO65CSD2u3MczUJSuwXKFIxlGsgBQizV9q5J9NHj4VG0n+pA==}
+    engines: {node: '>=12.0.0'}
+
   fast-deep-equal@3.1.3:
     resolution: {integrity: sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==}
 
   fast-uri@3.1.2:
     resolution: {integrity: sha512-rVjf7ArG3LTk+FS6Yw81V1DLuZl1bRbNrev6Tmd/9RaroeeRRJhAt7jg/6YFxbvAQXUCavSoZhPPj6oOx+5KjQ==}
 
+  fdir@6.5.0:
+    resolution: {integrity: sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==}
+    engines: {node: '>=12.0.0'}
+    peerDependencies:
+      picomatch: ^3 || ^4
+    peerDependenciesMeta:
+      picomatch:
+        optional: true
+
+  fsevents@2.3.3:
+    resolution: {integrity: sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==}
+    engines: {node: ^8.16.0 || ^10.6.0 || >=11.0.0}
+    os: [darwin]
+
+  js-tokens@9.0.1:
+    resolution: {integrity: sha512-mxa9E9ITFOt0ban3j6L5MpjwegGz6lBQmM1IJkWeBZGcMxto50+eWdjC/52xDbS2vy0k7vIMK0Fe2wfL9OQSpQ==}
+
   json-schema-traverse@1.0.0:
     resolution: {integrity: sha512-NM8/P9n3XjXhIZn1lLhkFaACTOURQXjWhV4BA/RnOv8xvgqtqpAX9IO4mRQxSx1Rlo4tqzeqb0sOlruaOy3dug==}
 
+  loupe@3.2.1:
+    resolution: {integrity: sha512-CdzqowRJCeLU72bHvWqwRBBlLcMEtIvGrlvef74kMnV2AolS9Y8xUv1I0U/MNAWMhBlKIoyuEgoJ0t/bbwHbLQ==}
+
+  magic-string@0.30.21:
+    resolution: {integrity: sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==}
+
+  ms@2.1.3:
+    resolution: {integrity: sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==}
+
+  nanoid@3.3.17:
+    resolution: {integrity: sha512-xQLf0A3HOMlgHq0n247/LRuAOYmB7dXJ/DvAxGvsSBij45XtBSmQycu+F8ODbHwns/XyFZagyL1+J0Offw1E0g==}
+    engines: {node: ^10 || ^12 || ^13.7 || ^14 || >=15.0.1}
+    hasBin: true
+
+  pathe@2.0.3:
+    resolution: {integrity: sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==}
+
+  pathval@2.0.1:
+    resolution: {integrity: sha512-//nshmD55c46FuFw26xV/xFAaB5HF9Xdap7HJBBnrKdAd6/GxDBaNA1870O79+9ueg61cZLSVc+OaFlfmObYVQ==}
+    engines: {node: '>= 14.16'}
+
+  picocolors@1.1.1:
+    resolution: {integrity: sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==}
+
+  picomatch@4.0.5:
+    resolution: {integrity: sha512-RvwwcruNjI1ncT5xRakeyS9Lf8lcItv34KD+aif+VH9kduAyfYBipGh12274xtenIPZ119/R9BdTBa8gAwSh0A==}
+    engines: {node: '>=12'}
+
+  postcss@8.5.25:
+    resolution: {integrity: sha512-DTPx3RWSSnWyzLxQnlH0rJP+EW5ekl16ZU4/psbIhA0e53kJfdgaN5vKM+xP7yJtXVu+nfdVFmlgFDEKAe4Pyw==}
+    engines: {node: ^10 || ^12 || >=14}
+
   require-from-string@2.0.2:
     resolution: {integrity: sha512-Xf0nWe6RseziFMu+Ap9biiUbmplq6S9/p+7w7YXP/JBHhrUDDUhwa+vANyubuqfZWTveU//DYVGsDG7RKL/vEw==}
     engines: {node: '>=0.10.0'}
 
+  rollup@4.62.4:
+    resolution: {integrity: sha512-RXOqwaPsBGjMNMa4sQjDjHieHEZDFoj/Rdr46l2MU5DfEs16wHJPC2RPTPHWhNl+M3aI472LLqFkFKut4SblOg==}
+    engines: {node: '>=18.0.0', npm: '>=8.0.0'}
+    hasBin: true
+
+  siginfo@2.0.0:
+    resolution: {integrity: sha512-ybx0WO1/8bSBLEWXZvEd7gMW3Sn3JFlW3TvX1nREbDLRNQNaeNN8WK0meBwPdAaOI7TtRRRJn/Es1zhrrCHu7g==}
+
+  source-map-js@1.2.1:
+    resolution: {integrity: sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==}
+    engines: {node: '>=0.10.0'}
+
+  stackback@0.0.2:
+    resolution: {integrity: sha512-1XMJE5fQo1jGH6Y/7ebnwPOBEkIEnT4QF32d5R1+VXdXveM0IBMJt8zfaxX1P3QhVwrYe+576+jkANtSS2mBbw==}
+
+  std-env@3.10.0:
+    resolution: {integrity: sha512-5GS12FdOZNliM5mAOxFRg7Ir0pWz8MdpYm6AY6VPkGpbA7ZzmbzNcBJQ0GPvvyWgcY7QAhCgf9Uy89I03faLkg==}
+
+  strip-literal@3.1.0:
+    resolution: {integrity: sha512-8r3mkIM/2+PpjHoOtiAW8Rg3jJLHaV7xPwG+YRGrv6FP0wwk/toTpATxWYOW0BKdWwl82VT2tFYi5DlROa0Mxg==}
+
+  tinybench@2.9.0:
+    resolution: {integrity: sha512-0+DUvqWMValLmha6lr4kD8iAMK1HzV0/aKnCtWb9v9641TnP/MFb7Pc2bxoxQjTXAErryXVgUOfv2YqNllqGeg==}
+
+  tinyexec@0.3.2:
+    resolution: {integrity: sha512-KQQR9yN7R5+OSwaK0XQoj22pwHoTlgYqmUscPYoknOoWCWfj/5/ABTMRi69FrKU5ffPVh5QcFikpWJI/P1ocHA==}
+
+  tinyglobby@0.2.17:
+    resolution: {integrity: sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==}
+    engines: {node: '>=12.0.0'}
+
+  tinypool@1.1.1:
+    resolution: {integrity: sha512-Zba82s87IFq9A9XmjiX5uZA/ARWDrB03OHlq+Vw1fSdt0I+4/Kutwy8BP4Y/y/aORMo61FQ0vIb5j44vSo5Pkg==}
+    engines: {node: ^18.0.0 || >=20.0.0}
+
+  tinyrainbow@2.0.0:
+    resolution: {integrity: sha512-op4nsTR47R6p0vMUUoYl/a+ljLFVtlfaXkLQmqfLR1qHma1h/ysYk4hEXZ880bf2CYgTskvTa/e196Vd5dDQXw==}
+    engines: {node: '>=14.0.0'}
+
+  tinyspy@4.0.4:
+    resolution: {integrity: sha512-azl+t0z7pw/z958Gy9svOTuzqIk6xq+NSheJzn5MMWtWTFywIacg2wUlzKFGtt3cthx0r2SxMK0yzJOR0IES7Q==}
+    engines: {node: '>=14.0.0'}
+
   typescript@5.9.3:
     resolution: {integrity: sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==}
     engines: {node: '>=14.17'}
     hasBin: true
 
+  vite-node@3.2.4:
+    resolution: {integrity: sha512-EbKSKh+bh1E1IFxeO0pg1n4dvoOTt0UDiXMd/qn++r98+jPO1xtJilvXldeuQ8giIB5IkpjCgMleHMNEsGH6pg==}
+    engines: {node: ^18.0.0 || ^20.0.0 || >=22.0.0}
+    hasBin: true
+
+  vite@7.3.6:
+    resolution: {integrity: sha512-4XP60spRGjSZFf1qYH+dJIkK2znL3zQfl9KkOV9MkkRR/3Dls0dxaBsQPTloEc5BLXWPL9vsOxopxyKoMmDueg==}
+    engines: {node: ^20.19.0 || >=22.12.0}
+    hasBin: true
+    peerDependencies:
+      '@types/node': ^20.19.0 || >=22.12.0
+      jiti: '>=1.21.0'
+      less: ^4.0.0
+      lightningcss: ^1.21.0
+      sass: ^1.70.0
+      sass-embedded: ^1.70.0
+      stylus: '>=0.54.8'
+      sugarss: ^5.0.0
+      terser: ^5.16.0
+      tsx: ^4.8.1
+      yaml: ^2.4.2
+    peerDependenciesMeta:
+      '@types/node':
+        optional: true
+      jiti:
+        optional: true
+      less:
+        optional: true
+      lightningcss:
+        optional: true
+      sass:
+        optional: true
+      sass-embedded:
+        optional: true
+      stylus:
+        optional: true
+      sugarss:
+        optional: true
+      terser:
+        optional: true
+      tsx:
+        optional: true
+      yaml:
+        optional: true
+
+  vitest@3.2.7:
+    resolution: {integrity: sha512-KrxIJ62Fd89gfysR4WotlgZABiz2dqFPgqGzX7s+CwsqLFomRH7777ZcrOD6+WVAh7khPQP41A+BKbpcJFrdEg==}
+    engines: {node: ^18.0.0 || ^20.0.0 || >=22.0.0}
+    hasBin: true
+    peerDependencies:
+      '@edge-runtime/vm': '*'
+      '@types/debug': ^4.1.12
+      '@types/node': ^18.0.0 || ^20.0.0 || >=22.0.0
+      '@vitest/browser': 3.2.7
+      '@vitest/ui': 3.2.7
+      happy-dom: '*'
+      jsdom: '*'
+    peerDependenciesMeta:
+      '@edge-runtime/vm':
+        optional: true
+      '@types/debug':
+        optional: true
+      '@types/node':
+        optional: true
+      '@vitest/browser':
+        optional: true
+      '@vitest/ui':
+        optional: true
+      happy-dom:
+        optional: true
+      jsdom:
+        optional: true
+
+  why-is-node-running@2.3.0:
+    resolution: {integrity: sha512-hUrmaWBdVDcxvYqnyh09zunKzROWjbZTiNy8dBEjkS7ehEDQibXJ7XvlmtbwuTclUiIyN+CyXQD4Vmko8fNm8w==}
+    engines: {node: '>=8'}
+    hasBin: true
+
 snapshots:
 
+  '@esbuild/aix-ppc64@0.28.1':
+    optional: true
+
+  '@esbuild/android-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/android-arm@0.28.1':
+    optional: true
+
+  '@esbuild/android-x64@0.28.1':
+    optional: true
+
+  '@esbuild/darwin-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/darwin-x64@0.28.1':
+    optional: true
+
+  '@esbuild/freebsd-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/freebsd-x64@0.28.1':
+    optional: true
+
+  '@esbuild/linux-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/linux-arm@0.28.1':
+    optional: true
+
+  '@esbuild/linux-ia32@0.28.1':
+    optional: true
+
+  '@esbuild/linux-loong64@0.28.1':
+    optional: true
+
+  '@esbuild/linux-mips64el@0.28.1':
+    optional: true
+
+  '@esbuild/linux-ppc64@0.28.1':
+    optional: true
+
+  '@esbuild/linux-riscv64@0.28.1':
+    optional: true
+
+  '@esbuild/linux-s390x@0.28.1':
+    optional: true
+
+  '@esbuild/linux-x64@0.28.1':
+    optional: true
+
+  '@esbuild/netbsd-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/netbsd-x64@0.28.1':
+    optional: true
+
+  '@esbuild/openbsd-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/openbsd-x64@0.28.1':
+    optional: true
+
+  '@esbuild/openharmony-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/sunos-x64@0.28.1':
+    optional: true
+
+  '@esbuild/win32-arm64@0.28.1':
+    optional: true
+
+  '@esbuild/win32-ia32@0.28.1':
+    optional: true
+
+  '@esbuild/win32-x64@0.28.1':
+    optional: true
+
+  '@jridgewell/sourcemap-codec@1.5.5': {}
+
+  '@napi-rs/lzma-linux-x64-gnu@1.5.1':
+    optional: true
+
+  '@rollup/rollup-android-arm-eabi@4.62.4':
+    optional: true
+
+  '@rollup/rollup-android-arm64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-darwin-arm64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-darwin-x64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-freebsd-arm64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-freebsd-x64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-arm-gnueabihf@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-arm-musleabihf@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-arm64-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-arm64-musl@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-loong64-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-loong64-musl@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-ppc64-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-ppc64-musl@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-riscv64-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-riscv64-musl@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-s390x-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-x64-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-linux-x64-musl@4.62.4':
+    optional: true
+
+  '@rollup/rollup-openbsd-x64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-openharmony-arm64@4.62.4':
+    optional: true
+
+  '@rollup/rollup-win32-arm64-msvc@4.62.4':
+    optional: true
+
+  '@rollup/rollup-win32-ia32-msvc@4.62.4':
+    optional: true
+
+  '@rollup/rollup-win32-x64-gnu@4.62.4':
+    optional: true
+
+  '@rollup/rollup-win32-x64-msvc@4.62.4':
+    optional: true
+
+  '@types/chai@5.2.3':
+    dependencies:
+      '@types/deep-eql': 4.0.2
+      assertion-error: 2.0.1
+
+  '@types/deep-eql@4.0.2': {}
+
+  '@types/estree@1.0.9': {}
+
+  '@vitest/expect@3.2.7':
+    dependencies:
+      '@types/chai': 5.2.3
+      '@vitest/spy': 3.2.7
+      '@vitest/utils': 3.2.7
+      chai: 5.3.3
+      tinyrainbow: 2.0.0
+
+  '@vitest/mocker@3.2.7(vite@7.3.6)':
+    dependencies:
+      '@vitest/spy': 3.2.7
+      estree-walker: 3.0.3
+      magic-string: 0.30.21
+    optionalDependencies:
+      vite: 7.3.6
+
+  '@vitest/pretty-format@3.2.7':
+    dependencies:
+      tinyrainbow: 2.0.0
+
+  '@vitest/runner@3.2.7':
+    dependencies:
+      '@vitest/utils': 3.2.7
+      pathe: 2.0.3
+      strip-literal: 3.1.0
+
+  '@vitest/snapshot@3.2.7':
+    dependencies:
+      '@vitest/pretty-format': 3.2.7
+      magic-string: 0.30.21
+      pathe: 2.0.3
+
+  '@vitest/spy@3.2.7':
+    dependencies:
+      tinyspy: 4.0.4
+
+  '@vitest/utils@3.2.7':
+    dependencies:
+      '@vitest/pretty-format': 3.2.7
+      loupe: 3.2.1
+      tinyrainbow: 2.0.0
+
+  ajv-formats@3.0.1(ajv@8.20.0):
+    optionalDependencies:
+      ajv: 8.20.0
+
   ajv@8.20.0:
     dependencies:
       fast-deep-equal: 3.1.3
@@ -47,12 +830,237 @@ snapshots:
       json-schema-traverse: 1.0.0
       require-from-string: 2.0.2
 
+  assertion-error@2.0.1: {}
+
+  cac@6.7.14: {}
+
+  chai@5.3.3:
+    dependencies:
+      assertion-error: 2.0.1
+      check-error: 2.1.3
+      deep-eql: 5.0.2
+      loupe: 3.2.1
+      pathval: 2.0.1
+
+  check-error@2.1.3: {}
+
+  debug@4.4.3:
+    dependencies:
+      ms: 2.1.3
+
+  deep-eql@5.0.2: {}
+
+  es-module-lexer@1.7.0: {}
+
+  esbuild@0.28.1:
+    optionalDependencies:
+      '@esbuild/aix-ppc64': 0.28.1
+      '@esbuild/android-arm': 0.28.1
+      '@esbuild/android-arm64': 0.28.1
+      '@esbuild/android-x64': 0.28.1
+      '@esbuild/darwin-arm64': 0.28.1
+      '@esbuild/darwin-x64': 0.28.1
+      '@esbuild/freebsd-arm64': 0.28.1
+      '@esbuild/freebsd-x64': 0.28.1
+      '@esbuild/linux-arm': 0.28.1
+      '@esbuild/linux-arm64': 0.28.1
+      '@esbuild/linux-ia32': 0.28.1
+      '@esbuild/linux-loong64': 0.28.1
+      '@esbuild/linux-mips64el': 0.28.1
+      '@esbuild/linux-ppc64': 0.28.1
+      '@esbuild/linux-riscv64': 0.28.1
+      '@esbuild/linux-s390x': 0.28.1
+      '@esbuild/linux-x64': 0.28.1
+      '@esbuild/netbsd-arm64': 0.28.1
+      '@esbuild/netbsd-x64': 0.28.1
+      '@esbuild/openbsd-arm64': 0.28.1
+      '@esbuild/openbsd-x64': 0.28.1
+      '@esbuild/openharmony-arm64': 0.28.1
+      '@esbuild/sunos-x64': 0.28.1
+      '@esbuild/win32-arm64': 0.28.1
+      '@esbuild/win32-ia32': 0.28.1
+      '@esbuild/win32-x64': 0.28.1
+
+  estree-walker@3.0.3:
+    dependencies:
+      '@types/estree': 1.0.9
+
+  expect-type@1.4.0: {}
+
   fast-deep-equal@3.1.3: {}
 
   fast-uri@3.1.2: {}
 
+  fdir@6.5.0(picomatch@4.0.5):
+    optionalDependencies:
+      picomatch: 4.0.5
+
+  fsevents@2.3.3:
+    optional: true
+
+  js-tokens@9.0.1: {}
+
   json-schema-traverse@1.0.0: {}
 
+  loupe@3.2.1: {}
+
+  magic-string@0.30.21:
+    dependencies:
+      '@jridgewell/sourcemap-codec': 1.5.5
+
+  ms@2.1.3: {}
+
+  nanoid@3.3.17: {}
+
+  pathe@2.0.3: {}
+
+  pathval@2.0.1: {}
+
+  picocolors@1.1.1: {}
+
+  picomatch@4.0.5: {}
+
+  postcss@8.5.25:
+    dependencies:
+      nanoid: 3.3.17
+      picocolors: 1.1.1
+      source-map-js: 1.2.1
+
   require-from-string@2.0.2: {}
 
+  rollup@4.62.4:
+    dependencies:
+      '@types/estree': 1.0.9
+    optionalDependencies:
+      '@napi-rs/lzma-linux-x64-gnu': 1.5.1
+      '@rollup/rollup-android-arm-eabi': 4.62.4
+      '@rollup/rollup-android-arm64': 4.62.4
+      '@rollup/rollup-darwin-arm64': 4.62.4
+      '@rollup/rollup-darwin-x64': 4.62.4
+      '@rollup/rollup-freebsd-arm64': 4.62.4
+      '@rollup/rollup-freebsd-x64': 4.62.4
+      '@rollup/rollup-linux-arm-gnueabihf': 4.62.4
+      '@rollup/rollup-linux-arm-musleabihf': 4.62.4
+      '@rollup/rollup-linux-arm64-gnu': 4.62.4
+      '@rollup/rollup-linux-arm64-musl': 4.62.4
+      '@rollup/rollup-linux-loong64-gnu': 4.62.4
+      '@rollup/rollup-linux-loong64-musl': 4.62.4
+      '@rollup/rollup-linux-ppc64-gnu': 4.62.4
+      '@rollup/rollup-linux-ppc64-musl': 4.62.4
+      '@rollup/rollup-linux-riscv64-gnu': 4.62.4
+      '@rollup/rollup-linux-riscv64-musl': 4.62.4
+      '@rollup/rollup-linux-s390x-gnu': 4.62.4
+      '@rollup/rollup-linux-x64-gnu': 4.62.4
+      '@rollup/rollup-linux-x64-musl': 4.62.4
+      '@rollup/rollup-openbsd-x64': 4.62.4
+      '@rollup/rollup-openharmony-arm64': 4.62.4
+      '@rollup/rollup-win32-arm64-msvc': 4.62.4
+      '@rollup/rollup-win32-ia32-msvc': 4.62.4
+      '@rollup/rollup-win32-x64-gnu': 4.62.4
+      '@rollup/rollup-win32-x64-msvc': 4.62.4
+      fsevents: 2.3.3
+
+  siginfo@2.0.0: {}
+
+  source-map-js@1.2.1: {}
+
+  stackback@0.0.2: {}
+
+  std-env@3.10.0: {}
+
+  strip-literal@3.1.0:
+    dependencies:
+      js-tokens: 9.0.1
+
+  tinybench@2.9.0: {}
+
+  tinyexec@0.3.2: {}
+
+  tinyglobby@0.2.17:
+    dependencies:
+      fdir: 6.5.0(picomatch@4.0.5)
+      picomatch: 4.0.5
+
+  tinypool@1.1.1: {}
+
+  tinyrainbow@2.0.0: {}
+
+  tinyspy@4.0.4: {}
+
   typescript@5.9.3: {}
+
+  vite-node@3.2.4:
+    dependencies:
+      cac: 6.7.14
+      debug: 4.4.3
+      es-module-lexer: 1.7.0
+      pathe: 2.0.3
+      vite: 7.3.6
+    transitivePeerDependencies:
+      - '@types/node'
+      - jiti
+      - less
+      - lightningcss
+      - sass
+      - sass-embedded
+      - stylus
+      - sugarss
+      - supports-color
+      - terser
+      - tsx
+      - yaml
+
+  vite@7.3.6:
+    dependencies:
+      esbuild: 0.28.1
+      fdir: 6.5.0(picomatch@4.0.5)
+      picomatch: 4.0.5
+      postcss: 8.5.25
+      rollup: 4.62.4
+      tinyglobby: 0.2.17
+    optionalDependencies:
+      fsevents: 2.3.3
+
+  vitest@3.2.7:
+    dependencies:
+      '@types/chai': 5.2.3
+      '@vitest/expect': 3.2.7
+      '@vitest/mocker': 3.2.7(vite@7.3.6)
+      '@vitest/pretty-format': 3.2.7
+      '@vitest/runner': 3.2.7
+      '@vitest/snapshot': 3.2.7
+      '@vitest/spy': 3.2.7
+      '@vitest/utils': 3.2.7
+      chai: 5.3.3
+      debug: 4.4.3
+      expect-type: 1.4.0
+      magic-string: 0.30.21
+      pathe: 2.0.3
+      picomatch: 4.0.5
+      std-env: 3.10.0
+      tinybench: 2.9.0
+      tinyexec: 0.3.2
+      tinyglobby: 0.2.17
+      tinypool: 1.1.1
+      tinyrainbow: 2.0.0
+      vite: 7.3.6
+      vite-node: 3.2.4
+      why-is-node-running: 2.3.0
+    transitivePeerDependencies:
+      - jiti
+      - less
+      - lightningcss
+      - msw
+      - sass
+      - sass-embedded
+      - stylus
+      - sugarss
+      - supports-color
+      - terser
+      - tsx
+      - yaml
+
+  why-is-node-running@2.3.0:
+    dependencies:
+      siginfo: 2.0.0
+      stackback: 0.0.2
diff --git a/src/build-api.ts b/src/build-api.ts
index e14bae3..d3a7d99 100644
--- a/src/build-api.ts
+++ b/src/build-api.ts
@@ -1,517 +1 @@
-import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
-import { join } from 'path';
-
-const ROOT = new URL('..', import.meta.url).pathname;
-const API_SRC = join(ROOT, 'public', 'api.json');
-const API_OUT = join(ROOT, 'website', 'public', 'api', 'v1');
-const VERSION = 'v1';
-const GENERATED = new Date().toISOString();
-
-// ── Helpers ──────────────────────────────────────────────────
-function loadApi() {
-  return JSON.parse(readFileSync(API_SRC, 'utf-8'));
-}
-
-function envelop(data: any) {
-  return { api: 'tarif-pajak-id', version: VERSION, generated: GENERATED, data };
-}
-
-function writeJson(path: string, data: any) {
-  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
-}
-
-function ensureDir(dir: string) {
-  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
-}
-
-function slugify(s: string): string {
-  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
-}
-
-function rateStr(rate: any): string {
-  if (rate.type === 'percentage') return `${rate.value}%`;
-  if (rate.type === 'range') return `${rate.value[0]}%–${rate.value[1]}%`;
-  if (rate.type === 'progressive') return 'Progresif';
-  return String(rate.value);
-}
-
-type Entry = any;
-type Category = any;
-
-// ── Main ─────────────────────────────────────────────────────
-function main() {
-  const api = loadApi();
-  const allEntries: Entry[] = [];
-  const entryMap = new Map<string, Entry>();
-  const categoryEntries = new Map<string, Entry[]>();
-
-  // Flatten entries
-  for (const cat of api.categories) {
-    const slug = slugify(cat.taxType);
-    categoryEntries.set(slug, cat.entries);
-    for (const e of cat.entries) {
-      allEntries.push(e);
-      entryMap.set(e.id, e);
-    }
-  }
-
-  const allRegs: any[] = api.regulations;
-  const regMap = new Map<string, any>();
-  for (const r of allRegs) regMap.set(r.id, r);
-
-  let fileCount = 0;
-
-  // ── 1. Index ───────────────────────────────────────────────
-  ensureDir(API_OUT);
-  writeJson(join(API_OUT, 'index.json'), {
-    api: 'tarif-pajak-id', version: VERSION, generated: GENERATED,
-    endpoints: {
-      entries: '/api/v1/entries',
-      entry: '/api/v1/entries/{id}',
-      categories: '/api/v1/categories',
-      category: '/api/v1/categories/{slug}',
-      byYear: '/api/v1/by-year/{year}',
-      bppu: '/api/v1/bppu',
-      bppuPrefix: '/api/v1/bppu/{prefix}',
-      timeline: '/api/v1/timeline/{group}',
-      search: '/api/v1/search-index.json',
-      regulations: '/api/v1/regulations',
-      regulation: '/api/v1/regulations/{id}',
-      calculator: '/api/v1/calculator',
-      openapi: '/api/v1/openapi.json',
-      consolidated: '/api/v1/consolidated',
-      consolidatedLaw: '/api/v1/consolidated/{id}',
-      consolidatedPasal: '/api/v1/consolidated/{id}/pasal-{number}',
-    },
-    stats: { entries: allEntries.length, categories: api.categories.length, regulations: allRegs.length },
-  });
-  fileCount++;
-
-  // ── 2. Stats ───────────────────────────────────────────────
-  const statusCounts: Record<string, number> = {};
-  for (const e of allEntries) statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
-  const catStats = api.categories.map((c: any) => ({ taxType: c.taxType, slug: slugify(c.taxType), count: c.entries.length }));
-  writeJson(join(API_OUT, 'stats.json'), envelop({
-    totalEntries: allEntries.length, totalCategories: api.categories.length, totalRegulations: allRegs.length,
-    byStatus: statusCounts, byCategory: catStats, temporalRange: { from: '1984-01-01', to: '2026-12-31' },
-  }));
-  fileCount++;
-
-  // ── 3. Entries list ────────────────────────────────────────
-  const entriesDir = join(API_OUT, 'entries');
-  ensureDir(entriesDir);
-  const entriesIndex = allEntries.map(e => ({
-    id: e.id, category: e.category, taxType: e.taxType, transactionType: e.transactionType,
-    rate: rateStr(e.rate), rateType: e.rate.type, status: e.status,
-    effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
-    tags: e.tags, hasBppu: !!(e.bppuKode && e.bppuKode.length > 0),
-  }));
-  writeJson(join(entriesDir, 'index.json'), envelop({ count: entriesIndex.length, entries: entriesIndex }));
-  fileCount++;
-
-  // ── 4. Entry details ───────────────────────────────────────
-  for (const e of allEntries) {
-    const catSlug = slugify(e.taxType);
-    const sameCat = categoryEntries.get(catSlug) || [];
-    const relatedEntries: any = {};
-    if (e.supersededBy && e.supersededBy.length > 0) relatedEntries.supersededBy = e.supersededBy;
-    if (e.supersedes && e.supersedes.length > 0) relatedEntries.supersedes = e.supersedes;
-    relatedEntries.sameCategory = sameCat.map((s: any) => s.id).filter((id: string) => id !== e.id);
-
-    // Find regulation entries
-    const regEntries: string[] = [];
-    for (const lb of e.legalBasis) {
-      for (const r of allRegs) {
-        if (r.number && lb.regulation && r.number.includes(lb.regulation.split(' ').pop() || '')) {
-          if (!regEntries.includes(r.id)) regEntries.push(r.id);
-        }
-      }
-    }
-    if (regEntries.length > 0) relatedEntries.regulations = regEntries;
-
-    writeJson(join(entriesDir, `${e.id}.json`), envelop({
-      ...e, relatedEntries,
-    }));
-    fileCount++;
-  }
-
-  // ── 5. Categories ──────────────────────────────────────────
-  const catDir = join(API_OUT, 'categories');
-  ensureDir(catDir);
-  const catIndex = api.categories.map((c: any) => ({
-    category: c.category, taxType: c.taxType, slug: slugify(c.taxType),
-    description: c.description, count: c.entries.length,
-  }));
-  writeJson(join(catDir, 'index.json'), envelop({ count: catIndex.length, categories: catIndex }));
-  fileCount++;
-
-  for (const c of api.categories) {
-    const slug = slugify(c.taxType);
-    writeJson(join(catDir, `${slug}.json`), envelop({
-      category: c.category, taxType: c.taxType, description: c.description,
-      count: c.entries.length, entries: c.entries.map((e: any) => ({
-        id: e.id, transactionType: e.transactionType, rate: rateStr(e.rate),
-        status: e.status, effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
-      })),
-    }));
-    fileCount++;
-  }
-
-  // ── 6. By-Year ─────────────────────────────────────────────
-  const yearDir = join(API_OUT, 'by-year');
-  ensureDir(yearDir);
-  const yearData = new Map<number, Entry[]>();
-  for (let y = 1984; y <= 2026; y++) {
-    const matching = allEntries.filter(e => {
-      const from = e.effectiveFrom;
-      const to = e.effectiveTo || '9999-12-31';
-      return from <= `${y}-12-31` && to >= `${y}-01-01`;
-    });
-    if (matching.length > 0) {
-      yearData.set(y, matching);
-      writeJson(join(yearDir, `${y}.json`), envelop({
-        year: y, count: matching.length,
-        entries: matching.map(e => ({
-          id: e.id, taxType: e.taxType, transactionType: e.transactionType,
-          rate: rateStr(e.rate), status: e.status,
-          effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo,
-        })),
-      }));
-      fileCount++;
-    }
-  }
-
-  // ── 7. BPPU ────────────────────────────────────────────────
-  const bppuDir = join(API_OUT, 'bppu');
-  ensureDir(bppuDir);
-  const bppuByPrefix = new Map<string, any[]>();
-  const allBppuCodes: any[] = [];
-  for (const e of allEntries) {
-    for (const bp of (e.bppuKode || [])) {
-      allBppuCodes.push({ ...bp, entryId: e.id, entryTransactionType: e.transactionType });
-      const parts = bp.kode.split('-');
-      const prefix = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : bp.kode;
-      if (!bppuByPrefix.has(prefix)) bppuByPrefix.set(prefix, []);
-      bppuByPrefix.get(prefix)!.push({ ...bp, entryId: e.id, entryTransactionType: e.transactionType });
-    }
-  }
-  writeJson(join(bppuDir, 'index.json'), envelop({
-    count: allBppuCodes.length, prefixes: Array.from(bppuByPrefix.keys()),
-    codes: allBppuCodes.map(b => ({ kode: b.kode, nama: b.nama, tarif: b.tarif, entryId: b.entryId })),
-  }));
-  fileCount++;
-  for (const [prefix, codes] of bppuByPrefix) {
-    writeJson(join(bppuDir, `${prefix}.json`), envelop({
-      prefix, count: codes.length, codes,
-    }));
-    fileCount++;
-  }
-
-  // ── 8. Timeline ────────────────────────────────────────────
-  const tlDir = join(API_OUT, 'timeline');
-  ensureDir(tlDir);
-  const timelineGroups: Record<string, string[]> = {
-    'pph-21-progressive': ['pph-21-progressive-uulama1983', 'pph-21-progressive-uulama1994', 'pph-21-progressive-pre2009', 'pph-21-progressive-pre2022', 'pph-21-progressive-annual-2024'],
-    'pph-21-ptkp': ['pph-21-ptkp-1984', 'pph-21-ptkp-1995', 'pph-21-ptkp-2005', 'pph-21-ptkp-2009', 'pph-21-non-taxable-income'],
-    'pph-21-monthly': ['pph-21-progressive-monthly-pre2024', 'pph-21-ter-monthly-2024'],
-    'pph-badan': ['pph-badan-pre2001', 'pph-badan-pre2010', 'pph-badan-pre2022', 'pph-badan-2022-plus'],
-    'pph-23-jasa': ['pph-23-jasa-pre2001', 'pph-23-jasa-2001', 'pph-23-jasa-lain-2pct'],
-    'pph-final-pengalihan': ['pph-final-pengalihan-pp131', 'pph-final-pengalihan-pp71'],
-    'pph-final-bunga': ['pph-final-bunga-pre2009', 'pph-final-bunga-deposito'],
-    'pph-umkm': ['pph-umkm-1pct-pp46', 'pph-umkm-05pct-2018', 'pph-umkm-05pct-2023'],
-    'bea-meterai': ['bea-meterai-1000', 'bea-meterai-3000', 'bea-meterai-pre2021', 'bea-meterai-dokumen-2021'],
-    'ppn': ['ppn-10pct', 'ppn-11pct-2022', 'ppn-11pct-effective-2025'],
-  };
-  const tlIndex: any[] = [];
-  for (const [group, ids] of Object.entries(timelineGroups)) {
-    const entries = ids.map(id => entryMap.get(id)).filter(Boolean);
-    if (entries.length > 0) {
-      const sorted = entries.sort((a: any, b: any) => a.effectiveFrom.localeCompare(b.effectiveFrom));
-      writeJson(join(tlDir, `${group}.json`), envelop({
-        group, count: sorted.length, description: `Timeline ${group.replace(/-/g, ' ')}`,
-        entries: sorted.map((e: any) => ({
-          id: e.id, transactionType: e.transactionType, rate: rateStr(e.rate),
-          effectiveFrom: e.effectiveFrom, effectiveTo: e.effectiveTo, status: e.status,
-          legalBasis: e.legalBasis?.map((l: any) => `${l.regulation} ${l.article}`).join('; '),
-          supersedes: e.supersedes, supersededBy: e.supersededBy,
-        })),
-      }));
-      tlIndex.push({ group, count: sorted.length, from: sorted[0].effectiveFrom, to: sorted[sorted.length - 1].effectiveTo || 'sekarang' });
-      fileCount++;
-    }
-  }
-  writeJson(join(tlDir, 'index.json'), envelop({ count: tlIndex.length, timelines: tlIndex }));
-  fileCount++;
-
-  // ── 9. Search Index ────────────────────────────────────────
-  const searchEntries: Record<string, string[]> = {};
-  const keywords: Record<string, string[]> = {};
-  for (const e of allEntries) {
-    const tokens = new Set<string>();
-    // Add tokens
-    const addTokens = (text: string) => {
-      text.toLowerCase().split(/[\s,;.()\/\-]+/).forEach(w => { if (w.length >= 2) tokens.add(w); });
-    };
-    addTokens(e.id);
-    addTokens(e.taxType);
-    addTokens(e.transactionType);
-    addTokens(e.description || '');
-    addTokens(e.category);
-    (e.tags || []).forEach((t: string) => tokens.add(t.toLowerCase()));
-    (e.legalBasis || []).forEach((lb: any) => addTokens(lb.regulation));
-    (e.bppuKode || []).forEach((bp: any) => { addTokens(bp.kode); addTokens(bp.nama); });
-
-    searchEntries[e.id] = Array.from(tokens);
-    for (const t of tokens) {
-      if (!keywords[t]) keywords[t] = [];
-      keywords[t].push(e.id);
-    }
-  }
-  writeJson(join(API_OUT, 'search-index.json'), {
-    version: GENERATED.split('T')[0], entryCount: allEntries.length,
-    entries: searchEntries, keywords,
-  });
-  fileCount++;
-
-  // ── 10. Regulations ────────────────────────────────────────
-  const regDir = join(API_OUT, 'regulations');
-  ensureDir(regDir);
-  writeJson(join(regDir, 'index.json'), envelop({
-    count: allRegs.length,
-    regulations: allRegs.map((r: any) => ({
-      id: r.id, number: r.number, year: r.year, title: r.title,
-      type: r.type, status: r.status, sourceUrl: r.sourceUrl,
-    })),
-  }));
-  fileCount++;
-  for (const r of allRegs) {
-    // Find entries that reference this regulation
-    const refEntries: string[] = [];
-    for (const e of allEntries) {
-      for (const lb of (e.legalBasis || [])) {
-        if (lb.regulation && r.number && lb.regulation.includes(r.number.split('/')[0])) {
-          if (!refEntries.includes(e.id)) refEntries.push(e.id);
-        }
-      }
-    }
-    writeJson(join(regDir, `${r.id}.json`), envelop({ ...r, referencingEntries: refEntries }));
-    fileCount++;
-  }
-
-  // ── 11. Calculator ─────────────────────────────────────────
-  const calcDir = join(API_OUT, 'calculator');
-  ensureDir(calcDir);
-
-  // PPh 21 calculator data
-  const pph21Progressive = entryMap.get('pph-21-progressive-annual-2024');
-  const ptkpEntry = entryMap.get('pph-21-non-taxable-income');
-  const terEntry = entryMap.get('pph-21-ter-monthly-2024');
-  writeJson(join(calcDir, 'pph-21.json'), envelop({
-    description: 'Data untuk kalkulasi PPh 21',
-    progressiveRate: pph21Progressive?.rate || null,
-    ptkp: {
-      values: { 'TK/0': 54000000, 'K/0': 58500000, 'K/1': 63000000, 'K/2': 67500000, 'K/3': 72000000 },
-      source: 'PMK 122/2015',
-    },
-    ter: terEntry ? { description: terEntry.description, categories: ['A', 'B', 'C'] } : null,
-    formula: {
-      annual: 'PKP = Neto - PTKP, PPh = sum(bracket_rate × bracket_income)',
-      monthly_ter: 'PPh = TER_rate × (Bruto - Iuran)',
-      honorarium: 'Neto = Norma% × Bruto, PKP = Neto - PTKP, PPh = progressive(PKP)',
-    },
-  }));
-  fileCount++;
-
-  // PPh 23 calculator data
-  const pph23_2pct = entryMap.get('pph-23-jasa-lain-2pct');
-  writeJson(join(calcDir, 'pph-23.json'), envelop({
-    description: 'Data untuk kalkulasi PPh 23',
-    rates: { jasa_bernpwp: 2, jasa_tanpa_npwp: 4, sewa: 10, hadiah: 10 },
-    formula: { dasar: 'DPP = Jumlah Bruto', pp23: 'PPh 23 = Tarif × DPP' },
-  }));
-  fileCount++;
-
-  // PPN calculator data
-  writeJson(join(calcDir, 'ppn.json'), envelop({
-    description: 'Data untuk kalkulasi PPN',
-    rates: {
-      umum_2022: { rate: 11, effectiveFrom: '2022-04-01', note: '11% (7/12 × 11% via PMK 131/2024 untuk Apr-Des 2022)' },
-      umum_2025: { rate: 12, effectiveFrom: '2025-01-01', note: '12% per UU HPP, belum berlaku' },
-      ekspor: 0,
-    },
-    formula: { ppn: 'PPN = Tarif × DPP', dpp: 'DPP = Harga Jual / Penggantian / Nilai Impor' },
-  }));
-  fileCount++;
-
-  // PPh Badan calculator data
-  writeJson(join(calcDir, 'pph-badan.json'), envelop({
-    description: 'Data untuk kalkulasi PPh Badan',
-    rates: { umum: 22, goPublic: 20, umkm: 11, ikn: 0 },
-    formula: { pphBadan: 'PPh = Tarif × PKP', pkp: 'PKP = Penghasilan Neto - PTKP Badan' },
-  }));
-  fileCount++;
-
-  // Calculator index
-  writeJson(join(calcDir, 'index.json'), envelop({
-    description: 'Kalkulator pajak — data statis untuk kalkulasi client-side',
-    calculators: [
-      { id: 'pph-21', name: 'PPh 21 Orang Pribadi', description: 'Progresif, TER, PTKP, honorarium' },
-      { id: 'pph-23', name: 'PPh 23', description: 'Jasa, sewa, hadiah' },
-      { id: 'ppn', name: 'PPN', description: 'Pajak Pertambahan Nilai' },
-      { id: 'pph-badan', name: 'PPh Badan', description: 'Tarif flat badan' },
-    ],
-  }));
-  fileCount++;
-
-  // ── 12. OpenAPI Spec ───────────────────────────────────────
-  const openapi = {
-    openapi: '3.0.3',
-    info: {
-      title: 'Tarif Pajak Indonesia API', version: '1.0.0',
-      description: 'Open database tarif pajak Indonesia — pre-built static JSON API. Semua endpoint mengembalikan file JSON statis yang bisa di-cache.',
-      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
-      contact: { name: 'Tarif Pajak ID', url: 'https://tarif-pajak-id.vercel.app' },
-    },
-    servers: [
-      { url: 'https://tarif-pajak-id.vercel.app', description: 'Production' },
-      { url: 'http://localhost:4325', description: 'Development' },
-    ],
-    paths: {
-      '/api/v1/index.json': { get: { summary: 'API Index', tags: ['Meta'], responses: { '200': { description: 'API info & endpoint list' } } } },
-      '/api/v1/stats.json': { get: { summary: 'Database Statistics', tags: ['Meta'], responses: { '200': { description: 'Entry counts by status, category, temporal range' } } } },
-      '/api/v1/entries/index.json': { get: { summary: 'List All Entries', tags: ['Entries'], responses: { '200': { description: 'Flat list of all tax rate entries (summary)' } } } },
-      '/api/v1/entries/{id}.json': {
-        get: { summary: 'Get Entry Detail', tags: ['Entries'],
-          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Entry ID, e.g. ppn-10pct' }],
-          responses: { '200': { description: 'Full entry detail with legalBasis, examples, BPPU codes, related entries' } } },
-      },
-      '/api/v1/categories/index.json': { get: { summary: 'List Categories', tags: ['Categories'], responses: { '200': { description: 'All tax categories' } } } },
-      '/api/v1/categories/{slug}.json': {
-        get: { summary: 'Get Category Entries', tags: ['Categories'],
-          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'Category slug, e.g. pph-21, ppn' }],
-          responses: { '200': { description: 'Entries within a category' } } },
-      },
-      '/api/v1/by-year/{year}.json': {
-        get: { summary: 'Temporal Query', tags: ['Temporal'],
-          parameters: [{ name: 'year', in: 'path', required: true, schema: { type: 'integer', minimum: 1984, maximum: 2026 }, description: 'Year, e.g. 2001' }],
-          responses: { '200': { description: 'Entries effective in the given year' } } },
-      },
-      '/api/v1/bppu/index.json': { get: { summary: 'All BPPU Codes', tags: ['BPPU'], responses: { '200': { description: 'All BPPU codes with entry mappings' } } } },
-      '/api/v1/bppu/{prefix}.json': {
-        get: { summary: 'BPPU Codes by Prefix', tags: ['BPPU'],
-          parameters: [{ name: 'prefix', in: 'path', required: true, schema: { type: 'string' }, description: 'Prefix, e.g. 24-104, 28-404' }],
-          responses: { '200': { description: 'BPPU codes matching prefix' } } },
-      },
-      '/api/v1/timeline/index.json': { get: { summary: 'Timeline Groups', tags: ['Timeline'], responses: { '200': { description: 'Available timeline groups' } } } },
-      '/api/v1/timeline/{group}.json': {
-        get: { summary: 'Timeline Chain', tags: ['Timeline'],
-          parameters: [{ name: 'group', in: 'path', required: true, schema: { type: 'string' }, description: 'Group, e.g. pph-21-progressive, pph-21-ptkp' }],
-          responses: { '200': { description: 'Historical chain of entries' } } },
-      },
-      '/api/v1/search-index.json': { get: { summary: 'Search Index', tags: ['Search'], responses: { '200': { description: 'Inverted index for client-side search' } } } },
-      '/api/v1/regulations/index.json': { get: { summary: 'List Regulations', tags: ['Regulations'], responses: { '200': { description: 'All regulations' } } } },
-      '/api/v1/regulations/{id}.json': {
-        get: { summary: 'Get Regulation', tags: ['Regulations'],
-          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Regulation ID' }],
-          responses: { '200': { description: 'Regulation detail with referencing entries' } } },
-      },
-      '/api/v1/calculator/index.json': { get: { summary: 'Calculator List', tags: ['Calculator'], responses: { '200': { description: 'Available calculator data sets' } } } },
-      '/api/v1/calculator/{id}.json': {
-      '/api/v1/consolidated/index.json': { get: { summary: 'List Consolidated Laws', tags: ['Consolidated'], responses: { '200': { description: 'All consolidated tax laws (KUP, PPh, PPN)' } } } },
-      '/api/v1/consolidated/{id}.json': { get: { summary: 'Get Consolidated Law', tags: ['Consolidated'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', enum: ['uu-kup-konsolidasi', 'uu-pph-konsolidasi', 'uu-ppn-konsolidasi'] }, description: 'Consolidated law ID' }], responses: { '200': { description: 'Full consolidated law with pasal summaries' } } } },
-      '/api/v1/consolidated/{id}/pasal-{number}.json': { get: { summary: 'Get Pasal Detail', tags: ['Consolidated'], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, { name: 'number', in: 'path', required: true, schema: { type: 'string' }, description: 'Pasal number, e.g. 1, 2A' }], responses: { '200': { description: 'Full pasal detail with amendment history' } } } },
-        get: { summary: 'Calculator Data', tags: ['Calculator'],
-          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', enum: ['pph-21', 'pph-23', 'ppn', 'pph-badan'] } }],
-          responses: { '200': { description: 'Static data for tax calculation' } } },
-      },
-    },
-    components: {
-      schemas: {
-        Envelope: { type: 'object', properties: { api: { type: 'string' }, version: { type: 'string' }, generated: { type: 'string' }, data: {} } },
-        TaxRateEntry: { type: 'object', description: 'Full tax rate entry' },
-        EntrySummary: { type: 'object', description: 'Summary entry for lists' },
-        Regulation: { type: 'object', description: 'Regulation metadata' },
-      },
-    },
-    tags: [
-      { name: 'Meta', description: 'API information' },
-      { name: 'Entries', description: 'Tax rate entries' },
-      { name: 'Categories', description: 'Tax categories' },
-      { name: 'Temporal', description: 'Time-based queries' },
-      { name: 'BPPU', description: 'BPPU code lookup' },
-      { name: 'Timeline', description: 'Historical chains' },
-      { name: 'Search', description: 'Full-text search' },
-      { name: 'Regulations', description: 'Regulation metadata' },
-      { name: 'Calculator', description: 'Tax calculator data' },
-      { name: 'Consolidated', description: 'Consolidated tax laws (UU Konsolidasi) with amendment tracking' },
-    ],
-  };
-  writeJson(join(API_OUT, 'openapi.json'), openapi);
-  fileCount++;
-
-
-  // ── 13. Consolidated Laws ──────────────────────────────────
-  const consDir = join(API_OUT, 'consolidated');
-  ensureDir(consDir);
-
-  const allConsolidated = api.consolidatedLaws || [];
-  const consIndex = allConsolidated.map(l => ({
-    id: l.id,
-    shortTitle: l.shortTitle,
-    baseLaw: `${l.baseLaw.type} ${l.baseLaw.number}/${l.baseLaw.year}`,
-    totalPasals: l.statistics.totalPasals,
-    totalAmendments: l.statistics.totalAmendments,
-  }));
-  writeJson(join(consDir, 'index.json'), envelop({ count: allConsolidated.length, laws: consIndex }));
-  fileCount++;
-
-  for (const law of allConsolidated) {
-    // Summary version for the main endpoint
-    const lawSummary = {
-      id: law.id,
-      title: law.title,
-      shortTitle: law.shortTitle,
-      description: law.description,
-      baseLaw: law.baseLaw,
-      amendmentChain: law.amendmentChain,
-      structure: law.structure,
-      statistics: law.statistics,
-      lastUpdated: law.lastUpdated,
-      sourceNotes: law.sourceNotes,
-      pasalCount: law.pasals.length,
-      // Include pasal list with brief info
-      pasals: law.pasals.map((p: any) => ({
-        number: p.number,
-        bab: p.bab,
-        title: p.title,
-        status: p.status,
-        description: p.description,
-        keywords: p.keywords,
-        amendmentCount: p.amendmentHistory.length,
-      })),
-    };
-    writeJson(join(consDir, `${law.id}.json`), envelop(lawSummary));
-    fileCount++;
-
-    // Full detail per pasal
-    const pasalDir = join(consDir, law.id);
-    ensureDir(pasalDir);
-    for (const pasal of law.pasals) {
-      writeJson(join(pasalDir, `pasal-${pasal.number}.json`), envelop(pasal));
-      fileCount++;
-    }
-  }
-
-  // ── Summary ────────────────────────────────────────────────
-  console.log(`\n✅ API v1 build complete!`);
-  console.log(`   Files generated: ${fileCount}`);
-  console.log(`   Entries: ${allEntries.length}`);
-  console.log(`   Categories: ${api.categories.length}`);
-  console.log(`   Regulations: ${allRegs.length}`);
-  console.log(`   BPPU prefixes: ${bppuByPrefix.size}`);
-  console.log(`   Years: ${yearData.size}`);
-  console.log(`   Timelines: ${tlIndex.length}`);
-  console.log(`   Consolidated laws: ${allConsolidated.length}`);
-}
-
-main();
+import './generate.ts';
diff --git a/src/build.ts b/src/build.ts
index 4117d15..d3a7d99 100644
--- a/src/build.ts
+++ b/src/build.ts
@@ -1,246 +1 @@
-import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
-import { join, basename } from 'path';
-import Ajv from 'ajv';
-
-const ROOT = new URL('..', import.meta.url).pathname;
-
-// ── Load schemas ──────────────────────────────────────────────
-const ajv = new Ajv({ allErrors: true, strict: false });
-
-const taxRateSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/tax-rate-entry.json'), 'utf-8'));
-const regulationSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/regulation.json'), 'utf-8'));
-const consolidatedLawSchema = JSON.parse(readFileSync(join(ROOT, 'data/schema/consolidated-law.json'), 'utf-8'));
-
-const validateTaxRate = ajv.compile(taxRateSchema);
-const validateRegulation = ajv.compile(regulationSchema);
-const validateConsolidatedLaw = ajv.compile(consolidatedLawSchema);
-
-// ── Load regulations ──────────────────────────────────────────
-const regDir = join(ROOT, 'data/regulations');
-const regulations: any[] = [];
-
-for (const file of readdirSync(regDir).filter(f => f.endsWith('.json'))) {
-  const items = JSON.parse(readFileSync(join(regDir, file), 'utf-8'));
-  for (const reg of Array.isArray(items) ? items : [items]) {
-    if (!validateRegulation(reg)) {
-      console.error(`❌ Invalid regulation ${reg.id}: ${JSON.stringify(validateRegulation.errors?.slice(0, 3))}`);
-      process.exit(1);
-    }
-    regulations.push(reg);
-  }
-}
-console.log(`✅ Loaded ${regulations.length} regulations`);
-
-// ── Load tax rate entries ─────────────────────────────────────
-const catDir = join(ROOT, 'data/categories');
-const categories: any[] = [];
-const allEntries: any[] = [];
-let errorCount = 0;
-
-for (const file of readdirSync(catDir).filter(f => f.endsWith('.json'))) {
-  const catData = JSON.parse(readFileSync(join(catDir, file), 'utf-8'));
-  categories.push(catData);
-
-  for (const entry of catData.entries) {
-    if (!validateTaxRate(entry)) {
-      console.error(`❌ Invalid entry ${entry.id}: ${JSON.stringify(validateTaxRate.errors?.slice(0, 3))}`);
-      errorCount++;
-    }
-    allEntries.push(entry);
-  }
-}
-
-if (errorCount > 0) {
-  console.error(`\n❌ ${errorCount} validation errors found. Fix before proceeding.`);
-  process.exit(1);
-}
-
-console.log(`✅ Loaded ${allEntries.length} tax rate entries across ${categories.length} categories`);
-
-// ── Load consolidated laws ────────────────────────────────────
-const consDir = join(ROOT, 'data/consolidated');
-const consolidatedLaws: any[] = [];
-
-if (existsSync(consDir)) {
-  for (const file of readdirSync(consDir).filter(f => f.endsWith('.json'))) {
-    const law = JSON.parse(readFileSync(join(consDir, file), 'utf-8'));
-    if (!validateConsolidatedLaw(law)) {
-      console.error(`❌ Invalid consolidated law ${law.id}: ${JSON.stringify(validateConsolidatedLaw.errors?.slice(0, 3))}`);
-      process.exit(1);
-    }
-    consolidatedLaws.push(law);
-    console.log(`  📜 ${law.shortTitle}: ${law.pasals.length} pasals, ${law.amendmentChain.length} amendments`);
-  }
-
-// ── Recompute statistics from actual data ─────────────────────
-for (const law of consolidatedLaws) {
-  const counts: Record<string, number> = { berlaku: 0, diubah: 0, dicabut: 0, ditambah: 0 };
-  for (const p of law.pasals) {
-    const s = p.status || 'berlaku';
-    if (s in counts) counts[s]++;
-  }
-  law.statistics = {
-    totalPasals: law.pasals.length,
-    berlakuPasals: counts.berlaku,
-    diubahPasals: counts.diubah,
-    dicabutPasals: counts.dicabut,
-    ditambahPasals: counts.ditambah,
-    totalAmendments: law.amendmentChain.length,
-  };
-}
-
-}
-console.log(`✅ Loaded ${consolidatedLaws.length} consolidated laws`);
-
-// ── Generate public artifacts ─────────────────────────────────
-const publicDir = join(ROOT, 'public');
-
-// api.json - full database (with consolidated laws)
-const apiData = {
-  meta: {
-    name: 'tarif-pajak-id',
-    version: '0.2.0',
-    description: 'Open database tarif pajak Indonesia + UU Konsolidasi',
-    lastUpdated: new Date().toISOString().split('T')[0],
-    stats: {
-      regulations: regulations.length,
-      entries: allEntries.length,
-      categories: categories.map(c => ({ taxType: c.taxType, count: c.entries.length })),
-      consolidatedLaws: consolidatedLaws.map(l => ({
-        id: l.id,
-        shortTitle: l.shortTitle,
-        totalPasals: l.statistics.totalPasals,
-        totalAmendments: l.statistics.totalAmendments
-      }))
-    }
-  },
-  regulations,
-  categories: categories.map(c => ({
-    category: c.category,
-    taxType: c.taxType,
-    description: c.description,
-    serviceTypes: c.serviceTypes || null,
-    entries: c.entries
-  })),
-  consolidatedLaws: consolidatedLaws.map(l => ({
-    id: l.id,
-    title: l.title,
-    shortTitle: l.shortTitle,
-    description: l.description,
-    baseLaw: l.baseLaw,
-    amendmentChain: l.amendmentChain.map(a => ({
-      regulation: a.regulation,
-      order: a.order,
-      description: a.description,
-      effectiveDate: a.effectiveDate,
-      keyChanges: a.keyChanges || []
-    })),
-    structure: l.structure,
-    pasals: l.pasals,
-    statistics: l.statistics,
-    lastUpdated: l.lastUpdated,
-    sourceNotes: l.sourceNotes
-  }))
-};
-
-writeFileSync(join(publicDir, 'api.json'), JSON.stringify(apiData, null, 2));
-console.log('📝 Generated public/api.json');
-
-// rates.json - normalized flat entries
-const ratesData = allEntries.map(e => ({
-  id: e.id,
-  category: e.category,
-  taxType: e.taxType,
-  transactionType: e.transactionType,
-  rate: e.rate,
-  effectiveFrom: e.effectiveFrom,
-  effectiveTo: e.effectiveTo,
-  status: e.status,
-  tags: e.tags
-}));
-
-writeFileSync(join(publicDir, 'rates.json'), JSON.stringify(ratesData, null, 2));
-console.log('📝 Generated public/rates.json');
-
-// regulations.json
-writeFileSync(join(publicDir, 'regulations.json'), JSON.stringify(regulations, null, 2));
-console.log('📝 Generated public/regulations.json');
-
-// consolidated.json - standalone consolidated laws file
-writeFileSync(join(publicDir, 'consolidated.json'), JSON.stringify(consolidatedLaws, null, 2));
-console.log('📝 Generated public/consolidated.json');
-
-// llms.txt - chatbot-friendly guide
-const berlakuEntries = allEntries.filter(e => e.status === 'berlaku');
-
-let consolidatedSection = '';
-if (consolidatedLaws.length > 0) {
-  consolidatedSection = `
-## 📜 UU Konsolidasi
-Database ini juga memuat naskah konsolidasi UU pajak Indonesia yang menunjukkan teks terkini beserta riwayat perubahan setiap pasal.
-
-${consolidatedLaws.map(l => {
-  const chain = l.amendmentChain.map((a: any) => `    - ${a.regulation.type} ${a.regulation.number}/${a.regulation.year} (${a.description})`).join('\n');
-  const changedPasals = l.pasals.filter((p: any) => p.status === 'diubah').length;
-  const addedPasals = l.pasals.filter((p: any) => p.status === 'ditambah').length;
-  return `### ${l.shortTitle}
-- ${l.statistics.totalPasals} pasal total, ${l.statistics.totalAmendments} kali perubahan
-- ${changedPasals} pasal diubah, ${addedPasals} pasal ditambah, ${l.statistics.berlakuPasals} pasal berlaku sejak awal
-- Dasar: ${l.baseLaw.type} ${l.baseLaw.number}/${l.baseLaw.year}
-- Rantai perubahan:
-${chain}`;
-}).join('\n\n')}
-
-### Cara Membaca UU Konsolidasi
-- Setiap pasal memiliki \`amendmentHistory\` yang menunjukkan riwayat perubahan dari awal hingga sekarang
-- \`changeType\`: original (pasal asli), amended (diubah), added (ditambah baru), repealed (dicabut), partially_amended (diubah sebagian)
-- \`changedAyats\`: menunjukkan ayat mana yang berubah pada setiap perubahan
-- Akses via: \`/consolidated.json\` atau \`/api.json\` field \`consolidatedLaws\`
-`;
-}
-
-const llms = `# Tarif Pajak Indonesia Open Database (tarif-pajak-id)
-
-> Database tarif pajak Indonesia yang bersumber dari regulasi resmi.
-> Versi: 0.2.0 | Terverifikasi: ${new Date().toISOString().split('T')[0]}
-> Lisensi: MIT (kode) + CC-BY-SA (data)
-
-## Statistik
-- ${regulations.length} regulasi tercatat
-- ${allEntries.length} entry tarif pajak (${berlakuEntries.length} berlaku saat ini)
-- ${categories.length} kategori pajak
-- ${consolidatedLaws.length} UU konsolidasi
-
-## Kategori Pajak
-${categories.map(c => `- **${c.taxType}** (${c.category}): ${c.entries.length} tarif - ${c.description}`).join('\n')}
-
-## Tarif yang Sedang Berlaku
-${berlakuEntries.map(e => `### ${e.taxType} - ${e.transactionType}
-- ID: ${e.id}
-- Tarif: ${e.rate.type === 'percentage' ? e.rate.value + '%' : e.rate.type === 'range' ? e.rate.value[0] + '% - ' + e.rate.value[1] + '%' : e.rate.type === 'progressive' ? 'Progresif ' + e.rate.brackets?.length + ' lapis' : String(e.rate.value)}
-- Status: ${e.status}
-- Berlaku sejak: ${e.effectiveFrom}
-- Dasar hukum: ${e.legalBasis.map(l => l.regulation).join(', ')}
-${e.notes ? '- Catatan: ' + e.notes.substring(0, 200) : ''}`).join('\n\n')}
-${consolidatedSection}
-## Disclaimer
-Database ini adalah referensi bersumber dari regulasi resmi, BUKAN nasihat hukum atau pajak.
-Selalu verifikasi dengan peraturan resmi terbaru.
-
-## Links
-- API: https://tarif-pajak-id.vercel.app/api.json
-- Consolidated: https://tarif-pajak-id.vercel.app/consolidated.json
-- GitHub: https://github.com/user/tarif-pajak-id
-- Sumber regulasi: pasal.id, peraturan.bpk.go.id, peraturan.go.id
-`;
-
-writeFileSync(join(publicDir, 'llms.txt'), llms);
-console.log('📝 Generated public/llms.txt');
-
-console.log('\n✅ Build complete!');
-console.log(`   Regulations: ${regulations.length}`);
-console.log(`   Tax entries: ${allEntries.length}`);
-console.log(`   Active: ${berlakuEntries.length}`);
-console.log(`   Categories: ${categories.length}`);
-console.log(`   Consolidated Laws: ${consolidatedLaws.length}`);
-console.log(`   Total consolidated pasals: ${consolidatedLaws.reduce((sum, l) => sum + l.pasals.length, 0)}`);
+import './generate.ts';
diff --git a/tsconfig.json b/tsconfig.json
index 2c4b6d0..75204ce 100644
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -1,14 +1,15 @@
 {
   "compilerOptions": {
     "target": "ES2022",
-    "module": "Node16",
-    "moduleResolution": "Node16",
+    "module": "NodeNext",
+    "moduleResolution": "NodeNext",
     "strict": true,
     "esModuleInterop": true,
     "resolveJsonModule": true,
     "outDir": "dist",
-    "rootDir": "src",
-    "declaration": true
+    "rootDir": ".",
+    "declaration": true,
+    "types": ["node", "vitest/globals"]
   },
-  "include": ["src/**/*"]
+  "include": ["src/**/*", "tests/**/*", "vitest.config.ts"]
 }

```

## Untracked
```text
.superpowers/sdd/task-1-brief.md
.superpowers/sdd/task-1-report.md
.superpowers/sdd/task-1-review-package-v2.md
.superpowers/sdd/task-1-review-package.md
docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md
docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md
pnpm-workspace.yaml
public/api/v1/bppu/22-100.json
public/api/v1/bppu/22-101.json
public/api/v1/bppu/22-102.json
public/api/v1/bppu/22-200.json
public/api/v1/bppu/22-401.json
public/api/v1/bppu/22-403.json
public/api/v1/bppu/22-404.json
public/api/v1/bppu/22-405.json
public/api/v1/bppu/22-900.json
public/api/v1/bppu/22-910.json
public/api/v1/bppu/24-100.json
public/api/v1/bppu/24-101.json
public/api/v1/bppu/24-102.json
public/api/v1/bppu/24-103.json
public/api/v1/bppu/24-104.json
public/api/v1/bppu/24-105.json
public/api/v1/bppu/28-401.json
public/api/v1/bppu/28-402.json
public/api/v1/bppu/28-403.json
public/api/v1/bppu/28-404.json
public/api/v1/bppu/28-405.json
public/api/v1/bppu/28-406.json
public/api/v1/bppu/28-407.json
public/api/v1/bppu/28-408.json
public/api/v1/bppu/28-409.json
public/api/v1/bppu/28-410.json
public/api/v1/bppu/28-411.json
public/api/v1/bppu/28-413.json
public/api/v1/bppu/28-417.json
public/api/v1/bppu/28-419.json
public/api/v1/bppu/28-421.json
public/api/v1/bppu/28-423.json
public/api/v1/bppu/28-499.json
public/api/v1/bppu/29-101.json
public/api/v1/bppu/index.json
public/api/v1/by-year/1984.json
public/api/v1/by-year/1985.json
public/api/v1/by-year/1986.json
public/api/v1/by-year/1987.json
public/api/v1/by-year/1988.json
public/api/v1/by-year/1989.json
public/api/v1/by-year/1990.json
public/api/v1/by-year/1991.json
public/api/v1/by-year/1992.json
public/api/v1/by-year/1993.json
public/api/v1/by-year/1994.json
public/api/v1/by-year/1995.json
public/api/v1/by-year/1996.json
public/api/v1/by-year/1997.json
public/api/v1/by-year/1998.json
public/api/v1/by-year/1999.json
public/api/v1/by-year/2000.json
public/api/v1/by-year/2001.json
public/api/v1/by-year/2002.json
public/api/v1/by-year/2003.json
public/api/v1/by-year/2004.json
public/api/v1/by-year/2005.json
public/api/v1/by-year/2006.json
public/api/v1/by-year/2007.json
public/api/v1/by-year/2008.json
public/api/v1/by-year/2009.json
public/api/v1/by-year/2010.json
public/api/v1/by-year/2011.json
public/api/v1/by-year/2012.json
public/api/v1/by-year/2013.json
public/api/v1/by-year/2014.json
public/api/v1/by-year/2015.json
public/api/v1/by-year/2016.json
public/api/v1/by-year/2017.json
public/api/v1/by-year/2018.json
public/api/v1/by-year/2019.json
public/api/v1/by-year/2020.json
public/api/v1/by-year/2021.json
public/api/v1/by-year/2022.json
public/api/v1/by-year/2023.json
public/api/v1/by-year/2024.json
public/api/v1/by-year/2025.json
public/api/v1/by-year/2026.json
public/api/v1/calculator/index.json
public/api/v1/calculator/pph-21.json
public/api/v1/calculator/pph-23.json
public/api/v1/calculator/pph-badan.json
public/api/v1/calculator/ppn.json
public/api/v1/categories/bea-masuk.json
public/api/v1/categories/bea-meterai.json
public/api/v1/categories/bphtb.json
public/api/v1/categories/cukai.json
public/api/v1/categories/index.json
public/api/v1/categories/pajak-daerah.json
public/api/v1/categories/pbb.json
public/api/v1/categories/pph-21.json
public/api/v1/categories/pph-22.json
public/api/v1/categories/pph-23.json
public/api/v1/categories/pph-26.json
public/api/v1/categories/pph-4-2-final.json
public/api/v1/categories/pph-badan.json
public/api/v1/categories/pph-umkm.json
public/api/v1/categories/ppn.json
public/api/v1/categories/ppnbm.json
public/api/v1/consolidated/index.json
public/api/v1/consolidated/uu-kup-konsolidasi.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-1.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-10.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-11.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-12.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-13.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-14.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-15.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-16.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-17.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-17A.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-18.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-19.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-2.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-20.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-21.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-22.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-23.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-24.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-25.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-26.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-27.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-28.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-29.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-2A.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-3.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-30.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-31.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-32.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-33.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-34.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-35.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-36.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-37.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-38.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-39.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-4.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-40.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-41.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-42.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-43.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-43A.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-43B.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44A.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44B.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44C.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44D.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-44E.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-45.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-46.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-47.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-48.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-49.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-5.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-6.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-7.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-8.json
public/api/v1/consolidated/uu-kup-konsolidasi/pasal-9.json
public/api/v1/consolidated/uu-pph-konsolidasi.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-1.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-10.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-11.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-12.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-13.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-14.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-15.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-16.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-17.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-17A.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-18.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-18A.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-19.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-2.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-20.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-21.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-22.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-23.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-24.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-25.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-26.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-27.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-28.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-29.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-2A.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-2B.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-3.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-30.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-31.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-31A.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-31B.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-32.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-33.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-34.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-35.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-36.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-37.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-4.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-5.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-6.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-6A.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-7.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-8.json
public/api/v1/consolidated/uu-pph-konsolidasi/pasal-9.json
public/api/v1/consolidated/uu-ppn-konsolidasi.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-1.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-10.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-11.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-12.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-13.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-13A.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-14.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-15.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16A.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16B.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16C.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16D.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16E.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-16F.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-17.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-18.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-19.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-2.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-20.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-21.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-22.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-23.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-24.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-25.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-26.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-27.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-28.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-29.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-3.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-30.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-31.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-32.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-33.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-34.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-4.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-4A.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-5.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-6.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-6A.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-7.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-8.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-9.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-9A.json
public/api/v1/consolidated/uu-ppn-konsolidasi/pasal-9B.json
public/api/v1/entries/bea-masuk-anti-dumping.json
public/api/v1/entries/bea-masuk-asean-atiga.json
public/api/v1/entries/bea-masuk-bmt.json
public/api/v1/entries/bea-masuk-umum-mf.json
public/api/v1/entries/bea-meterai-1000.json
public/api/v1/entries/bea-meterai-3000.json
public/api/v1/entries/bea-meterai-cek-bilyet.json
public/api/v1/entries/bea-meterai-dokumen-2021.json
public/api/v1/entries/bea-meterai-kontrak.json
public/api/v1/entries/bea-meterai-nota-kredit.json
public/api/v1/entries/bea-meterai-pre2021.json
public/api/v1/entries/bea-meterai-surat-berharga.json
public/api/v1/entries/bphtb-pengalihan-dinkes.json
public/api/v1/entries/bphtb-perolehan-umum.json
public/api/v1/entries/bphtb-perolehan-waris.json
public/api/v1/entries/cukai-ecigarette.json
public/api/v1/entries/cukai-eti-alkohol.json
public/api/v1/entries/cukai-hasil-tembakau.json
public/api/v1/entries/index.json
public/api/v1/entries/pajak-daerah-air-tanah.json
public/api/v1/entries/pajak-daerah-hiburan.json
public/api/v1/entries/pajak-daerah-hotel.json
public/api/v1/entries/pajak-daerah-mineral-air.json
public/api/v1/entries/pajak-daerah-parkir.json
public/api/v1/entries/pajak-daerah-penerangan-jalan.json
public/api/v1/entries/pajak-daerah-reklame.json
public/api/v1/entries/pajak-daerah-restoran.json
public/api/v1/entries/pbb-kehutanan.json
public/api/v1/entries/pbb-perkebunan.json
public/api/v1/entries/pbb-perkotaan.json
public/api/v1/entries/pbb-pertambangan.json
public/api/v1/entries/pph-15-buta-charter.json
public/api/v1/entries/pph-15-pelayaran-domestik.json
public/api/v1/entries/pph-15-penerbangan-domestik.json
public/api/v1/entries/pph-15-perusahaan-asuransi.json
public/api/v1/entries/pph-15-perusahaan-kontraktor.json
public/api/v1/entries/pph-15-pma-opec.json
public/api/v1/entries/pph-21-dana-pensiun.json
public/api/v1/entries/pph-21-honorarium-bukan-pegawai.json
public/api/v1/entries/pph-21-natura-kenikmatan.json
public/api/v1/entries/pph-21-non-taxable-income.json
public/api/v1/entries/pph-21-norma-akuntan.json
public/api/v1/entries/pph-21-norma-arsitek.json
public/api/v1/entries/pph-21-norma-dokter.json
public/api/v1/entries/pph-21-norma-konsultan.json
public/api/v1/entries/pph-21-norma-notaris.json
public/api/v1/entries/pph-21-norma-pedagang.json
public/api/v1/entries/pph-21-norma-pengacara.json
public/api/v1/entries/pph-21-norma-pengusaha-kecil.json
public/api/v1/entries/pph-21-norma-petani.json
public/api/v1/entries/pph-21-pegawai-tidak-tetap.json
public/api/v1/entries/pph-21-progressive-annual-2024.json
public/api/v1/entries/pph-21-progressive-monthly-pre2024.json
public/api/v1/entries/pph-21-progressive-pre2009.json
public/api/v1/entries/pph-21-progressive-pre2022.json
public/api/v1/entries/pph-21-progressive-uulama1983.json
public/api/v1/entries/pph-21-progressive-uulama1994.json
public/api/v1/entries/pph-21-ptkp-1984.json
public/api/v1/entries/pph-21-ptkp-1995.json
public/api/v1/entries/pph-21-ptkp-2005.json
public/api/v1/entries/pph-21-ptkp-2009.json
public/api/v1/entries/pph-21-shu-koperasi.json
public/api/v1/entries/pph-21-ter-a-detail.json
public/api/v1/entries/pph-21-ter-b-detail.json
public/api/v1/entries/pph-21-ter-c-detail.json
public/api/v1/entries/pph-21-ter-monthly-2024.json
public/api/v1/entries/pph-22-bendaharawan.json
public/api/v1/entries/pph-22-bumn-pembelian.json
public/api/v1/entries/pph-22-ekspor-batubara.json
public/api/v1/entries/pph-22-impor-2024.json
public/api/v1/entries/pph-22-impor-api-produsen.json
public/api/v1/entries/pph-22-kripto.json
public/api/v1/entries/pph-22-pembelian-barang-2024.json
public/api/v1/entries/pph-22-pengadaan-pemerintah.json
public/api/v1/entries/pph-22-penjualan-barang-2024.json
public/api/v1/entries/pph-22-pmse.json
public/api/v1/entries/pph-22-pre2024.json
public/api/v1/entries/pph-23-hadiah-penghargaan.json
public/api/v1/entries/pph-23-jasa-2001.json
public/api/v1/entries/pph-23-jasa-katering-2pct.json
public/api/v1/entries/pph-23-jasa-lain-2pct.json
public/api/v1/entries/pph-23-jasa-lain-4pct.json
public/api/v1/entries/pph-23-jasa-pre2001.json
public/api/v1/entries/pph-23-katering-pre2015.json
public/api/v1/entries/pph-23-sewa-tanah-bangunan.json
public/api/v1/entries/pph-26-bunga.json
public/api/v1/entries/pph-26-but.json
public/api/v1/entries/pph-26-dividen.json
public/api/v1/entries/pph-26-general-2024.json
public/api/v1/entries/pph-26-jasa-dan-sewa.json
public/api/v1/entries/pph-26-royalti.json
public/api/v1/entries/pph-26-tax-treaty.json
public/api/v1/entries/pph-badan-2022-plus.json
public/api/v1/entries/pph-badan-go-public.json
public/api/v1/entries/pph-badan-ikn-0pct.json
public/api/v1/entries/pph-badan-ikn-10y.json
public/api/v1/entries/pph-badan-pre2001.json
public/api/v1/entries/pph-badan-pre2010.json
public/api/v1/entries/pph-badan-pre2022.json
public/api/v1/entries/pph-badan-umkm.json
public/api/v1/entries/pph-final-bunga-deposito.json
public/api/v1/entries/pph-final-bunga-koperasi.json
public/api/v1/entries/pph-final-bunga-pre2009.json
public/api/v1/entries/pph-final-hadiah-undian.json
public/api/v1/entries/pph-final-investasi-lpi.json
public/api/v1/entries/pph-final-konstruksi.json
public/api/v1/entries/pph-final-migas.json
public/api/v1/entries/pph-final-pengalihan-pp131.json
public/api/v1/entries/pph-final-pengalihan-pp71.json
public/api/v1/entries/pph-final-sewa-tanah.json
public/api/v1/entries/pph-final-transaksi-saham-bursa.json
public/api/v1/entries/pph-final-transportasi.json
public/api/v1/entries/pph-umkm-05pct-2018.json
public/api/v1/entries/pph-umkm-05pct-2023.json
public/api/v1/entries/pph-umkm-1pct-pp46.json
public/api/v1/entries/ppn-10pct.json
public/api/v1/entries/ppn-11pct-2022.json
public/api/v1/entries/ppn-11pct-effective-2025.json
public/api/v1/entries/ppn-dpp-penghitungan.json
public/api/v1/entries/ppn-ekspor-bkp.json
public/api/v1/entries/ppn-ekspor-jkp.json
public/api/v1/entries/ppn-impor-bkp.json
public/api/v1/entries/ppn-jasa-kegiatan-usaha-persewaan.json
public/api/v1/entries/ppn-jasa-telekomunikasi.json
public/api/v1/entries/ppn-jasa-tenaga-listrik.json
public/api/v1/entries/ppn-jkpt-industri.json
public/api/v1/entries/ppn-pengkreditan.json
public/api/v1/entries/ppn-pmse.json
public/api/v1/entries/ppn-tidak-kena-pajak.json
public/api/v1/entries/ppnbm-general.json
public/api/v1/entries/ppnbm-kapal-pesiar.json
public/api/v1/entries/ppnbm-perlengkapan-mewah.json
public/api/v1/entries/ppnbm-pesawat-pribadi.json
public/api/v1/entries/ppnbm-rumah-mewah.json
public/api/v1/entries/ppnbm-sedan-station-wagon.json
public/api/v1/entries/ppnbm-suv-4x4.json
public/api/v1/entries/ppnbm-van-wagon.json
public/api/v1/index.json
public/api/v1/openapi.json
public/api/v1/regulations/index.json
public/api/v1/regulations/perpres-55-2013.json
public/api/v1/regulations/pmk-122-2015.json
public/api/v1/regulations/pmk-131-2024.json
public/api/v1/regulations/pmk-138-2005.json
public/api/v1/regulations/pmk-141-2015.json
public/api/v1/regulations/pmk-162-2009.json
public/api/v1/regulations/pmk-168-2023.json
public/api/v1/regulations/pmk-202-2023.json
public/api/v1/regulations/pmk-43-2022.json
public/api/v1/regulations/pmk-523-2002.json
public/api/v1/regulations/pp-131-2000.json
public/api/v1/regulations/pp-14-2002.json
public/api/v1/regulations/pp-16-2009.json
public/api/v1/regulations/pp-23-2000.json
public/api/v1/regulations/pp-23-2018.json
public/api/v1/regulations/pp-28-2023.json
public/api/v1/regulations/pp-40-2009.json
public/api/v1/regulations/pp-44-2022.json
public/api/v1/regulations/pp-46-2013.json
public/api/v1/regulations/pp-51-2008.json
public/api/v1/regulations/pp-55-2022.json
public/api/v1/regulations/pp-58-2023.json
public/api/v1/regulations/pp-60-2023.json
public/api/v1/regulations/pp-71-2008.json
public/api/v1/regulations/pp-80-2007.json
public/api/v1/regulations/pp-94-2010.json
public/api/v1/regulations/uu-1-2022-hkpd.json
public/api/v1/regulations/uu-10-1994.json
public/api/v1/regulations/uu-10-1995.json
public/api/v1/regulations/uu-10-2020-bea-meterai.json
public/api/v1/regulations/uu-13-1985.json
public/api/v1/regulations/uu-17-2000.json
public/api/v1/regulations/uu-28-2009.json
public/api/v1/regulations/uu-36-2008.json
public/api/v1/regulations/uu-39-2007.json
public/api/v1/regulations/uu-42-2009.json
public/api/v1/regulations/uu-7-1983-pph.json
public/api/v1/regulations/uu-7-2021-hpp.json
public/api/v1/regulations/uu-8-1983-ppn.json
public/api/v1/search-index.json
public/api/v1/stats.json
public/api/v1/timeline/bea-meterai.json
public/api/v1/timeline/index.json
public/api/v1/timeline/pph-21-monthly.json
public/api/v1/timeline/pph-21-progressive.json
public/api/v1/timeline/pph-21-ptkp.json
public/api/v1/timeline/pph-23-jasa.json
public/api/v1/timeline/pph-badan.json
public/api/v1/timeline/pph-final-bunga.json
public/api/v1/timeline/pph-final-pengalihan.json
public/api/v1/timeline/pph-umkm.json
public/api/v1/timeline/ppn.json
public/generated-manifest.json
public/release.json
src/core/release.ts
src/generate.ts
src/paths.ts
src/pipeline.ts
src/sync-website.ts
src/validate.ts
src/validation/ajv.ts
src/validation/load.ts
src/validation/report.ts
tests/contracts/artifact-sync.test.ts
tests/contracts/release-metadata.test.ts
tests/unit/ajv-formats.test.ts
tests/unit/load-order.test.ts
tests/unit/release.test.ts
tests/unit/temporal-bounds.test.ts
vitest.config.ts
website/pnpm-workspace.yaml
website/public/consolidated.json
website/public/generated-manifest.json
website/public/release.json

```
