# Task 2 Review Package

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
?? data/schema/v2/
?? data/v2/
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
 public/llms.txt                                    |     4 +-
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
 452 files changed, 14985 insertions(+), 12028 deletions(-)

```

## Task 2 Files
```text
data/schema/v2/concept.schema.json
data/schema/v2/rule.schema.json
data/schema/v2/source.schema.json
data/v2/categories.json
data/v2/concepts.json
data/v2/conflicts.json
data/v2/sources.json
src/core/conditions.ts
src/core/date.ts
src/core/rate.ts
src/core/types.ts
src/validation/semantic.ts
tests/unit/conditions.test.ts
tests/unit/date.test.ts
tests/unit/rate.test.ts
tests/unit/semantic-validation.test.ts

```
