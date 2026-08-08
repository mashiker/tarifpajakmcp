# Task 1 Review Package

## Status
```text
 M .gitignore
 M package.json
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
 .gitignore                                         |    1 +
 package.json                                       |   25 +-
 public/api.json                                    |    2 +-
 public/llms.txt                                    |    6 +-
 src/build-api.ts                                   |  518 +----
 src/build.ts                                       |  247 +--
 tsconfig.json                                      |   11 +-
 website/public/api.json                            | 1988 +++++++++++++++++++-
 website/public/api/v1/bppu/22-100.json             |    2 +-
 website/public/api/v1/bppu/22-101.json             |    2 +-
 website/public/api/v1/bppu/22-102.json             |    2 +-
 website/public/api/v1/bppu/22-200.json             |    2 +-
 website/public/api/v1/bppu/22-401.json             |    2 +-
 website/public/api/v1/bppu/22-403.json             |    2 +-
 website/public/api/v1/bppu/22-404.json             |    2 +-
 website/public/api/v1/bppu/22-405.json             |    2 +-
 website/public/api/v1/bppu/22-900.json             |    2 +-
 website/public/api/v1/bppu/22-910.json             |    2 +-
 website/public/api/v1/bppu/24-100.json             |    2 +-
 website/public/api/v1/bppu/24-101.json             |    2 +-
 website/public/api/v1/bppu/24-102.json             |    2 +-
 website/public/api/v1/bppu/24-103.json             |    2 +-
 website/public/api/v1/bppu/24-104.json             |    2 +-
 website/public/api/v1/bppu/24-105.json             |    2 +-
 website/public/api/v1/bppu/28-401.json             |    2 +-
 website/public/api/v1/bppu/28-402.json             |    2 +-
 website/public/api/v1/bppu/28-403.json             |    2 +-
 website/public/api/v1/bppu/28-404.json             |    2 +-
 website/public/api/v1/bppu/28-405.json             |    2 +-
 website/public/api/v1/bppu/28-406.json             |    2 +-
 website/public/api/v1/bppu/28-407.json             |    2 +-
 website/public/api/v1/bppu/28-408.json             |    2 +-
 website/public/api/v1/bppu/28-409.json             |    2 +-
 website/public/api/v1/bppu/28-410.json             |    2 +-
 website/public/api/v1/bppu/28-411.json             |    2 +-
 website/public/api/v1/bppu/28-413.json             |    2 +-
 website/public/api/v1/bppu/28-417.json             |    2 +-
 website/public/api/v1/bppu/28-419.json             |    2 +-
 website/public/api/v1/bppu/28-421.json             |    2 +-
 website/public/api/v1/bppu/28-423.json             |    2 +-
 website/public/api/v1/bppu/28-499.json             |    2 +-
 website/public/api/v1/bppu/29-101.json             |    2 +-
 website/public/api/v1/bppu/index.json              |    2 +-
 website/public/api/v1/by-year/1984.json            |    2 +-
 website/public/api/v1/by-year/1985.json            |    2 +-
 website/public/api/v1/by-year/1986.json            |    2 +-
 website/public/api/v1/by-year/1987.json            |    2 +-
 website/public/api/v1/by-year/1988.json            |    2 +-
 website/public/api/v1/by-year/1989.json            |    2 +-
 website/public/api/v1/by-year/1990.json            |    2 +-
 website/public/api/v1/by-year/1991.json            |    2 +-
 website/public/api/v1/by-year/1992.json            |    2 +-
 website/public/api/v1/by-year/1993.json            |    2 +-
 website/public/api/v1/by-year/1994.json            |    2 +-
 website/public/api/v1/by-year/1995.json            |    2 +-
 website/public/api/v1/by-year/1996.json            |    2 +-
 website/public/api/v1/by-year/1997.json            |    2 +-
 website/public/api/v1/by-year/1998.json            |    2 +-
 website/public/api/v1/by-year/1999.json            |    2 +-
 website/public/api/v1/by-year/2000.json            |    2 +-
 website/public/api/v1/by-year/2001.json            |    2 +-
 website/public/api/v1/by-year/2002.json            |    2 +-
 website/public/api/v1/by-year/2003.json            |    2 +-
 website/public/api/v1/by-year/2004.json            |    2 +-
 website/public/api/v1/by-year/2005.json            |    2 +-
 website/public/api/v1/by-year/2006.json            |    2 +-
 website/public/api/v1/by-year/2007.json            |    2 +-
 website/public/api/v1/by-year/2008.json            |    2 +-
 website/public/api/v1/by-year/2009.json            |    2 +-
 website/public/api/v1/by-year/2010.json            |    2 +-
 website/public/api/v1/by-year/2011.json            |    2 +-
 website/public/api/v1/by-year/2012.json            |    2 +-
 website/public/api/v1/by-year/2013.json            |    2 +-
 website/public/api/v1/by-year/2014.json            |    2 +-
 website/public/api/v1/by-year/2015.json            |    2 +-
 website/public/api/v1/by-year/2016.json            |    2 +-
 website/public/api/v1/by-year/2017.json            |    2 +-
 website/public/api/v1/by-year/2018.json            |    2 +-
 website/public/api/v1/by-year/2019.json            |    2 +-
 website/public/api/v1/by-year/2020.json            |    2 +-
 website/public/api/v1/by-year/2021.json            |    2 +-
 website/public/api/v1/by-year/2022.json            |    2 +-
 website/public/api/v1/by-year/2023.json            |    2 +-
 website/public/api/v1/by-year/2024.json            |    2 +-
 website/public/api/v1/calculator/index.json        |    2 +-
 website/public/api/v1/calculator/pph-21.json       |    2 +-
 website/public/api/v1/calculator/pph-23.json       |    2 +-
 website/public/api/v1/calculator/pph-badan.json    |    2 +-
 website/public/api/v1/calculator/ppn.json          |    2 +-
 website/public/api/v1/categories/bea-masuk.json    |    2 +-
 website/public/api/v1/categories/bea-meterai.json  |    2 +-
 website/public/api/v1/categories/bphtb.json        |    2 +-
 website/public/api/v1/categories/cukai.json        |    2 +-
 website/public/api/v1/categories/index.json        |    2 +-
 website/public/api/v1/categories/pajak-daerah.json |    2 +-
 website/public/api/v1/categories/pbb.json          |    2 +-
 website/public/api/v1/categories/pph-21.json       |    2 +-
 website/public/api/v1/categories/pph-22.json       |    2 +-
 website/public/api/v1/categories/pph-23.json       |    2 +-
 website/public/api/v1/categories/pph-26.json       |    2 +-
 .../public/api/v1/categories/pph-4-2-final.json    |    2 +-
 website/public/api/v1/categories/pph-badan.json    |    2 +-
 website/public/api/v1/categories/pph-umkm.json     |    2 +-
 website/public/api/v1/categories/ppn.json          |    2 +-
 website/public/api/v1/categories/ppnbm.json        |    2 +-
 website/public/api/v1/consolidated/index.json      |    2 +-
 .../api/v1/consolidated/uu-kup-konsolidasi.json    |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-1.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-10.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-11.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-12.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-13.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-14.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-15.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-16.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-17.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-17A.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-18.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-19.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-2.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-20.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-21.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-22.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-23.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-24.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-25.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-26.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-27.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-28.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-29.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-2A.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-3.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-30.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-31.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-32.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-33.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-34.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-35.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-36.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-37.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-38.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-39.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-4.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-40.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-41.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-42.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-43.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-43A.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-43B.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44A.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44B.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44C.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44D.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-44E.json |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-45.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-46.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-47.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-48.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-49.json  |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-5.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-6.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-7.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-8.json   |    2 +-
 .../consolidated/uu-kup-konsolidasi/pasal-9.json   |    2 +-
 .../api/v1/consolidated/uu-pph-konsolidasi.json    |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-1.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-10.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-11.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-12.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-13.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-14.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-15.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-16.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-17.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-17A.json |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-18.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-18A.json |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-19.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-2.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-20.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-21.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-22.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-23.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-24.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-25.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-26.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-27.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-28.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-29.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-2A.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-2B.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-3.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-30.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-31.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-31A.json |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-31B.json |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-32.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-33.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-34.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-35.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-36.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-37.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-4.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-5.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-6.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-6A.json  |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-7.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-8.json   |    2 +-
 .../consolidated/uu-pph-konsolidasi/pasal-9.json   |    2 +-
 .../api/v1/consolidated/uu-ppn-konsolidasi.json    |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-1.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-10.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-11.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-12.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-13.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-13A.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-14.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-15.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16A.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16B.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16C.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16D.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16E.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-16F.json |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-17.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-18.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-19.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-2.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-20.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-21.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-22.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-23.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-24.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-25.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-26.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-27.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-28.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-29.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-3.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-30.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-31.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-32.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-33.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-34.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-4.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-4A.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-5.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-6.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-6A.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-7.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-8.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-9.json   |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-9A.json  |    2 +-
 .../consolidated/uu-ppn-konsolidasi/pasal-9B.json  |    2 +-
 .../api/v1/entries/bea-masuk-anti-dumping.json     |    2 +-
 .../api/v1/entries/bea-masuk-asean-atiga.json      |    2 +-
 website/public/api/v1/entries/bea-masuk-bmt.json   |    2 +-
 .../public/api/v1/entries/bea-masuk-umum-mf.json   |    2 +-
 .../public/api/v1/entries/bea-meterai-1000.json    |    2 +-
 .../public/api/v1/entries/bea-meterai-3000.json    |    2 +-
 .../api/v1/entries/bea-meterai-cek-bilyet.json     |    2 +-
 .../api/v1/entries/bea-meterai-dokumen-2021.json   |    2 +-
 .../public/api/v1/entries/bea-meterai-kontrak.json |    2 +-
 .../api/v1/entries/bea-meterai-nota-kredit.json    |    2 +-
 .../public/api/v1/entries/bea-meterai-pre2021.json |    2 +-
 .../api/v1/entries/bea-meterai-surat-berharga.json |    2 +-
 .../api/v1/entries/bphtb-pengalihan-dinkes.json    |    2 +-
 .../api/v1/entries/bphtb-perolehan-umum.json       |    2 +-
 .../api/v1/entries/bphtb-perolehan-waris.json      |    2 +-
 .../public/api/v1/entries/cukai-ecigarette.json    |    2 +-
 .../public/api/v1/entries/cukai-eti-alkohol.json   |    2 +-
 .../api/v1/entries/cukai-hasil-tembakau.json       |    2 +-
 website/public/api/v1/entries/index.json           |    2 +-
 .../api/v1/entries/pajak-daerah-air-tanah.json     |    2 +-
 .../api/v1/entries/pajak-daerah-hiburan.json       |    2 +-
 .../public/api/v1/entries/pajak-daerah-hotel.json  |    2 +-
 .../api/v1/entries/pajak-daerah-mineral-air.json   |    2 +-
 .../public/api/v1/entries/pajak-daerah-parkir.json |    2 +-
 .../v1/entries/pajak-daerah-penerangan-jalan.json  |    2 +-
 .../api/v1/entries/pajak-daerah-reklame.json       |    2 +-
 .../api/v1/entries/pajak-daerah-restoran.json      |    2 +-
 website/public/api/v1/entries/pbb-kehutanan.json   |    2 +-
 website/public/api/v1/entries/pbb-perkebunan.json  |    2 +-
 website/public/api/v1/entries/pbb-perkotaan.json   |    2 +-
 .../public/api/v1/entries/pbb-pertambangan.json    |    2 +-
 .../public/api/v1/entries/pph-15-buta-charter.json |    2 +-
 .../api/v1/entries/pph-15-pelayaran-domestik.json  |    2 +-
 .../v1/entries/pph-15-penerbangan-domestik.json    |    2 +-
 .../api/v1/entries/pph-15-perusahaan-asuransi.json |    2 +-
 .../v1/entries/pph-15-perusahaan-kontraktor.json   |    2 +-
 website/public/api/v1/entries/pph-15-pma-opec.json |    2 +-
 .../public/api/v1/entries/pph-21-dana-pensiun.json |    2 +-
 .../entries/pph-21-honorarium-bukan-pegawai.json   |    2 +-
 .../api/v1/entries/pph-21-natura-kenikmatan.json   |    2 +-
 .../api/v1/entries/pph-21-non-taxable-income.json  |    2 +-
 .../api/v1/entries/pph-21-norma-akuntan.json       |    2 +-
 .../api/v1/entries/pph-21-norma-arsitek.json       |    2 +-
 .../public/api/v1/entries/pph-21-norma-dokter.json |    2 +-
 .../api/v1/entries/pph-21-norma-konsultan.json     |    2 +-
 .../api/v1/entries/pph-21-norma-notaris.json       |    2 +-
 .../api/v1/entries/pph-21-norma-pedagang.json      |    2 +-
 .../api/v1/entries/pph-21-norma-pengacara.json     |    2 +-
 .../v1/entries/pph-21-norma-pengusaha-kecil.json   |    2 +-
 .../public/api/v1/entries/pph-21-norma-petani.json |    2 +-
 .../api/v1/entries/pph-21-pegawai-tidak-tetap.json |    2 +-
 .../v1/entries/pph-21-progressive-annual-2024.json |    2 +-
 .../pph-21-progressive-monthly-pre2024.json        |    2 +-
 .../api/v1/entries/pph-21-progressive-pre2009.json |    2 +-
 .../api/v1/entries/pph-21-progressive-pre2022.json |    2 +-
 .../v1/entries/pph-21-progressive-uulama1983.json  |    2 +-
 .../v1/entries/pph-21-progressive-uulama1994.json  |    2 +-
 .../public/api/v1/entries/pph-21-ptkp-1984.json    |    2 +-
 .../public/api/v1/entries/pph-21-ptkp-1995.json    |    2 +-
 .../public/api/v1/entries/pph-21-ptkp-2005.json    |    2 +-
 .../public/api/v1/entries/pph-21-ptkp-2009.json    |    2 +-
 .../public/api/v1/entries/pph-21-shu-koperasi.json |    2 +-
 .../public/api/v1/entries/pph-21-ter-a-detail.json |    2 +-
 .../public/api/v1/entries/pph-21-ter-b-detail.json |    2 +-
 .../public/api/v1/entries/pph-21-ter-c-detail.json |    2 +-
 .../api/v1/entries/pph-21-ter-monthly-2024.json    |    2 +-
 .../public/api/v1/entries/pph-22-bendaharawan.json |    2 +-
 .../api/v1/entries/pph-22-bumn-pembelian.json      |    2 +-
 .../api/v1/entries/pph-22-ekspor-batubara.json     |    2 +-
 .../public/api/v1/entries/pph-22-impor-2024.json   |    2 +-
 .../api/v1/entries/pph-22-impor-api-produsen.json  |    2 +-
 website/public/api/v1/entries/pph-22-kripto.json   |    2 +-
 .../v1/entries/pph-22-pembelian-barang-2024.json   |    2 +-
 .../v1/entries/pph-22-pengadaan-pemerintah.json    |    2 +-
 .../v1/entries/pph-22-penjualan-barang-2024.json   |    2 +-
 website/public/api/v1/entries/pph-22-pmse.json     |    2 +-
 website/public/api/v1/entries/pph-22-pre2024.json  |    2 +-
 .../api/v1/entries/pph-23-hadiah-penghargaan.json  |    2 +-
 .../public/api/v1/entries/pph-23-jasa-2001.json    |    2 +-
 .../api/v1/entries/pph-23-jasa-katering-2pct.json  |    2 +-
 .../api/v1/entries/pph-23-jasa-lain-2pct.json      |    2 +-
 .../api/v1/entries/pph-23-jasa-lain-4pct.json      |    2 +-
 .../public/api/v1/entries/pph-23-jasa-pre2001.json |    2 +-
 .../api/v1/entries/pph-23-katering-pre2015.json    |    2 +-
 .../api/v1/entries/pph-23-sewa-tanah-bangunan.json |    2 +-
 website/public/api/v1/entries/pph-26-bunga.json    |    2 +-
 website/public/api/v1/entries/pph-26-but.json      |    2 +-
 website/public/api/v1/entries/pph-26-dividen.json  |    2 +-
 .../public/api/v1/entries/pph-26-general-2024.json |    2 +-
 .../api/v1/entries/pph-26-jasa-dan-sewa.json       |    2 +-
 website/public/api/v1/entries/pph-26-royalti.json  |    2 +-
 .../public/api/v1/entries/pph-26-tax-treaty.json   |    2 +-
 .../public/api/v1/entries/pph-badan-2022-plus.json |    2 +-
 .../public/api/v1/entries/pph-badan-go-public.json |    2 +-
 .../public/api/v1/entries/pph-badan-ikn-0pct.json  |    2 +-
 .../public/api/v1/entries/pph-badan-ikn-10y.json   |    2 +-
 .../public/api/v1/entries/pph-badan-pre2001.json   |    2 +-
 .../public/api/v1/entries/pph-badan-pre2010.json   |    2 +-
 .../public/api/v1/entries/pph-badan-pre2022.json   |    2 +-
 website/public/api/v1/entries/pph-badan-umkm.json  |    2 +-
 .../api/v1/entries/pph-final-bunga-deposito.json   |    2 +-
 .../api/v1/entries/pph-final-bunga-koperasi.json   |    2 +-
 .../api/v1/entries/pph-final-bunga-pre2009.json    |    2 +-
 .../api/v1/entries/pph-final-hadiah-undian.json    |    2 +-
 .../api/v1/entries/pph-final-investasi-lpi.json    |    2 +-
 .../api/v1/entries/pph-final-konstruksi.json       |    2 +-
 website/public/api/v1/entries/pph-final-migas.json |    2 +-
 .../api/v1/entries/pph-final-pengalihan-pp131.json |    2 +-
 .../api/v1/entries/pph-final-pengalihan-pp71.json  |    2 +-
 .../api/v1/entries/pph-final-sewa-tanah.json       |    2 +-
 .../entries/pph-final-transaksi-saham-bursa.json   |    2 +-
 .../api/v1/entries/pph-final-transportasi.json     |    2 +-
 .../public/api/v1/entries/pph-umkm-05pct-2018.json |    2 +-
 .../public/api/v1/entries/pph-umkm-05pct-2023.json |    2 +-
 .../public/api/v1/entries/pph-umkm-1pct-pp46.json  |    2 +-
 website/public/api/v1/entries/ppn-10pct.json       |    2 +-
 website/public/api/v1/entries/ppn-11pct-2022.json  |    2 +-
 .../api/v1/entries/ppn-11pct-effective-2025.json   |    2 +-
 .../api/v1/entries/ppn-dpp-penghitungan.json       |    2 +-
 website/public/api/v1/entries/ppn-ekspor-bkp.json  |    2 +-
 website/public/api/v1/entries/ppn-ekspor-jkp.json  |    2 +-
 website/public/api/v1/entries/ppn-impor-bkp.json   |    2 +-
 .../entries/ppn-jasa-kegiatan-usaha-persewaan.json |    2 +-
 .../api/v1/entries/ppn-jasa-telekomunikasi.json    |    2 +-
 .../api/v1/entries/ppn-jasa-tenaga-listrik.json    |    2 +-
 .../public/api/v1/entries/ppn-jkpt-industri.json   |    2 +-
 .../public/api/v1/entries/ppn-pengkreditan.json    |    2 +-
 website/public/api/v1/entries/ppn-pmse.json        |    2 +-
 .../api/v1/entries/ppn-tidak-kena-pajak.json       |    2 +-
 website/public/api/v1/entries/ppnbm-general.json   |    2 +-
 .../public/api/v1/entries/ppnbm-kapal-pesiar.json  |    2 +-
 .../api/v1/entries/ppnbm-perlengkapan-mewah.json   |    2 +-
 .../api/v1/entries/ppnbm-pesawat-pribadi.json      |    2 +-
 .../public/api/v1/entries/ppnbm-rumah-mewah.json   |    2 +-
 .../api/v1/entries/ppnbm-sedan-station-wagon.json  |    2 +-
 website/public/api/v1/entries/ppnbm-suv-4x4.json   |    2 +-
 website/public/api/v1/entries/ppnbm-van-wagon.json |    2 +-
 website/public/api/v1/index.json                   |    2 +-
 website/public/api/v1/openapi.json                 |  150 +-
 website/public/api/v1/regulations/index.json       |    2 +-
 .../public/api/v1/regulations/perpres-55-2013.json |    2 +-
 .../public/api/v1/regulations/pmk-122-2015.json    |    2 +-
 .../public/api/v1/regulations/pmk-131-2024.json    |    2 +-
 .../public/api/v1/regulations/pmk-138-2005.json    |    2 +-
 .../public/api/v1/regulations/pmk-141-2015.json    |    2 +-
 .../public/api/v1/regulations/pmk-162-2009.json    |    2 +-
 .../public/api/v1/regulations/pmk-168-2023.json    |    2 +-
 .../public/api/v1/regulations/pmk-202-2023.json    |    2 +-
 website/public/api/v1/regulations/pmk-43-2022.json |    2 +-
 .../public/api/v1/regulations/pmk-523-2002.json    |    2 +-
 website/public/api/v1/regulations/pp-131-2000.json |    2 +-
 website/public/api/v1/regulations/pp-14-2002.json  |    2 +-
 website/public/api/v1/regulations/pp-16-2009.json  |    2 +-
 website/public/api/v1/regulations/pp-23-2000.json  |    2 +-
 website/public/api/v1/regulations/pp-23-2018.json  |    2 +-
 website/public/api/v1/regulations/pp-28-2023.json  |    2 +-
 website/public/api/v1/regulations/pp-40-2009.json  |    2 +-
 website/public/api/v1/regulations/pp-44-2022.json  |    2 +-
 website/public/api/v1/regulations/pp-46-2013.json  |    2 +-
 website/public/api/v1/regulations/pp-51-2008.json  |    2 +-
 website/public/api/v1/regulations/pp-55-2022.json  |    2 +-
 website/public/api/v1/regulations/pp-58-2023.json  |    2 +-
 website/public/api/v1/regulations/pp-60-2023.json  |    2 +-
 website/public/api/v1/regulations/pp-71-2008.json  |    2 +-
 website/public/api/v1/regulations/pp-80-2007.json  |    2 +-
 website/public/api/v1/regulations/pp-94-2010.json  |    2 +-
 .../public/api/v1/regulations/uu-1-2022-hkpd.json  |    2 +-
 website/public/api/v1/regulations/uu-10-1994.json  |    2 +-
 website/public/api/v1/regulations/uu-10-1995.json  |    2 +-
 .../api/v1/regulations/uu-10-2020-bea-meterai.json |    2 +-
 website/public/api/v1/regulations/uu-13-1985.json  |    2 +-
 website/public/api/v1/regulations/uu-17-2000.json  |    2 +-
 website/public/api/v1/regulations/uu-28-2009.json  |    2 +-
 website/public/api/v1/regulations/uu-36-2008.json  |    2 +-
 website/public/api/v1/regulations/uu-39-2007.json  |    2 +-
 website/public/api/v1/regulations/uu-42-2009.json  |    2 +-
 .../public/api/v1/regulations/uu-7-1983-pph.json   |    2 +-
 .../public/api/v1/regulations/uu-7-2021-hpp.json   |    2 +-
 .../public/api/v1/regulations/uu-8-1983-ppn.json   |    2 +-
 website/public/api/v1/search-index.json            |    2 +-
 website/public/api/v1/stats.json                   |    4 +-
 website/public/api/v1/timeline/bea-meterai.json    |    2 +-
 website/public/api/v1/timeline/index.json          |    2 +-
 website/public/api/v1/timeline/pph-21-monthly.json |    2 +-
 .../public/api/v1/timeline/pph-21-progressive.json |    2 +-
 website/public/api/v1/timeline/pph-21-ptkp.json    |    2 +-
 website/public/api/v1/timeline/pph-23-jasa.json    |    2 +-
 website/public/api/v1/timeline/pph-badan.json      |    2 +-
 .../public/api/v1/timeline/pph-final-bunga.json    |    2 +-
 .../api/v1/timeline/pph-final-pengalihan.json      |    2 +-
 website/public/api/v1/timeline/pph-umkm.json       |    2 +-
 website/public/api/v1/timeline/ppn.json            |    2 +-
 website/public/llms.txt                            |  796 +++++++-
 449 files changed, 3289 insertions(+), 1335 deletions(-)

```

## Tracked Diff
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
index 7c38791..efc2632 100644
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
@@ -20,8 +26,15 @@
     "database"
   ],
   "license": "MIT",
+  "pnpm": {
+    "allowBuilds": {
+      "esbuild": true,
+      "sharp": true
+    }
+  },
   "devDependencies": {
     "typescript": "^5.7.0",
-    "ajv": "^8.17.0"
+    "ajv": "^8.17.0",
+    "vitest": "^3.2.4"
   }
 }
\ No newline at end of file
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

## Untracked Files
```text
.superpowers/sdd/task-1-brief.md
.superpowers/sdd/task-1-report.md
.superpowers/sdd/task-1-review-package.md
docs/superpowers/plans/2026-08-06-tarif-pajak-temporal-redesign-plan.md
docs/superpowers/specs/2026-08-06-tarif-pajak-temporal-redesign-design.md
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
src/validation/load.ts
src/validation/report.ts
tests/contracts/artifact-sync.test.ts
tests/contracts/release-metadata.test.ts
tests/unit/release.test.ts
vitest.config.ts
website/pnpm-workspace.yaml
website/public/consolidated.json
website/public/generated-manifest.json
website/public/release.json

```
