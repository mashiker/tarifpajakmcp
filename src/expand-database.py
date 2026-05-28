#!/usr/bin/env python3
"""
Comprehensive database expansion script for tarif-pajak-id.
Adds ~60+ new entries across all categories based on gap analysis.
"""

import json
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
CAT_DIR = ROOT / "data" / "categories"
REG_DIR = ROOT / "data" / "regulations"

def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

def save_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  ✅ Saved {path.name}")

# ═══════════════════════════════════════════════════════════════
# 1. PPh 21 - Add missing entries
# ═══════════════════════════════════════════════════════════════
def expand_pph21():
    print("\n📋 Expanding PPh 21...")
    data = load_json(CAT_DIR / "pph-21.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "pph-21-honorarium-bukan-pegawai",
            "category": "PPh",
            "taxType": "PPh 21",
            "transactionType": "Honorarium/Bukan Pegawai (BerNPWP)",
            "description": "Pemotongan PPh 21 atas honorarium atau imbalan kepada tenaga ahli, dokter, pengacara, akuntan, arsitek, notaris, penilai, aktuaris, dan tenaga ahli lainnya yang melakukan pekerjaan bebas (bukan pegawai). Dikenakan tarif progresif Pasal 17 UU PPh dengan norma penghitungan 50% dari penghasilan bruto sebagai penghasilan neto (PP 16/2009 Pasal 17).",
            "rate": {
                "type": "progressive",
                "value": "Progresif 5 lapis Pasal 17 UU PPh",
                "effectiveRate": "Tarif Pasal 17 × 50% norma penghitungan",
                "brackets": [
                    {"min": 0, "max": 60000000, "rate": 5},
                    {"min": 60000000, "max": 250000000, "rate": 15},
                    {"min": 250000000, "max": 500000000, "rate": 25},
                    {"min": 500000000, "max": 5000000000, "rate": 30},
                    {"min": 5000000000, "max": None, "rate": 35}
                ]
            },
            "taxBase": "50% × penghasilan bruto (norma penghitungan) dikurangi PTKP",
            "payer": "Tenaga ahli/bukan pegawai (WP OP dalam negeri)",
            "recipient": "Negara",
            "withholder": "Pemberi penghasilan",
            "effectiveFrom": "2009-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 16/2009", "article": "Pasal 17", "sourceUrl": "https://peraturan.bpk.go.id/Details/50297/pp-no-16-tahun-2009"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 17 ayat (1) huruf a"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Norma penghitungan 50% berlaku untuk tenaga ahli. Untuk pekerjaan bebas lainnya norma penghitungan bisa berbeda (misalnya: pedagang 15%, petani 25%). Pegawai tidak tetap dan bukan pegawai dengan penghasilan ≤ Rp 4.500.000/bulan: PTKP dihitung harian.",
            "examples": [
                {"scenario": "Notaris menerima honorarium Rp 100.000.000", "calculation": "Neto = 50% × 100jt = 50jt. PKP = 50jt - 54jt (PTKP) = 0", "result": "PPh 21 = Rp 0 (PKP negatif, tidak terutang)"},
                {"scenario": "Konsultan menerima honorarium Rp 200.000.000", "calculation": "Neto = 50% × 200jt = 100jt. PKP = 100jt - 54jt = 46jt. PPh = 5% × 46jt", "result": "PPh 21 = Rp 2.300.000"}
            ],
            "tags": ["pph-21", "honorarium", "bukan-pegawai", "tenaga-ahli", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-21-pegawai-tidak-tetap",
            "category": "PPh",
            "taxType": "PPh 21",
            "transactionType": "Penghasilan Pegawai Tidak Tetap / Tenaga Kerja Lepas",
            "description": "Pemotongan PPh 21 atas penghasilan pegawai tidak tetap atau tenaga kerja lepas yang menerima penghasilan secara harian, mingguan, atau satuan waktu tertentu. Jika penghasilan ≤ Rp 4.500.000/hari dan sudah kena PTKP harian, PPh = 0. Jika > Rp 4.500.000/hari, tarif Pasal 17 berlaku.",
            "rate": {
                "type": "formula",
                "value": "Tarif Pasal 17 progresif dengan PTKP harian",
                "effectiveRate": "0% jika ≤ Rp 4.500.000/hari setelah PTKP"
            },
            "taxBase": "Penghasilan bruto harian dikurangi PTKP harian (1/360 × PTKP tahunan × jumlah hari kerja)",
            "payer": "Pegawai tidak tetap / tenaga kerja lepas",
            "recipient": "Negara",
            "withholder": "Pemberi kerja",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PMK 168/2023", "article": "Pasal 8-10"},
                {"regulation": "PP 58/2023", "article": "Pasal 5"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "PTKP harian = PTKP tahunan × 1/360. Untuk penghasilan > Rp 4.500.000/hari, dipotong PPh 21 dengan tarif Pasal 17 dengan PTKP harian terkumulasi.",
            "tags": ["pph-21", "pegawai-tidak-tetap", "tenaga-kerja-lepas", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-21-shu-koperasi",
            "category": "PPh",
            "taxType": "PPh 21",
            "transactionType": "Sisa Hasil Usaha (SHU) Koperasi",
            "description": "Pemotongan PPh 21 atas Sisa Hasil Usaha (SHU) koperasi yang dibagikan kepada anggota WP Orang Pribadi. SHU yang diterima anggota koperasi diperlakukan sebagai dividen.",
            "rate": {
                "type": "percentage",
                "value": 0
            },
            "taxBase": "Jumlah SHU yang dibagikan",
            "payer": "Anggota koperasi (WP OP)",
            "recipient": "Negara",
            "withholder": "Koperasi",
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 4 ayat (3) huruf f"},
                {"regulation": "PP 60/2023", "article": "Pasal 6"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "SHU koperasi yang dibayarkan kepada anggota WP OP dikenakan PPh final 0% (bebas pajak). Fasilitas ini diberikan untuk mendukung perkembangan koperasi.",
            "tags": ["pph-21", "shu", "koperasi", "tarif-nol", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-21-natura-kenikmatan",
            "category": "PPh",
            "taxType": "PPh 21",
            "transactionType": "Natura/Kenikmatan dari Pemberi Kerja",
            "description": "Pajak atas pemberian natura (barang) atau kenikmatan dari pemberi kerja kepada pegawai. Mulai 2024, pemberian natura/kenikmatan yang diberikan bukan oleh pemberi kerja (bukan BP) menjadi objek PPh 21 yang dipotong oleh penerima penghasilan.",
            "rate": {
                "type": "percentage",
                "value": 1
            },
            "taxBase": "Nilai wajar natura/kenikmatan",
            "payer": "Penerima natura/kenikmatan",
            "recipient": "Negara",
            "withholder": "Pemberi kerja",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 21 ayat (1) huruf b"},
                {"regulation": "PMK 168/2023", "article": "Pasal 12"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Natura/kenikmatan dari pemberi kerja (BP) yang diberikan kepada pegawai: PPh ditanggung pemberi kerja (gross-up) atau dihitung dari nilai wajar. Natura dari bukan BP: 1% dari nilai wajar sebagai PPh yang dipotong sendiri oleh penerima.",
            "tags": ["pph-21", "natura", "kenikmatan", "benefit-in-kind", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-21-dana-pensiun",
            "category": "PPh",
            "taxType": "PPh 21",
            "transactionType": "Penarikan Dana Pensiun / JHT",
            "description": "Pemotongan PPh 21 atas penarikan iuran pensiun/jaminan hari tua (JHT) yang dibayarkan sekaligus. Tarif PPh final berjenjang berdasarkan akumulasi iuran.",
            "rate": {
                "type": "progressive",
                "value": "Tarif final berjenjang",
                "brackets": [
                    {"min": 0, "max": 50000000, "rate": 0},
                    {"min": 50000000, "max": 100000000, "rate": 5},
                    {"min": 100000000, "max": 500000000, "rate": 10},
                    {"min": 500000000, "max": None, "rate": 15}
                ]
            },
            "taxBase": "Akumulasi iuran pensiun/JHT yang ditarik",
            "payer": "Peserta pensiun/JHT",
            "recipient": "Negara",
            "withholder": "Dana pensiun/BPJS Ketenagakerjaan",
            "effectiveFrom": "2014-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 58/2023", "article": "Pasal 14"},
                {"regulation": "PMK 168/2023", "article": "Pasal 15"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif berjenjang final: ≤50jt = 0%, 50-100jt = 5%, 100-500jt = 10%, >500jt = 15%. Berlaku untuk penarikan yang dibayarkan sekaligus. Penarikan anuitas/bulanan: digabung dengan penghasilan rutin (bukan final).",
            "examples": [
                {"scenario": "Penarikan JHT Rp 80.000.000 sekaligus", "calculation": "50jt × 0% + 30jt × 5%", "result": "PPh 21 = Rp 1.500.000"}
            ],
            "tags": ["pph-21", "pensiun", "jht", "dana-pensiun", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-21-progressive-pre2009",
            "category": "PPh",
            "taxType": "PPh 21",
            "transactionType": "Tarif Progresif Pra-2009",
            "description": "Tarif progresif PPh OP sebelum UU 36/2008 berlaku. Tarif tertinggi 35% untuk bracket > Rp 250 juta.",
            "rate": {
                "type": "progressive",
                "value": "Progresif 4 lapis",
                "brackets": [
                    {"min": 0, "max": 25000000, "rate": 5},
                    {"min": 25000000, "max": 50000000, "rate": 10},
                    {"min": 50000000, "max": 100000000, "rate": 15},
                    {"min": 100000000, "max": 200000000, "rate": 25},
                    {"min": 200000000, "max": None, "rate": 35}
                ]
            },
            "taxBase": "Penghasilan Kena Pajak",
            "payer": "WP Orang Pribadi dalam negeri",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2001-01-01",
            "effectiveTo": "2008-12-31",
            "status": "diubah",
            "legalBasis": [
                {"regulation": "UU 17/2000", "article": "Pasal 17 ayat (1) huruf a"}
            ],
            "supersedes": ["pph-21-progressive-pre2001"],
            "supersededBy": ["pph-21-progressive-pre2022"],
            "notes": "Tarif progresif UU 17/2000 dengan lapisan 5%, 10%, 15%, 25%, 35%.",
            "tags": ["pph-21", "progresif", "historis", "uu-17-2000"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "pph-21.json", data)


# ═══════════════════════════════════════════════════════════════
# 2. PPh 22 - Expand with more details
# ═══════════════════════════════════════════════════════════════
def expand_pph22():
    print("\n📋 Expanding PPh 22...")
    data = load_json(CAT_DIR / "pph-22.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "pph-22-impor-api-produsen",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Impor Barang (API Produsen)",
            "description": "Pemungutan PPh 22 atas impor barang yang dilakukan importir yang memiliki Angka Pengenal Importir (API) produsen untuk keperluan industri/produksi.",
            "rate": {"type": "percentage", "value": 2.5},
            "taxBase": "Nilai impor (harga pabrik + pungutan impor + PPN)",
            "payer": "Importir (pemilik API produsen)",
            "recipient": "Negara",
            "withholder": "Direktorat Jenderal Bea dan Cukai",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 2 ayat (1)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 2,5% untuk impor dengan API produsen. Berbeda dari non-API/API umum yang dikenakan 7,5%.",
            "tags": ["pph-22", "impor", "api-produsen", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-200-01", "nama": "Pemungutan PPh Pasal 22 atas Impor yang menggunakan API (Angka Pengenal Importir) - Produsen", "tarif": 2.5},
                {"kode": "22-200-02", "nama": "Pemungutan PPh Pasal 22 atas Impor yang menggunakan API (Angka Pengenal Importir) - Umum", "tarif": 7.5}
            ]
        },
        {
            "id": "pph-22-bendaharawan",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Pemungutan oleh Bendaharawan Pemerintah",
            "description": "Pemungutan PPh 22 oleh bendaharawan pemerintah atas pembelian barang dan jasa untuk keperluan instansi pemerintah.",
            "rate": {"type": "percentage", "value": 1.5},
            "taxBase": "Jumlah bruto pembelian (DPP)",
            "payer": "Penyedia barang/jasa",
            "recipient": "Negara",
            "withholder": "Bendaharawan pemerintah",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 3 ayat (1)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 1,5% untuk pembelian oleh bendaharawan pemerintah. Untuk pembelian < Rp 2.000.000 tidak dipotong. Tanpa NPWP: 1,5% × 2 = 3%.",
            "tags": ["pph-22", "bendaharawan", "pemerintah", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-910-01", "nama": "Pemungutan oleh Bendaharawan", "tarif": 1.5}
            ]
        },
        {
            "id": "pph-22-ekspor-batubara",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Ekspor Batubara dan Mineral",
            "description": "Pemungutan PPh 22 atas ekspor komoditas tambang batubara, mineral logam, dan mineral bukan logam oleh eksportir selain WP yang terikat dalam PKP2B dan KK.",
            "rate": {"type": "percentage", "value": 1.5},
            "taxBase": "Nilai ekspor bruto (FOB)",
            "payer": "Eksportir batubara/mineral",
            "recipient": "Negara",
            "withholder": "Direktorat Jenderal Bea dan Cukai",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 2 ayat (2)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 1,5% atas nilai ekspor batubara dan mineral. Untuk WP yang terikat PKP2B (Perjanjian Kerja Sama Pengusahaan Pertambangan Batubara) dan KK (Kontrak Karya) tidak dipungut PPh 22.",
            "tags": ["pph-22", "ekspor", "batubara", "mineral", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-404-01", "nama": "Ekspor Komoditas Tambang Batubara, Mineral Logam, dan Mineral Bukan Logam yang Dilakukan Oleh Eksportir, Kecuali WP yang Terikat dalam PKP2B dan KK", "tarif": 1.5}
            ]
        },
        {
            "id": "pph-22-bumn-pembelian",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Pembelian oleh BUMN/Badan Usaha Tertentu",
            "description": "Pemungutan PPh 22 atas pembayaran atas pembelian barang dan/atau bahan untuk kegiatan usahanya oleh BUMN/Badan Usaha tertentu.",
            "rate": {"type": "percentage", "value": 1.5},
            "taxBase": "Jumlah bruto pembelian (DPP)",
            "payer": "Penyedia barang/bahan",
            "recipient": "Negara",
            "withholder": "BUMN/Badan usaha tertentu",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 3 ayat (2)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 1,5% atas pembelian oleh BUMN/badan usaha tertentu. Untuk pembelian < Rp 2.000.000 tidak dipotong. Tanpa NPWP: 1,5% × 2 = 3%.",
            "tags": ["pph-22", "bumn", "pembelian", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-900-01", "nama": "Pembayaran atas Pembelian Barang dan/atau Bahan untuk Kegiatan Usahanya oleh BUMN/Badan Usaha Tertentu", "tarif": 1.5}
            ]
        },
        {
            "id": "pph-22-pengadaan-pemerintah",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Pengadaan melalui Sistem Informasi Pengadaan Pemerintah",
            "description": "Pemungutan PPh 22 atas penghasilan sehubungan dengan transaksi penjualan barang, penyerahan jasa, dan/atau persewaan yang dilakukan melalui pihak lain dalam sistem informasi pengadaan pemerintah (e-procurement).",
            "rate": {"type": "percentage", "value": 0.5},
            "taxBase": "Jumlah bruto pembayaran",
            "payer": "Penyedia barang/jasa",
            "recipient": "Negara",
            "withholder": "Pihak penyelenggara sistem pengadaan pemerintah",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 4 ayat (1)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 0,5% atas transaksi melalui sistem informasi pengadaan pemerintah. Kode 22-101-01 (tidak final), 22-101-02 (final).",
            "tags": ["pph-22", "pengadaan", "pemerintah", "e-procurement", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-101-01", "nama": "Penghasilan Sehubungan dengan Transaksi Penjualan Barang, Penyerahan Jasa, dan/atau Persewaan serta Penghasilan Lain Sehubungan dengan Penggunaan Harta yang Dilakukan Melalui Pihak Lain dalam Sistem Informasi Pengadaan Pemerintah (Tidak Final)", "tarif": 0.5},
                {"kode": "22-101-02", "nama": "Penghasilan Sehubungan dengan Transaksi Penjualan Barang, Penyerahan Jasa, dan/atau Persewaan serta Penghasilan Lain Sehubungan dengan Penggunaan Harta yang Dilakukan Melalui Pihak Lain dalam Sistem Informasi Pengadaan Pemerintah (Final)", "tarif": 0.5}
            ]
        },
        {
            "id": "pph-22-pmse",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Penjualan melalui Perdagangan Melalui Sistem Elektronik (PMSE/E-Commerce)",
            "description": "Pemungutan PPh 22 atas penghasilan yang diterima pedagang dalam negeri dari penjualan barang, penyerahan jasa, dan/atau persewaan melalui perdagangan melalui sistem elektronik (PMSE).",
            "rate": {"type": "percentage", "value": 0.5},
            "taxBase": "Jumlah bruto nilai transaksi",
            "payer": "Pedagang dalam negeri",
            "recipient": "Negara",
            "withholder": "Penyelenggara PMSE (marketplace/e-commerce)",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 4 ayat (2)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 0,5% atas transaksi melalui PMSE. Kode 22-102-01 (tidak final), 22-102-02 (final). Berlaku untuk marketplace/e-commerce yang ditunjuk sebagai pemungut.",
            "tags": ["pph-22", "pmse", "e-commerce", "marketplace", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-102-01", "nama": "Penghasilan yang Diterima atau Diperoleh Pedagang Dalam Negeri Penjualan Barang, Penyerahan Jasa, dan/atau Persewaan serta Penghasilan Lain Sehubungan dengan Penggunaan Harta yang Dilakukan Melalui Perdagangan Melalui Sistem Elektronik (Tidak Final)", "tarif": 0.5},
                {"kode": "22-102-02", "nama": "Penghasilan yang Diterima atau Diperoleh Pedagang Dalam Negeri Penjualan Barang, Penyerahan Jasa, dan/atau Persewaan serta Penghasilan Lain Sehubungan dengan Penggunaan Harta yang Dilakukan Melalui Perdagangan Melalui Sistem Elektronik (Final)", "tarif": 0.5}
            ]
        },
        {
            "id": "pph-22-kripto",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Transaksi Aset Kripto",
            "description": "Pemungutan PPh 22 atas penghasilan sehubungan dengan aset kripto yang dipungut oleh penyelenggara perdagangan melalui sistem elektronik.",
            "rate": {"type": "range", "value": [0.1, 0.2]},
            "taxBase": "Nilai transaksi penjualan aset kripto",
            "payer": "Pedagang/pemilik aset kripto",
            "recipient": "Negara",
            "withholder": "Penyelenggara perdagangan kripto (exchange)",
            "effectiveFrom": "2024-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "PP 60/2023", "article": "Pasal 4 ayat (3)"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 22"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Pedagang fisik aset kripto: 0,1%. Bukan pedagang fisik: 0,2%.",
            "tags": ["pph-22", "kripto", "crypto", "final", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "22-405-01", "nama": "Penghasilan Sehubungan dengan Aset Kripto yang dipungut oleh Penyelenggara Perdagangan Melalui Sistem Elektronik yang Merupakan Pedagang Fisik Aset Kripto", "tarif": 0.1},
                {"kode": "22-405-02", "nama": "Penghasilan Sehubungan dengan Aset Kripto yang dipungut oleh Penyelenggara Perdagangan Melalui Sistem Elektronik yang Bukan Merupakan Pedagang Fisik Aset Kripto", "tarif": 0.2}
            ]
        },
        {
            "id": "pph-22-pre2024",
            "category": "PPh",
            "taxType": "PPh 22",
            "transactionType": "Tarif PPh 22 Pra-PP 60/2023",
            "description": "Tarif PPh 22 sebelum PP 60/2023 berlaku, masih berdasarkan PP 94/2010 dan KMK 523/2002.",
            "rate": {"type": "range", "value": [0.25, 7.5]},
            "taxBase": "Sesuai jenis transaksi",
            "payer": "Sesuai jenis transaksi",
            "recipient": "Negara",
            "withholder": "Sesuai jenis transaksi",
            "effectiveFrom": "2010-01-01",
            "effectiveTo": "2023-12-31",
            "status": "diubah",
            "legalBasis": [
                {"regulation": "PP 94/2010", "article": "Pasal 2-4"},
                {"regulation": "UU 36/2008", "article": "Pasal 22"}
            ],
            "supersedes": ["pph-22-pre2010"],
            "supersededBy": ["pph-22-impor-2024", "pph-22-penjualan-barang-2024"],
            "notes": "Tarif pra-PP 60/2023: Impor non-API 7,5%, API produsen 2,5%, API umum 7,5%. Penjualan BBM 0,5%. Pembelian bahan industri 0,25%. Bendaharawan 1,5%.",
            "tags": ["pph-22", "historis", "pp-94-2010"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "pph-22.json", data)


# ═══════════════════════════════════════════════════════════════
# 3. PPh 26 - Expand with detail entries
# ═══════════════════════════════════════════════════════════════
def expand_pph26():
    print("\n📋 Expanding PPh 26...")
    data = load_json(CAT_DIR / "pph-26.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "pph-26-dividen",
            "category": "PPh",
            "taxType": "PPh 26",
            "transactionType": "Dividen WP Luar Negeri",
            "description": "Pemotongan PPh 26 atas dividen yang dibayarkan kepada WP luar negeri. Tarif umum 20% dari jumlah bruto, namun dapat lebih rendah berdasarkan P3B (tax treaty).",
            "rate": {"type": "percentage", "value": 20},
            "taxBase": "Jumlah bruto dividen",
            "payer": "WP luar negeri penerima dividen",
            "recipient": "Negara",
            "withholder": "WP badan dalam negeri yang membagikan dividen",
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 26 ayat (1) huruf a"},
                {"regulation": "PP 60/2023", "article": "Pasal 5"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif P3B bervariasi: Singapura 15%, Jepang 15%, Belanda 10%, Mauritius 10%, dll. Tarif dapat lebih rendah jika WP luar negeri memenuhi syarat beneficial owner dan menyertakan Certificate of Residence (CoR).",
            "tags": ["pph-26", "dividen", "wp-luar-negeri", "tax-treaty", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "24-101-01", "nama": "Dividen", "tarif": 15.0}
            ]
        },
        {
            "id": "pph-26-bunga",
            "category": "PPh",
            "taxType": "PPh 26",
            "transactionType": "Bunga WP Luar Negeri",
            "description": "Pemotongan PPh 26 atas bunga yang dibayarkan kepada WP luar negeri selain yang telah dikenakan PPh 4(2).",
            "rate": {"type": "percentage", "value": 20},
            "taxBase": "Jumlah bruto bunga",
            "payer": "WP luar negeri penerima bunga",
            "recipient": "Negara",
            "withholder": "WP dalam negeri/BUT yang membayar bunga",
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 26 ayat (1) huruf b"},
                {"regulation": "PP 60/2023", "article": "Pasal 5"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif P3B bervariasi untuk bunga: Singapura 15%, Jepang 10%, Belanda 10%, Hong Kong 10%. Bunga pinjaman luar negeri tertentu dapat dibebaskan berdasarkan P3B.",
            "tags": ["pph-26", "bunga", "wp-luar-negeri", "tax-treaty", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "24-102-01", "nama": "Bunga Selain yang Dikenakan PPh Pasal 4 ayat (2)", "tarif": 15.0}
            ]
        },
        {
            "id": "pph-26-royalti",
            "category": "PPh",
            "taxType": "PPh 26",
            "transactionType": "Royalti WP Luar Negeri",
            "description": "Pemotongan PPh 26 atas royalti yang dibayarkan kepada WP luar negeri.",
            "rate": {"type": "percentage", "value": 20},
            "taxBase": "Jumlah bruto royalti",
            "payer": "WP luar negeri penerima royalti",
            "recipient": "Negara",
            "withholder": "WP dalam negeri/BUT yang membayar royalti",
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 26 ayat (1) huruf c"},
                {"regulation": "PP 60/2023", "article": "Pasal 5"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif P3B bervariasi untuk royalti: Singapura 15%, Jepang 10%, Belanda 10%, Amerika 10%. Definisi royalti mencakup penggunaan hak cipta, paten, merek dagang, dll.",
            "tags": ["pph-26", "royalti", "wp-luar-negeri", "tax-treaty", "berlaku"],
            "lastVerified": "2026-05-27",
            "bppuKode": [
                {"kode": "24-103-01", "nama": "Royalti", "tarif": 15.0}
            ]
        },
        {
            "id": "pph-26-jasa-dan-sewa",
            "category": "PPh",
            "taxType": "PPh 26",
            "transactionType": "Imbalan Jasa dan Sewa WP Luar Negeri",
            "description": "Pemotongan PPh 26 atas imbalan sehubungan dengan jasa dan sewa yang dibayarkan kepada WP luar negeri yang tidak melakukan kegiatan usaha melalui BUT di Indonesia.",
            "rate": {"type": "percentage", "value": 20},
            "taxBase": "Jumlah bruto imbalan jasa/sewa",
            "payer": "WP luar negeri penerima imbalan",
            "recipient": "Negara",
            "withholder": "WP dalam negeri/BUT yang membayar imbalan",
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 26 ayat (2)"},
                {"regulation": "PP 60/2023", "article": "Pasal 5"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 20% dari jumlah bruto. Jika WP luar negeri memiliki BUT di Indonesia, penghasilan yang diterima melalui BUT dikenakan PPh sesuai tarif umum (Pasal 17), bukan PPh 26.",
            "tags": ["pph-26", "jasa", "sewa", "wp-luar-negeri", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-26-but",
            "category": "PPh",
            "taxType": "PPh 26",
            "transactionType": "Penghasilan BUT (Bentuk Usaha Tetap)",
            "description": "Pemotongan PPh atas penghasilan yang diterima atau diperoleh BUT dari WP luar negeri. BUT diperlakukan sebagai WP dalam negeri dan dikenakan tarif Pasal 17 ditambah pajak cabang (branch profit tax) 20%.",
            "rate": {
                "type": "progressive",
                "value": "Tarif Pasal 17 + Branch Profit Tax 20%",
                "brackets": [
                    {"min": 0, "max": 50000000, "rate": 5},
                    {"min": 50000000, "max": 250000000, "rate": 15},
                    {"min": 250000000, "max": 500000000, "rate": 25},
                    {"min": 500000000, "max": None, "rate": 30}
                ]
            },
            "taxBase": "PKP BUT + laba setelah pajak (untuk branch profit tax)",
            "payer": "BUT (perusahaan luar negeri yang beroperasi di Indonesia)",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 20 ayat (1)"},
                {"regulation": "PP 60/2023", "article": "Pasal 5 ayat (3)"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "BUT dikenakan PPh normal (Pasal 17) atas laba usaha + Branch Profit Tax 20% atas laba setelah pajak yang dikirim ke kantor pusat. Beberapa P3B mengurangi atau menghapus branch profit tax.",
            "tags": ["pph-26", "but", "branch-profit-tax", "berlaku"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "pph-26.json", data)


# ═══════════════════════════════════════════════════════════════
# 4. PPh Badan - Add go-public and MSME rates
# ═══════════════════════════════════════════════════════════════
def expand_pph_badan():
    print("\n📋 Expanding PPh Badan...")
    data = load_json(CAT_DIR / "pph-badan.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "pph-badan-go-public",
            "category": "PPh",
            "taxType": "PPh Badan",
            "transactionType": "Penghasilan Kena Pajak Badan Go-Public ( Listed di Bursa Efek)",
            "description": "Tarif PPh badan 20% untuk WP badan yang sahamnya diperdagangkan di bursa efek dan memenuhi syarat tertentu sesuai Pasal 17 ayat (1) huruf b angka 2 UU HPP.",
            "rate": {"type": "percentage", "value": 20},
            "taxBase": "Penghasilan Kena Pajak (PKP) badan",
            "payer": "WP Badan go-public (listed)",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 17 ayat (1) huruf b angka 2", "sourceUrl": "https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Syarat: saham diperdagangkan di bursa efek dan memenuhi persyaratan peraturan perundang-undangan di bidang pasar modal serta memenuhi syarat perbandingan antara saham yang dimiliki oleh pihak yang bukan pemegang saham pengendali dengan jumlah seluruh saham yang diserahkan.",
            "tags": ["pph-badan", "go-public", "listed", "tarif-khusus", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-badan-umkm",
            "category": "PPh",
            "taxType": "PPh Badan",
            "transactionType": "Penghasilan Kena Pajak Badan UMKM (Peredaran Bruto ≤ Rp 50 miliar)",
            "description": "Tarif PPh badan dikurangi sebesar 50% dari tarif normal (22% × 50% = 11%) untuk WP badan yang menerima peredaran bruto ≤ Rp 50 miliar. Fasilitas ini diberikan berdasarkan UU HPP Pasal 17 ayat (2).",
            "rate": {"type": "percentage", "value": 11},
            "taxBase": "Penghasilan Kena Pajak (PKP) badan",
            "payer": "WP Badan UMKM (peredaran bruto ≤ Rp 50 miliar)",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2022-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 17 ayat (2)", "sourceUrl": "https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Penurunan tarif 50% berlaku untuk WP badan yang menerima peredaran bruto dari usaha ≤ Rp 50 miliar dalam tahun pajak sebelumnya. Tarif efektif = 22% × 50% = 11%.",
            "tags": ["pph-badan", "umkm", "tarif-dikurangi", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "pph-badan-pre2010",
            "category": "PPh",
            "taxType": "PPh Badan",
            "transactionType": "Penghasilan Kena Pajak Badan (Pra-2010)",
            "description": "Tarif PPh badan 28% berdasarkan UU 17/2000 yang berlaku sebelum UU 36/2008.",
            "rate": {"type": "percentage", "value": 28},
            "taxBase": "Penghasilan Kena Pajak (PKP) badan",
            "payer": "WP Badan dalam negeri / BUT",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2001-01-01",
            "effectiveTo": "2009-12-31",
            "status": "diubah",
            "legalBasis": [
                {"regulation": "UU 17/2000", "article": "Pasal 17 ayat (1) huruf b"}
            ],
            "supersedes": ["pph-badan-pre2001"],
            "supersededBy": ["pph-badan-pre2022"],
            "notes": "Tarif PPh badan 28% berdasarkan UU 17/2000. Go-public: 22%.",
            "tags": ["pph-badan", "tarif-flat", "historis", "uu-17-2000"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "pph-badan.json", data)


# ═══════════════════════════════════════════════════════════════
# 5. PPN - Expand with PMSE, impor, JKP details
# ═══════════════════════════════════════════════════════════════
def expand_ppn():
    print("\n📋 Expanding PPN...")
    data = load_json(CAT_DIR / "ppn.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "ppn-impor-bkp",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "Impor Barang Kena Pajak",
            "description": "PPN atas impor Barang Kena Pajak Berwujud yang dikenakan dan dipungut bersamaan dengan pemungutan Bea Masuk, Cukai, dan pungutan lainnya oleh Direktorat Jenderal Bea dan Cukai.",
            "rate": {"type": "percentage", "value": 11, "effectiveRate": "11% (PMK 131/2024)"},
            "taxBase": "Nilai pabean + Bea Masuk + pungutan lain (CIF + BM + Cukai)",
            "payer": "Importir",
            "recipient": "Negara",
            "withholder": "Direktorat Jenderal Bea dan Cukai",
            "effectiveFrom": "2025-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 7 ayat (1)"},
                {"regulation": "UU 42/2009", "article": "Pasal 8"},
                {"regulation": "PMK 131/2024", "article": "Pasal 2"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "PPN impor = tarif PPN × (Nilai CIF + BM + Cukai). Tidak ada pemisahan PPN-in dan PPN-out seperti pada penyerahan domestik.",
            "examples": [
                {"scenario": "Impor barang CIF USD 10.000 (Rp 160.000.000), BM 10%, PPN 11%", "calculation": "BM = 10% × 160jt = 16jt. DPP = 160jt + 16jt = 176jt. PPN = 11% × 176jt", "result": "PPN Impor = Rp 19.360.000"}
            ],
            "tags": ["ppn", "impor", "bkp", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppn-pmse",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "Penyerahan melalui Perdagangan Melalui Sistem Elektronik (PMSE)",
            "description": "PPN atas penyerahan BKP dan/atau JKP melalui PMSE (e-commerce/marketplace) baik dari pedagang dalam negeri maupun luar negeri. Penyelenggara PMSE bertindak sebagai pemungut PPN.",
            "rate": {"type": "percentage", "value": 11, "effectiveRate": "11% (PMK 131/2024)"},
            "taxBase": "Harga jual/penggantian yang disepakati (DPP)",
            "payer": "Konsumen",
            "recipient": "Negara",
            "withholder": "Penyelenggara PMSE (marketplace)",
            "effectiveFrom": "2025-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 4 ayat (3)"},
                {"regulation": "PP 44/2022", "article": "Pasal 2-5"},
                {"regulation": "PMK 131/2024", "article": "Pasal 2"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "PPN PMSE dipungut oleh penyelenggara (Shopee, Tokopedia, dll). PMSE luar negeri (Amazon, dll) wajib mendaftar sebagai PKP dan memungut PPN. DPP untuk BKP melalui PMSE = harga jual yang disepakati.",
            "tags": ["ppn", "pmse", "e-commerce", "marketplace", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppn-jasa-tenaga-listrik",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "Penyerahan Jasa Tenaga Listrik",
            "description": "PPN atas penyerahan jasa tenaga listrik oleh PLN atau penyedia listrik lainnya.",
            "rate": {"type": "percentage", "value": 11, "effectiveRate": "11% (PMK 131/2024)"},
            "taxBase": "Harga jual tenaga listrik",
            "payer": "Konsumen listrik",
            "recipient": "Negara",
            "withholder": "PLN / penyedia listrik",
            "effectiveFrom": "2025-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 4 ayat (1)"},
                {"regulation": "PMK 131/2024", "article": "Pasal 2"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Penyerahan jasa tenaga listrik di atas 6.600 VA (rumah tangga) dikenakan PPN. Di bawah 6.600 VA: tidak dipungut PPN (subtansi bukan JKP).",
            "tags": ["ppn", "listrik", "pln", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppn-jasa-telekomunikasi",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "Penyerahan Jasa Telekomunikasi",
            "description": "PPN atas penyerahan jasa telekomunikasi (pulsa, data, telepon) oleh operator telekomunikasi.",
            "rate": {"type": "percentage", "value": 11, "effectiveRate": "11% (PMK 131/2024)"},
            "taxBase": "Harga jual/penggantian jasa telekomunikasi",
            "payer": "Pengguna jasa telekomunikasi",
            "recipient": "Negara",
            "withholder": "Operator telekomunikasi (PKP)",
            "effectiveFrom": "2025-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 4 ayat (1)"},
                {"regulation": "PMK 131/2024", "article": "Pasal 2"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Penyerahan jasa telekomunikasi termasuk jasa kena pajak. Penjualan pulsa dan kartu perdana melalui distributor: PPN dipungut oleh distributor tingkat pertama.",
            "tags": ["ppn", "telekomunikasi", "pulsa", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppn-ekspor-jkp",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "Ekspor Jasa Kena Pajak",
            "description": "PPN atas ekspor Jasa Kena Pajak berupa jasa yang dilakukan di Indonesia yang manfaatnya digunakan di luar Indonesia. Dikenakan tarif 0%.",
            "rate": {"type": "percentage", "value": 0},
            "taxBase": "Nilai penggantian/imbalan jasa",
            "payer": "Eksportir jasa (PKP)",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 7 ayat (2)"},
                {"regulation": "UU 42/2009", "article": "Pasal 7 ayat (2)"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 0% untuk ekspor JKP. Syarat: jasa dilakukan di Indonesia dan manfaatnya digunakan di luar Indonesia. Termasuk jasa konstruksi, jasa konsultansi, dll yang dikonsumsi di luar negeri.",
            "tags": ["ppn", "ekspor", "jkp", "tarif-nol", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppn-tidak-kena-pajak",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "Barang/Jasa Tidak Kena Pajak (Bukan JKP/BKP)",
            "description": "Daftar barang dan jasa yang tidak termasuk Barang Kena Pajak dan Jasa Kena Pajak sehingga tidak dikenakan PPN. Diatur dalam Pasal 4A UU PPN.",
            "rate": {"type": "percentage", "value": 0},
            "taxBase": "Tidak ada (bukan objek PPN)",
            "payer": "-",
            "recipient": "-",
            "withholder": None,
            "effectiveFrom": "2010-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 42/2009", "article": "Pasal 4A"},
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 4A"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Bukan BKP: hasil pertambangan/panas bumi sebelum diolah, kebutuhan pokok (beras, gabah, jagung, sagu, kedelai), makanan/minuman disajikan (restoran), uang, emas batangan, surat berharga. Bukan JKP: jasa keagamaan, jasa kesenian/hiburan, jasa perhotelan (room), jasa pelayanan kesehatan, jasa pendidikan, dll.",
            "tags": ["ppn", "tidak-kena-pajak", "exempt", "nontaxable", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppn-jkpt-industri",
            "category": "PPN",
            "taxType": "PPN",
            "transactionType": "PPN Tidak Dipungut (JKPT) Industri Strategis",
            "description": "Pembebasan PPN (JKPT/Pajak Tidak Dipungut) untuk penyerahan BKP strategis tertentu yang dibeli oleh pengusaha yang mendapat fasilitas. Fasilitas PPN tidak dipungut diberikan melalui PMK.",
            "rate": {"type": "percentage", "value": 0},
            "taxBase": "Harga jual BKP (PPN tidak dipungut)",
            "payer": "Pembeli BKP (penerima fasilitas)",
            "recipient": "Negara",
            "withholder": "PKP penjual (tidak memungut PPN)",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 16B"},
                {"regulation": "UU 42/2009", "article": "Pasal 16B"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Fasilitas PPN tidak dipungut diberikan antara lain untuk: mesin dan peralatan industri tertentu, kapal, pesawat, kereta api, BKP untuk keperluan pendidikan/penelitian, BKP untuk perwakilan diplomatik, dll.",
            "tags": ["ppn", "fasilitas", "jkpt", "tidak-dipungut", "berlaku"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "ppn.json", data)


# ═══════════════════════════════════════════════════════════════
# 6. PPnBM - Expand with detail per kelompok
# ═══════════════════════════════════════════════════════════════
def expand_ppnbm():
    print("\n📋 Expanding PPnBM...")
    data = load_json(CAT_DIR / "ppnbm.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "ppnbm-sedan-station-wagon",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Sedan dan Station Wagon 4x2",
            "description": "PPnBM atas penyerahan sedan dan station wagon dengan sistem penggerak 4x2. Tarif bervariasi berdasarkan kapasitas silinder.",
            "rate": {"type": "range", "value": [10, 40]},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual/ATPM",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"},
                {"regulation": "UU 42/2009", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif berdasarkan cc: ≤1.500cc = 10%, 1.500-2.500cc = 20%, 2.500-3.000cc = 30%, 3.000-4.000cc = 40%, >4.000cc = 40%.",
            "tags": ["ppnbm", "sedan", "station-wagon", "kendaraan", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppnbm-suv-4x4",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Sedan dan Station Wagon 4x4 / SUV",
            "description": "PPnBM atas penyerahan sedan, station wagon, dan SUV dengan sistem penggerak 4x4.",
            "rate": {"type": "range", "value": [10, 75]},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual/ATPM",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"},
                {"regulation": "UU 42/2009", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif lebih tinggi dari 4x2. ≤1.500cc = 10%, 1.500-2.500cc = 30%, 2.500-3.000cc = 50%, 3.000-4.000cc = 75%, >4.000cc = 75%.",
            "tags": ["ppnbm", "suv", "4x4", "kendaraan", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppnbm-van-wagon",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Van/Wagon > 10 Penumpang",
            "description": "PPnBM atas penyerahan van dan wagon dengan kapasitas lebih dari 10 penumpang.",
            "rate": {"type": "percentage", "value": 10},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual/ATPM",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif tetap 10% untuk van dan wagon > 10 penumpang.",
            "tags": ["ppnbm", "van", "minibus", "kendaraan", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppnbm-kapal-pesiar",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Kapal Pesiar dan Kapal Mewah",
            "description": "PPnBM atas penyerahan kapal pesiar, kapal pesiar pribadi, dan kapal layar mewah yang panjangnya > 15 meter.",
            "rate": {"type": "range", "value": [10, 50]},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 10-50% tergantung jenis dan ukuran kapal pesiar.",
            "tags": ["ppnbm", "kapal", "pesiar", "mewah", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppnbm-pesawat-pribadi",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Pesawat Udara Pribadi",
            "description": "PPnBM atas penyerahan pesawat udara pribadi yang tidak digunakan untuk penerbangan komersial.",
            "rate": {"type": "range", "value": [10, 50]},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 10-50% tergantung jenis pesawat. Tidak termasuk pesawat udara untuk angkutan umum.",
            "tags": ["ppnbm", "pesawat", "pribadi", "mewah", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppnbm-rumah-mewah",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Rumah Mewah dan Apartemen Mewah",
            "description": "PPnBM atas penyerahan rumah mewah, apartemen mewah, dan kondominium mewah yang luas bangunan > 350 m² dan harga jual > Rp 5 miliar.",
            "rate": {"type": "range", "value": [10, 40]},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual/developer",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Kategori rumah mewah: tipe 350 m² dan yang tergolong sangat mewah. Tarif 10-40%.",
            "tags": ["ppnbm", "rumah", "apartemen", "properti-mewah", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "ppnbm-perlengkapan-mewah",
            "category": "PPnBM",
            "taxType": "PPnBM",
            "transactionType": "Perlengkapan Mewah",
            "description": "PPnBM atas penyerahan perlengkapan mewah seperti perhiasan, batu permata, keramik mewah, lukisan, dan barang seni.",
            "rate": {"type": "range", "value": [10, 200]},
            "taxBase": "DPP (Harga Jual/Penggantian)",
            "payer": "Pembeli konsumen",
            "recipient": "Negara",
            "withholder": "PKP penjual",
            "effectiveFrom": "2022-04-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 8"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Tarif 10-200% untuk perlengkapan mewah. Perhiasan dan batu permata dikenakan tarif 10%. Senjata api dan amunisi non-tentara/sipil: 10-200%.",
            "tags": ["ppnbm", "perlengkapan", "mewah", "perhiasan", "berlaku"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "ppnbm.json", data)


# ═══════════════════════════════════════════════════════════════
# 7. Bea Meterai - Expand with more detail
# ═══════════════════════════════════════════════════════════════
def expand_bea_meterai():
    print("\n📋 Expanding Bea Meterai...")
    data = load_json(CAT_DIR / "bea-meterai.json")
    existing_ids = {e["id"] for e in data["entries"]}

    new_entries = [
        {
            "id": "bea-meterai-cek-bilyet",
            "category": "Bea Meterai",
            "taxType": "Bea Meterai",
            "transactionType": "Cek dan Bilyet Giro",
            "description": "Bea meterai atas cek dan bilyet giro yang diterima sebagai alat pembayaran atau pemindahan uang.",
            "rate": {"type": "formula", "value": "Rp 10.000 per lembar"},
            "taxBase": "Setiap lembar cek/bilyet giro",
            "payer": "Pihak yang menandatangani / mengeluarkan cek/bilyet giro",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2021-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 10/2020", "article": "Pasal 3 ayat (1)", "sourceUrl": "https://peraturan.bpk.go.id/Details/136460/uu-no-10-tahun-2020"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Cek dan bilyet giro dikenakan bea meterai Rp 10.000 per lembar, terlepas dari nominalnya.",
            "tags": ["bea-meterai", "cek", "bilyet-giro", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "bea-meterai-kontrak",
            "category": "Bea Meterai",
            "taxType": "Bea Meterai",
            "transactionType": "Kontrak/Perjanjian",
            "description": "Bea meterai atas surat perjanjian, kontrak, dan dokumen bernilai > Rp 5.000.000 yang diterima sebagai alat pembuktian.",
            "rate": {"type": "formula", "value": "Rp 10.000 per lembar"},
            "taxBase": "Dokumen kontrak/perjanjian dengan nilai > Rp 5.000.000",
            "payer": "Pihak yang menandatangani kontrak",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2021-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 10/2020", "article": "Pasal 3-5", "sourceUrl": "https://peraturan.bpk.go.id/Details/136460/uu-no-10-tahun-2020"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Kontrak/perjanjian dengan nilai ≤ Rp 5.000.000 tidak dikenai bea meterai. Yang > Rp 5.000.000: Rp 10.000 per lembar. Elektronik (e-meterai): Rp 10.000.",
            "tags": ["bea-meterai", "kontrak", "perjanjian", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "bea-meterai-surat-berharga",
            "category": "Bea Meterai",
            "taxType": "Bea Meterai",
            "transactionType": "Surat Berharga dan Efek",
            "description": "Bea meterai atas surat berharga, termasuk saham, obligasi, dan efek lainnya.",
            "rate": {"type": "formula", "value": "Rp 10.000 per lembar"},
            "taxBase": "Setiap lembar surat berharga",
            "payer": "Pihak yang menerbitkan surat berharga",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2021-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 10/2020", "article": "Pasal 3 ayat (2)", "sourceUrl": "https://peraturan.bpk.go.id/Details/136460/uu-no-10-tahun-2020"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Surat berharga termasuk saham, obligasi, commercial paper, dan efek bersifat utang lainnya yang diterbitkan dalam bentuk warkat.",
            "tags": ["bea-meterai", "surat-berharga", "efek", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "bea-meterai-nota-kredit",
            "category": "Bea Meterai",
            "taxType": "Bea Meterai",
            "transactionType": "Nota Kredit dan Dokumen Pengganti",
            "description": "Bea meterai atas nota kredit dan dokumen yang menjadi pengganti nota kredit, kwitansi, atau tanda terima pembayaran.",
            "rate": {"type": "formula", "value": "Rp 10.000 per lembar"},
            "taxBase": "Nota kredit dengan nilai > Rp 5.000.000",
            "payer": "Pihak yang menandatangani nota kredit",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "2021-01-01",
            "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [
                {"regulation": "UU 10/2020", "article": "Pasal 3-5", "sourceUrl": "https://peraturan.bpk.go.id/Details/136460/uu-no-10-tahun-2020"}
            ],
            "supersedes": [],
            "supersededBy": [],
            "notes": "Nota kredit dengan nilai ≤ Rp 5.000.000: tidak kena bea meterai. > Rp 5.000.000: Rp 10.000 per lembar.",
            "tags": ["bea-meterai", "nota-kredit", "berlaku"],
            "lastVerified": "2026-05-27"
        },
        {
            "id": "bea-meterai-pre2021",
            "category": "Bea Meterai",
            "taxType": "Bea Meterai",
            "transactionType": "Bea Meterai Pra-UU 10/2020",
            "description": "Bea meterai Rp 6.000 berdasarkan UU 13/1985 yang berlaku sebelum UU 10/2020.",
            "rate": {"type": "formula", "value": "Rp 6.000 per lembar"},
            "taxBase": "Dokumen dengan nilai > Rp 1.000.000",
            "payer": "Pihak yang menandatangani dokumen",
            "recipient": "Negara",
            "withholder": None,
            "effectiveFrom": "1986-01-01",
            "effectiveTo": "2020-12-31",
            "status": "dicabut",
            "legalBasis": [
                {"regulation": "UU 13/1985", "article": "Pasal 3-5", "sourceUrl": "https://peraturan.bpk.go.id/Details/44140/uu-no-13-tahun-1985"}
            ],
            "supersedes": [],
            "supersededBy": ["bea-meterai-dokumen-2021"],
            "notes": "Tarif Rp 6.000 untuk dokumen > Rp 1.000.000. Diganti UU 10/2020 dengan tarif Rp 10.000 untuk dokumen > Rp 5.000.000.",
            "tags": ["bea-meterai", "historis", "dicabut"],
            "lastVerified": "2026-05-27"
        }
    ]

    for entry in new_entries:
        if entry["id"] not in existing_ids:
            data["entries"].append(entry)
            print(f"  + {entry['id']}")
        else:
            print(f"  skip {entry['id']} (exists)")

    save_json(CAT_DIR / "bea-meterai.json", data)


# ═══════════════════════════════════════════════════════════════
# 8. NEW CATEGORY: BPHTB
# ═══════════════════════════════════════════════════════════════
def create_bphtb():
    print("\n📋 Creating BPHTB category...")
    filepath = CAT_DIR / "bphtb.json"
    if filepath.exists():
        print("  skip (file exists)")
        return

    data = {
        "category": "Pajak Daerah",
        "taxType": "BPHTB",
        "description": "Bea Perolehan Hak atas Tanah dan Bangunan - Pajak yang dikenakan atas perolehan hak atas tanah dan/atau bangunan",
        "entries": [
            {
                "id": "bphtb-perolehan-umum",
                "category": "Pajak Daerah",
                "taxType": "BPHTB",
                "transactionType": "Perolehan Hak atas Tanah/Bangunan (Umum)",
                "description": "BPHTB atas perolehan hak atas tanah dan/atau bangunan melalui jual beli, tukar-menukar, hibah, waris, pemasukan dalam perseroan, pemisahan hak, penunjukan pembeli dalam lelang, pelaksanaan putusan hakim, penggabungan usaha, peleburan usaha, pemekaran usaha, hadiah, pemberian hak baru.",
                "rate": {"type": "percentage", "value": 5},
                "taxBase": "NPOP (Nilai Perolehan Objek Pajak) dikurangi NPOPTKP (Rp 80.000.000 untuk perorangan)",
                "payer": "Penerima/pemperoleh hak",
                "recipient": "Pemerintah Daerah",
                "withholder": "PPAT (Pejabat Pembuat Akta Tanah) / Notaris",
                "effectiveFrom": "2010-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 28/2009", "article": "Pasal 5-7", "sourceUrl": "https://peraturan.bpk.go.id/Details/44141/uu-no-28-tahun-2009"},
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 78-82"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "NPOPTKP = Rp 80.000.000 (perorangan) atau Rp 80.000.000 × jumlah penerima hak (waris). NPOP minimum = NJOP. Tarif 5% × (NPOP - NPOPTKP).",
                "examples": [
                    {"scenario": "Membeli rumah NPOP Rp 1.000.000.000", "calculation": "5% × (1.000.000.000 - 80.000.000)", "result": "BPHTB = Rp 46.000.000"}
                ],
                "tags": ["bphtb", "tanah", "bangunan", "perolehan", "berlaku"],
                "lastVerified": "2026-05-27"
            },
            {
                "id": "bphtb-perolehan-waris",
                "category": "Pajak Daerah",
                "taxType": "BPHTB",
                "transactionType": "Perolehan Hak melalui Waris",
                "description": "BPHTB atas perolehan hak atas tanah dan/atau bangunan melalui waris. NPOPTKP yang lebih tinggi diberikan untuk waris.",
                "rate": {"type": "percentage", "value": 5},
                "taxBase": "NPOP dikurangi NPOPTKP waris (Rp 80.000.000 per ahli waris)",
                "payer": "Ahli waris penerima hak",
                "recipient": "Pemerintah Daerah",
                "withholder": "PPAT / Notaris",
                "effectiveFrom": "2010-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 28/2009", "article": "Pasal 7"},
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 80"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "Untuk waris, NPOPTKP = Rp 80.000.000 per ahli waris. Jika ada 3 ahli waris, NPOPTKP = 3 × Rp 80.000.000 = Rp 240.000.000.",
                "tags": ["bphtb", "waris", "perolehan", "berlaku"],
                "lastVerified": "2026-05-27"
            },
            {
                "id": "bphtb-pengalihan-dinkes",
                "category": "Pajak Daerah",
                "taxType": "BPHTB",
                "transactionType": "Pengalihan Hak untuk Kepentingan Umum",
                "description": "BPHTB yang tidak dipungut atas pengalihan hak atas tanah dan/atau bangunan untuk kepentingan umum yang dilakukan oleh pemerintah.",
                "rate": {"type": "percentage", "value": 0},
                "taxBase": "Tidak dipungut",
                "payer": "Penerima hak (pemerintah)",
                "recipient": "Pemerintah Daerah",
                "withholder": None,
                "effectiveFrom": "2010-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 28/2009", "article": "Pasal 14 ayat (1)"},
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 84"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "Tidak dipungut untuk pengalihan hak untuk kepentingan umum, termasuk pengadaan tanah untuk pembangunan infrastruktur.",
                "tags": ["bphtb", "kepentingan-umum", "fasilitas", "berlaku"],
                "lastVerified": "2026-05-27"
            }
        ]
    }

    save_json(filepath, data)


# ═══════════════════════════════════════════════════════════════
# 9. NEW CATEGORY: PBB
# ═══════════════════════════════════════════════════════════════
def create_pbb():
    print("\n📋 Creating PBB category...")
    filepath = CAT_DIR / "pbb.json"
    if filepath.exists():
        print("  skip (file exists)")
        return

    data = {
        "category": "Pajak Daerah",
        "taxType": "PBB",
        "description": "Pajak Bumi dan Bangunan - Pajak atas bumi dan/atau bangunan yang dimiliki, dikuasai, dan/atau dimanfaatkan",
        "entries": [
            {
                "id": "pbb-perkotaan",
                "category": "Pajak Daerah",
                "taxType": "PBB",
                "transactionType": "PBB Perkotaan dan Perdesaan (PBB-P2)",
                "description": "Pajak Bumi dan Bangunan Perkotaan dan Perdesaan (PBB-P2) yang dikelola oleh Pemerintah Daerah sejak UU HKPD berlaku.",
                "rate": {"type": "range", "value": [0.01, 0.3]},
                "taxBase": "NJOP (Nilai Jual Objek Pajak) dikurangi NJOPTKP (minimum Rp 10.000.000)",
                "payer": "Pemilik/penguasaan/pemanfaat tanah dan bangunan",
                "recipient": "Pemerintah Daerah Kabupaten/Kota",
                "withholder": None,
                "effectiveFrom": "2022-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 39-46"},
                    {"regulation": "UU 28/2009", "article": "Pasal 1-5"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "Tarif PBB-P2 ditetapkan oleh Perda (Peraturan Daerah) antara 0,01% - 0,3% dari NJOP. NJOPTKP minimum Rp 10.000.000. Sejak UU HKPD, PBB-P2 menjadi pajak daerah yang sepenuhnya dikelola daerah.",
                "examples": [
                    {"scenario": "NJOP rumah Rp 500.000.000, tarif PBB 0,2%", "calculation": "0,2% × (500.000.000 - 10.000.000)", "result": "PBB = Rp 980.000/tahun"}
                ],
                "tags": ["pbb", "pbb-p2", "perkotaan", "perdesaan", "pajak-daerah", "berlaku"],
                "lastVerified": "2026-05-27"
            },
            {
                "id": "pbb-perkebunan",
                "category": "Pajak Daerah",
                "taxType": "PBB",
                "transactionType": "PBB Perkebunan (PBB-P3)",
                "description": "Pajak Bumi dan Bangunan untuk sektor perkebunan yang dikelola oleh Pemerintah Pusat.",
                "rate": {"type": "percentage", "value": 0.05},
                "taxBase": "NJOP bumi dan bangunan perkebunan",
                "payer": "Pemilik/penguasaan perkebunan",
                "recipient": "Negara (Pemerintah Pusat)",
                "withholder": None,
                "effectiveFrom": "2022-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 47-52"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "PBB Perkebunan dikelola oleh Pemerintah Pusat dengan tarif 0,05% dari NJOP. Tidak ada NJOPTKP.",
                "tags": ["pbb", "perkebunan", "pbb-p3", "pusat", "berlaku"],
                "lastVerified": "2026-05-27"
            },
            {
                "id": "pbb-kehutanan",
                "category": "Pajak Daerah",
                "taxType": "PBB",
                "transactionType": "PBB Kehutanan (PBB-P3)",
                "description": "Pajak Bumi dan Bangunan untuk sektor kehutanan yang dikelola oleh Pemerintah Pusat.",
                "rate": {"type": "percentage", "value": 0.05},
                "taxBase": "NJOP bumi dan bangunan kehutanan",
                "payer": "Pemilik/penguasaan kawasan hutan",
                "recipient": "Negara (Pemerintah Pusat)",
                "withholder": None,
                "effectiveFrom": "2022-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 47-52"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "PBB Kehutanan dikelola oleh Pemerintah Pusat dengan tarif 0,05% dari NJOP. Tidak ada NJOPTKP.",
                "tags": ["pbb", "kehutanan", "pbb-p3", "pusat", "berlaku"],
                "lastVerified": "2026-05-27"
            },
            {
                "id": "pbb-pertambangan",
                "category": "Pajak Daerah",
                "taxType": "PBB",
                "transactionType": "PBB Pertambangan (PBB-P3)",
                "description": "Pajak Bumi dan Bangunan untuk sektor pertambangan yang dikelola oleh Pemerintah Pusat.",
                "rate": {"type": "percentage", "value": 0.05},
                "taxBase": "NJOP bumi dan bangunan pertambangan",
                "payer": "Pemilik/penguasaan area pertambangan",
                "recipient": "Negara (Pemerintah Pusat)",
                "withholder": None,
                "effectiveFrom": "2022-01-01",
                "effectiveTo": None,
                "status": "berlaku",
                "legalBasis": [
                    {"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 47-52"}
                ],
                "supersedes": [],
                "supersededBy": [],
                "notes": "PBB Pertambangan dikelola oleh Pemerintah Pusat dengan tarif 0,05% dari NJOP. Tidak ada NJOPTKP.",
                "tags": ["pbb", "pertambangan", "pbb-p3", "pusat", "berlaku"],
                "lastVerified": "2026-05-27"
            }
        ]
    }

    save_json(filepath, data)


# ═══════════════════════════════════════════════════════════════
# 10. Add missing regulations
# ═══════════════════════════════════════════════════════════════
def expand_regulations():
    print("\n📋 Expanding regulations...")
    filepath = REG_DIR / "core.json"
    data = load_json(filepath)
    existing_ids = {r["id"] for r in data}

    new_regs = [
        {
            "id": "pp-16-2009",
            "number": "16",
            "year": 2009,
            "title": "Peraturan Pemerintah tentang Pemotongan Pajak Penghasilan atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, dan Kegiatan Orang Pribadi",
            "type": "PP",
            "effectiveDate": "2009-01-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/50297/pp-no-16-tahun-2009",
            "status": "diubah_sebagian",
            "relatedRegulations": ["uu-7-2021-hpp", "pp-58-2023"]
        },
        {
            "id": "pp-94-2010",
            "number": "94",
            "year": 2010,
            "title": "Peraturan Pemerintah tentang Perhitungan Pajak Penghasilan Pasal 22 dan Pemungutan Pajak Pertambahan Nilai atas Penyerahan BKP",
            "type": "PP",
            "effectiveDate": "2010-01-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/69530/pp-no-94-tahun-2010",
            "status": "dicabut",
            "relatedRegulations": ["pp-60-2023"]
        },
        {
            "id": "pmk-141-2015",
            "number": "141",
            "year": 2015,
            "title": "Peraturan Menteri Keuangan tentang Pemotongan Pajak Penghasilan Pasal 23 atas Penghasilan Berupa Imbalan Jasa Tertentu",
            "type": "PMK",
            "effectiveDate": "2015-12-31",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/70615/pmk-no-141-pmk-03-2015-tahun-2015",
            "pasalUrl": "https://pasal.id/peraturan/permen/permenkeu-no-141-pmk-03-2015-tahun-2015",
            "status": "berlaku",
            "relatedRegulations": ["pp-60-2023", "uu-7-2021-hpp"]
        },
        {
            "id": "pp-51-2008",
            "number": "51",
            "year": 2008,
            "title": "Peraturan Pemerintah tentang Pajak Penghasilan atas Penghasilan dari Usaha yang Diterima atau Diperoleh Wajib Pajak yang Memiliki Peredaran Bruto Tertentu dan Pajak Penghasilan Final atas Penghasilan Tertentu",
            "type": "PP",
            "effectiveDate": "2009-01-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/50182/pp-no-51-tahun-2008",
            "status": "diubah_sebagian",
            "relatedRegulations": ["pp-40-2009"]
        },
        {
            "id": "pp-40-2009",
            "number": "40",
            "year": 2009,
            "title": "Peraturan Pemerintah tentang Perubahan atas PP 51/2008 tentang Pajak Penghasilan Final atas Penghasilan Tertentu",
            "type": "PP",
            "effectiveDate": "2009-07-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/50248/pp-no-40-tahun-2009",
            "status": "berlaku",
            "relatedRegulations": ["pp-51-2008"]
        },
        {
            "id": "pp-44-2022",
            "number": "44",
            "year": 2022,
            "title": "Peraturan Pemerintah tentang Pelaksanaan Pemungutan Pajak Pertambahan Nilai dan Pajak Penjualan atas Barang Mewah pada Perdagangan Melalui Sistem Elektronik",
            "type": "PP",
            "effectiveDate": "2022-04-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/196508/pp-no-44-tahun-2022",
            "status": "berlaku",
            "relatedRegulations": ["uu-7-2021-hpp", "uu-42-2009"]
        },
        {
            "id": "uu-28-2009",
            "number": "28",
            "year": 2009,
            "title": "Undang-Undang tentang PDRD (Pajak Daerah dan Retribusi Daerah)",
            "type": "UU",
            "effectiveDate": "2010-01-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/44141/uu-no-28-tahun-2009",
            "status": "dicabut_sebagian",
            "relatedRegulations": ["uu-1-2022-pbb"]
        },
        {
            "id": "uu-13-1985",
            "number": "13",
            "year": 1985,
            "title": "Undang-Undang tentang Bea Meterai",
            "type": "UU",
            "effectiveDate": "1986-01-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/44140/uu-no-13-tahun-1985",
            "status": "dicabut",
            "relatedRegulations": ["uu-10-2020-bea-meterai"]
        },
        {
            "id": "pp-14-2002",
            "number": "14",
            "year": 2002,
            "title": "Peraturan Pemerintah tentang Pemotongan Pajak Penghasilan atas Penghasilan Sehubungan dengan Pekerjaan, Jasa, dan Kegiatan Orang Pribadi (Pra-PP 16/2009)",
            "type": "PP",
            "effectiveDate": "2002-01-01",
            "sourceUrl": "https://peraturan.bpk.go.id/Details/50106/pp-no-14-tahun-2002",
            "status": "dicabut",
            "relatedRegulations": ["pp-16-2009"]
        }
    ]

    for reg in new_regs:
        if reg["id"] not in existing_ids:
            data.append(reg)
            print(f"  + {reg['id']}")
        else:
            print(f"  skip {reg['id']} (exists)")

    save_json(filepath, data)


# ═══════════════════════════════════════════════════════════════
# Run all expansions
# ═══════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("🚀 Starting comprehensive database expansion...")
    expand_pph21()
    expand_pph22()
    expand_pph26()
    expand_pph_badan()
    expand_ppn()
    expand_ppnbm()
    expand_bea_meterai()
    create_bphtb()
    create_pbb()
    expand_regulations()
    print("\n✅ Database expansion complete!")
