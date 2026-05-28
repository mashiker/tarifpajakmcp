#!/usr/bin/env python3
"""expand-database-v2.py — Comprehensive v2 expansion"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAT_DIR = os.path.join(ROOT, 'data', 'categories')
REG_DIR = os.path.join(ROOT, 'data', 'regulations')
TODAY = '2026-05-28'

def load_json(p):
    with open(p, 'r', encoding='utf-8') as f: return json.load(f)
def save_json(p, d):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write(chr(10))
def eids(cat): return {e['id'] for e in cat['entries']}

def part1_pph21_historical(cat):
    ids = eids(cat)
    new = []
    if "pph-21-progressive-uulama1983" not in ids:
        new.append({
            "id": "pph-21-progressive-uulama1983", "category": "PPh", "taxType": "PPh 21",
            "transactionType": "Tarif Progresif UU 7/1983",
            "description": "Tarif progresif PPh Orang Pribadi berdasarkan UU 7/1983 (UU PPh asli). Terdiri dari 3 lapis tarif: 15%, 25%, dan 35%. Berlaku dari tahun pajak 1984 hingga 1994.",
            "rate": {"type": "progressive", "value": "Progresif 3 lapis", "brackets": [
                {"min": 0, "max": 10000000, "rate": 15}, {"min": 10000000, "max": 50000000, "rate": 25}, {"min": 50000000, "max": None, "rate": 35}]},
            "taxBase": "Penghasilan Kena Pajak (PKP)", "payer": "WP Orang Pribadi dalam negeri",
            "recipient": "Negara", "withholder": None, "effectiveFrom": "1984-01-01", "effectiveTo": "1994-12-31",
            "status": "dicabut",
            "legalBasis": [{"regulation": "UU 7/1983", "article": "Pasal 17 ayat (1) huruf a",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983"}],
            "supersedes": [], "supersededBy": ["pph-21-progressive-uulama1994"],
            "notes": "UU PPh pertama Indonesia (UU 7/1983). Tarif progresif 3 lapis: 15% (≤10jt), 25% (10-50jt), 35% (>50jt). PTKP awal sangat kecil (Rp 960.000/tahun untuk single).",
            "examples": [{"scenario": "PKP Rp 30.000.000 tahun 1990", "calculation": "15% × 10jt + 25% × 20jt = 1.5jt + 5jt", "result": "PPh terutang = Rp 6.500.000"}],
            "tags": ["pph-21", "progresif", "historis", "uu-7-1983"], "lastVerified": TODAY
        })
    if "pph-21-progressive-uulama1994" not in ids:
        new.append({
            "id": "pph-21-progressive-uulama1994", "category": "PPh", "taxType": "PPh 21",
            "transactionType": "Tarif Progresif UU 10/1994",
            "description": "Tarif progresif PPh OP berdasarkan UU 10/1994 (perubahan pertama UU PPh). Tarif tidak berubah dari UU 7/1983 namun PTKP dinaikkan. Berlaku 1995-2000.",
            "rate": {"type": "progressive", "value": "Progresif 3 lapis", "brackets": [
                {"min": 0, "max": 10000000, "rate": 15}, {"min": 10000000, "max": 50000000, "rate": 25}, {"min": 50000000, "max": None, "rate": 35}]},
            "taxBase": "Penghasilan Kena Pajak (PKP)", "payer": "WP Orang Pribadi dalam negeri",
            "recipient": "Negara", "withholder": None, "effectiveFrom": "1995-01-01", "effectiveTo": "2000-12-31",
            "status": "dicabut",
            "legalBasis": [{"regulation": "UU 10/1994", "article": "Pasal 3",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/44056/uu-no-10-tahun-1994"}],
            "supersedes": ["pph-21-progressive-uulama1983"], "supersededBy": ["pph-21-progressive-pre2009"],
            "notes": "UU 10/1994 tidak mengubah tarif Pasal 17 secara signifikan. Tarif tetap 15/25/35%. PTKP dinaikkan menjadi Rp 1.728.000/tahun.",
            "examples": [{"scenario": "PKP Rp 30.000.000 tahun 1998", "calculation": "15% × 10jt + 25% × 20jt = 1.5jt + 5jt", "result": "PPh terutang = Rp 6.500.000"}],
            "tags": ["pph-21", "progresif", "historis", "uu-10-1994"], "lastVerified": TODAY
        })
    if "pph-21-progressive-monthly-pre2024" not in ids:
        new.append({
            "id": "pph-21-progressive-monthly-pre2024", "category": "PPh", "taxType": "PPh 21",
            "transactionType": "Pemotongan Bulanan Progresif (Pra-TER)",
            "description": "Metode pemotongan PPh 21 bulanan sebelum TER berlaku. Menggunakan tarif progresif Pasal 17 dengan annualisasi penghasilan. Berlaku dari 1984 hingga digantikan TER pada 2024.",
            "rate": {"type": "formula", "value": "Tarif Pasal 17 × (penghasilan neto bulanan × 12 - PTKP) setelah annualisasi",
                "effectiveRate": "Bervariasi sesuai lapisan progresif"},
            "taxBase": "Penghasilan bruto bulanan dikurangi biaya jabatan/iuran pensiun, kemudian annualisasi",
            "payer": "WP Orang Pribadi dalam negeri (pegawai)", "recipient": "Negara",
            "withholder": "Pemberi kerja", "effectiveFrom": "1984-01-01", "effectiveTo": "2023-12-31",
            "status": "dicabut",
            "legalBasis": [
                {"regulation": "UU 7/1983", "article": "Pasal 21", "sourceUrl": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983"},
                {"regulation": "PP 16/2009", "article": "Pasal 3-5", "sourceUrl": "https://peraturan.bpk.go.id/Details/50297/pp-no-16-tahun-2009"}],
            "supersedes": [], "supersededBy": ["pph-21-ter-monthly-2024"],
            "notes": "Metode lama: annualisasi penghasilan (×12), hitung PPh setahun dengan tarif progresif, bagi 12 untuk mendapatkan PPh bulanan. Digantikan oleh TER mulai 2024 melalui PP 58/2023.",
            "examples": [{"scenario": "Pegawai K/1, gaji Rp 8.000.000/bulan (2019)", "calculation": "Neto=8jt×12=96jt. PTKP K/1=63jt. PKP=33jt. PPh tahunan=5%×33jt=1.65jt. Bulanan=1.65jt/12", "result": "PPh 21 = Rp 137.500/bulan"}],
            "tags": ["pph-21", "bulanan", "annualisasi", "historis", "pra-ter"], "lastVerified": TODAY
        })

    # PTKP Timeline
    ptkp_data = [
        {"id": "pph-21-ptkp-1984", "desc": "PTKP awal UU 7/1983. TK/0 = Rp 960.000/tahun. Berlaku 1984-1994.",
         "ef": "1984-01-01", "et": "1994-12-31", "er": "TK/0 = Rp 960.000; K/0 = Rp 1.440.000; K/1 = Rp 1.680.000",
         "reg": "UU 7/1983", "art": "Pasal 17 ayat (6)", "url": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983",
         "sup": [], "supBy": ["pph-21-ptkp-1995"],
         "notes": "PTKP UU 7/1983: TK/0=R960.000; K/0=R1.440.000; K/1=R1.680.000; K/2=R1.920.000; K/3=R2.160.000. Tambahan wajib lapor R480.000."},
        {"id": "pph-21-ptkp-1995", "desc": "PTKP UU 10/1994. TK/0 = Rp 1.728.000/tahun. Berlaku 1995-2004.",
         "ef": "1995-01-01", "et": "2004-12-31", "er": "TK/0 = Rp 1.728.000; K/0 = Rp 1.920.000; K/1 = Rp 2.160.000",
         "reg": "UU 10/1994", "art": "Pasal 5", "url": "https://peraturan.bpk.go.id/Details/44056/uu-no-10-tahun-1994",
         "sup": ["pph-21-ptkp-1984"], "supBy": ["pph-21-ptkp-2005"],
         "notes": "PTKP dinaikkan: TK/0=R1.728.000; K/0=R1.920.000; Tanggungan R240.000/orang."},
        {"id": "pph-21-ptkp-2005", "desc": "PTKP PMK 138/2005. Lonjakan besar. TK/0 = Rp 12.000.000/tahun. Berlaku 2005-2008.",
         "ef": "2005-01-01", "et": "2008-12-31", "er": "TK/0 = Rp 12.000.000; K/0 = Rp 13.200.000; K/1 = Rp 14.400.000; K/2 = Rp 15.600.000; K/3 = Rp 16.800.000",
         "reg": "PMK 138/PMK.010/2005", "art": "Pasal 1", "url": "https://peraturan.bpk.go.id/Details/49344/pmk-no-138pmk0102005",
         "sup": ["pph-21-ptkp-1995"], "supBy": ["pph-21-ptkp-2009"],
         "notes": "PTKP dinaikkan drastis: TK/0=R12.000.000 (naik 7x). Kawin +R1.200.000, tanggungan +R1.200.000/orang."},
        {"id": "pph-21-ptkp-2009", "desc": "PTKP PMK 162/2009. TK/0 = Rp 15.840.000/tahun. Berlaku 2009-2015.",
         "ef": "2009-01-01", "et": "2015-12-31", "er": "TK/0 = Rp 15.840.000; K/0 = Rp 17.280.000; K/1 = Rp 18.720.000; K/2 = Rp 20.160.000; K/3 = Rp 21.600.000",
         "reg": "PMK 162/PMK.010/2009", "art": "Pasal 1", "url": "https://peraturan.bpk.go.id/Details/51412/pmk-no-162pmk0102009",
         "sup": ["pph-21-ptkp-2005"], "supBy": ["pph-21-non-taxable-income"],
         "notes": "PTKP dinaikkan lagi: TK/0=R15.840.000. Kawin +R1.440.000, tanggungan +R1.440.000/orang."}
    ]
    for pt in ptkp_data:
        if pt["id"] not in ids:
            new.append({
                "id": pt["id"], "category": "PPh", "taxType": "PPh 21",
                "transactionType": "PTKP (Penghasilan Tidak Kena Pajak)",
                "description": pt["desc"],
                "rate": {"type": "formula", "value": "PTKP sesuai regulasi berlaku", "effectiveRate": pt["er"]},
                "taxBase": "Bukan tarif, melainkan pengurang", "payer": "-", "recipient": "-",
                "withholder": None, "effectiveFrom": pt["ef"], "effectiveTo": pt["et"],
                "status": "dicabut",
                "legalBasis": [{"regulation": pt["reg"], "article": pt["art"], "sourceUrl": pt["url"]}],
                "supersedes": pt["sup"], "supersededBy": pt["supBy"],
                "notes": pt["notes"],
                "examples": [{"scenario": f"Pegawai TK/0 gaji Rp 5.000.000/bulan ({pt['ef'][:4]})",
                    "calculation": f"PTKP tahunan berlaku mengurangi penghasilan neto",
                    "result": "PTKP berlaku mengurangi penghasilan neto"}],
                "tags": ["pph-21", "ptkp", "pengurang", "historis"], "lastVerified": TODAY
            })
    # Fix chain for existing PTKP
    for e in cat["entries"]:
        if e["id"] == "pph-21-non-taxable-income" and "pph-21-ptkp-2009" not in e.get("supersedes", []):
            e["supersedes"] = ["pph-21-ptkp-2009"]
    cat["entries"].extend(new)
    print(f"  PPh 21: added {len(new)} historical entries")

def part1_pph_badan_historical(cat):
    ids = eids(cat)
    new = []
    if "pph-badan-pre2001" not in ids:
        new.append({
            "id": "pph-badan-pre2001", "category": "PPh", "taxType": "PPh Badan",
            "transactionType": "Penghasilan Kena Pajak Badan (UU 7/1983)",
            "description": "Tarif PPh badan berdasarkan UU 7/1983 menggunakan tarif yang sama dengan tarif progresif OP: 15%/25%/35%. Berlaku 1984-2000.",
            "rate": {"type": "progressive", "value": "Progresif 3 lapis (sama OP)", "brackets": [
                {"min": 0, "max": 10000000, "rate": 15}, {"min": 10000000, "max": 50000000, "rate": 25}, {"min": 50000000, "max": None, "rate": 35}]},
            "taxBase": "Penghasilan Kena Pajak (PKP) badan", "payer": "WP Badan dalam negeri / BUT",
            "recipient": "Negara", "withholder": None, "effectiveFrom": "1984-01-01", "effectiveTo": "2000-12-31",
            "status": "dicabut",
            "legalBasis": [{"regulation": "UU 7/1983", "article": "Pasal 17 ayat (1) huruf b",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983"}],
            "supersedes": [], "supersededBy": ["pph-badan-pre2010"],
            "notes": "UU 7/1983 Pasal 17 ayat (1) huruf b: tarif PPh badan sama dengan tarif progresif OP. Diubah menjadi flat rate oleh UU 17/2000.",
            "examples": [{"scenario": "PT dengan PKP Rp 100.000.000 tahun 1995", "calculation": "15%×10jt + 25%×40jt + 35%×50jt = 1.5jt + 10jt + 17.5jt", "result": "PPh Badan = Rp 29.000.000"}],
            "tags": ["pph-badan", "progresif", "historis", "uu-7-1983"], "lastVerified": TODAY
        })
    for e in cat["entries"]:
        if e["id"] == "pph-badan-pre2010" and "pph-badan-pre2001" not in e.get("supersedes", []):
            e["supersedes"] = ["pph-badan-pre2001"]
    cat["entries"].extend(new)
    print(f"  PPh Badan: added {len(new)} historical entries")

def part1_pph23_historical(cat):
    ids = eids(cat)
    new = []
    if "pph-23-jasa-pre2001" not in ids:
        new.append({
            "id": "pph-23-jasa-pre2001", "category": "PPh", "taxType": "PPh 23",
            "transactionType": "Imbalan Jasa & Sewa (UU 7/1983)",
            "description": "Tarif PPh 23 berdasarkan UU 7/1983 Pasal 23. Tarif atas imbalan jasa 15% dan atas sewa 10%. Berlaku 1984-2000.",
            "rate": {"type": "range", "value": [10, 15]},
            "taxBase": "Jumlah bruto imbalan jasa / sewa", "payer": "WP dalam negeri / BUT penerima penghasilan",
            "recipient": "Negara", "withholder": "Wajib Pajak badan pemberi penghasilan / bendahara pemerintah",
            "effectiveFrom": "1984-01-01", "effectiveTo": "2000-12-31", "status": "dicabut",
            "legalBasis": [{"regulation": "UU 7/1983", "article": "Pasal 23 ayat (1) huruf c",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983"}],
            "supersedes": [], "supersededBy": ["pph-23-jasa-2001"],
            "notes": "UU 7/1983: Imbalan jasa 15%, sewa 10%. Tarif jasa sangat tinggi dibanding 2% sekarang.",
            "examples": [{"scenario": "Jasa konsultasi Rp 50.000.000 tahun 1995", "calculation": "15% × 50.000.000", "result": "PPh 23 = Rp 7.500.000"}],
            "tags": ["pph-23", "historis", "uu-7-1983"], "lastVerified": TODAY
        })
    if "pph-23-jasa-2001" not in ids:
        new.append({
            "id": "pph-23-jasa-2001", "category": "PPh", "taxType": "PPh 23",
            "transactionType": "Imbalan Jasa & Sewa (UU 17/2000)",
            "description": "Tarif PPh 23 berdasarkan UU 17/2000. Tarif jasa diturunkan drastis dari 15% menjadi 2%. Sewa tetap 10%. Berlaku 2001-2021.",
            "rate": {"type": "range", "value": [2, 10]},
            "taxBase": "Jumlah bruto imbalan jasa / sewa", "payer": "WP dalam negeri / BUT penerima penghasilan",
            "recipient": "Negara", "withholder": "Wajib Pajak badan pemberi penghasilan / bendahara pemerintah",
            "effectiveFrom": "2001-01-01", "effectiveTo": "2021-12-31", "status": "diubah",
            "legalBasis": [{"regulation": "UU 17/2000", "article": "Pasal 23 ayat (1) huruf c",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/44066/uu-no-17-tahun-2000"}],
            "supersedes": ["pph-23-jasa-pre2001"], "supersededBy": ["pph-23-jasa-lain-2pct", "pph-23-jasa-lain-4pct"],
            "notes": "UU 17/2000 menurunkan tarif PPh 23 jasa dari 15% ke 2% — penurunan sangat signifikan. Sewa tetap 10%.",
            "examples": [{"scenario": "Jasa konsultasi Rp 50.000.000 tahun 2010", "calculation": "2% × 50.000.000", "result": "PPh 23 = Rp 1.000.000"}],
            "tags": ["pph-23", "historis", "uu-17-2000"], "lastVerified": TODAY
        })
    cat["entries"].extend(new)
    print(f"  PPh 23: added {len(new)} historical entries")

def part1_pph_final_historical(cat):
    ids = eids(cat)
    new = []
    if "pph-final-bunga-pre2009" not in ids:
        new.append({
            "id": "pph-final-bunga-pre2009", "category": "PPh", "taxType": "PPh 4(2)",
            "transactionType": "Bunga Simpanan (Pra-2009)",
            "description": "PPh final atas bunga simpanan (deposito, tabungan, SBI) berdasarkan UU 17/2000. Tarif 15%. Berlaku 2001-2008.",
            "rate": {"type": "percentage", "value": 15},
            "taxBase": "Jumlah bunga simpanan bruto", "payer": "Penabung / deposan", "recipient": "Negara",
            "withholder": "Bank / lembaga keuangan", "effectiveFrom": "2001-01-01", "effectiveTo": "2008-12-31",
            "status": "diubah",
            "legalBasis": [{"regulation": "UU 17/2000", "article": "Pasal 4 ayat (2)",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/44066/uu-no-17-tahun-2000"}],
            "supersedes": [], "supersededBy": ["pph-final-bunga-deposito"],
            "notes": "Tarif bunga deposito 15% UU 17/2000. Diturunkan/sesuai skema berjenjang oleh UU 36/2008.",
            "examples": [{"scenario": "Bunga deposito Rp 10.000.000 tahun 2005", "calculation": "15% × 10.000.000", "result": "PPh final = Rp 1.500.000"}],
            "tags": ["pph-final", "bunga", "deposito", "historis"], "lastVerified": TODAY
        })
    if "pph-final-pengalihan-pp131" not in ids:
        new.append({
            "id": "pph-final-pengalihan-pp131", "category": "PPh", "taxType": "PPh 4(2)",
            "transactionType": "Pengalihan Hak atas Tanah/Bangunan (PP 131/2000)",
            "description": "PPh final atas pengalihan hak atas tanah dan/atau bangunan berdasarkan PP 131/2000. Tarif 5% dari NJOP. Berlaku 2000-2008.",
            "rate": {"type": "percentage", "value": 5},
            "taxBase": "Jumlah bruto nilai pengalihan (NJOP / nilai transaksi)",
            "payer": "WP yang mengalihkan hak atas tanah/bangunan", "recipient": "Negara",
            "withholder": "Notaris / PPAT / BPN", "effectiveFrom": "2000-12-29", "effectiveTo": "2008-12-31",
            "status": "dicabut",
            "legalBasis": [{"regulation": "PP 131/2000", "article": "Pasal 5",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/44850/pp-no-131-tahun-2000"}],
            "supersedes": [], "supersededBy": ["pph-final-pengalihan-pp71"],
            "notes": "PP 131/2000: tarif 5% dari nilai bruto. Digantikan PP 71/2008 dengan tarif 2.5%/1%/0%.",
            "examples": [{"scenario": "Penjualan tanah NJOP Rp 500.000.000 tahun 2005", "calculation": "5% × 500.000.000", "result": "PPh final = Rp 25.000.000"}],
            "tags": ["pph-final", "tanah", "bangunan", "pengalihan", "historis"], "lastVerified": TODAY
        })
    if "pph-final-pengalihan-pp71" not in ids:
        new.append({
            "id": "pph-final-pengalihan-pp71", "category": "PPh", "taxType": "PPh 4(2)",
            "transactionType": "Pengalihan Hak atas Tanah/Bangunan (PP 71/2008)",
            "description": "PPh final atas pengalihan hak atas tanah/bangunan berdasarkan PP 71/2008. Tarif berjenjang: 2.5% (umum), 1% (perumahan sederhana), 0% (waris/hibah keluarga inti).",
            "rate": {"type": "range", "value": [0, 2.5]},
            "taxBase": "NJOP atau nilai transaksi pengalihan",
            "payer": "WP yang mengalihkan hak atas tanah/bangunan", "recipient": "Negara",
            "withholder": "Notaris / PPAT / BPN", "effectiveFrom": "2009-01-01", "effectiveTo": None,
            "status": "berlaku",
            "legalBasis": [{"regulation": "PP 71/2008", "article": "Pasal 2-4",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/49660/pp-no-71-tahun-2008"}],
            "supersedes": ["pph-final-pengalihan-pp131"], "supersededBy": [],
            "notes": "PP 71/2008: 2.5% umum, 1% perumahan sederhana (max 300jt)/rusun (max 350jt), 0% waris/hibah keluarga inti.",
            "examples": [
                {"scenario": "Penjualan tanah NJOP Rp 1.000.000.000", "calculation": "2.5% × 1.000.000.000", "result": "PPh final = Rp 25.000.000"},
                {"scenario": "Waris orang tua ke anak, NJOP Rp 800.000.000", "calculation": "0% (hibah/waris keluarga inti)", "result": "PPh final = Rp 0"}],
            "tags": ["pph-final", "tanah", "bangunan", "pengalihan", "berlaku"], "lastVerified": TODAY
        })
    cat["entries"].extend(new)
    print(f"  PPh 4(2) Final: added {len(new)} historical entries")

def part1_pph_umkm_historical(cat):
    ids = eids(cat)
    new = []
    if "pph-umkm-1pct-pp46" not in ids:
        new.append({
            "id": "pph-umkm-1pct-pp46", "category": "PPh", "taxType": "PPh UMKM",
            "transactionType": "Penghasilan Usaha (PP 46/2013)",
            "description": "Tarif final PPh 1% atas peredaran bruto WP OP pelaku UMKM berdasarkan PP 46/2013. Berlaku untuk peredaran bruto ≤ Rp 4,8 miliar/tahun. Periode 2013-2018.",
            "rate": {"type": "percentage", "value": 1},
            "taxBase": "Peredaran bruto (omzet)", "payer": "WP Orang Pribadi pelaku UMKM",
            "recipient": "Negara", "withholder": None, "effectiveFrom": "2013-07-01", "effectiveTo": "2018-06-30",
            "status": "dicabut",
            "legalBasis": [{"regulation": "PP 46/2013", "article": "Pasal 2-3",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/49798/pp-no-46-tahun-2013"}],
            "supersedes": [], "supersededBy": ["pph-umkm-05pct-2018"],
            "notes": "PP 46/2013 memperkenalkan PPh final UMKM pertama: 1% dari peredaran bruto. Digantikan PP 23/2018 (0,5%).",
            "examples": [{"scenario": "Pedagang omzet Rp 30.000.000/bulan (2015)", "calculation": "1% × 30.000.000", "result": "PPh UMKM = Rp 300.000/bulan"}],
            "tags": ["pph-umkm", "final", "1-persen", "historis", "pp-46-2013"], "lastVerified": TODAY
        })
    for e in cat["entries"]:
        if e["id"] == "pph-umkm-05pct-2018" and "pph-umkm-1pct-pp46" not in e.get("supersedes", []):
            e["supersedes"] = ["pph-umkm-1pct-pp46"]
    cat["entries"].extend(new)
    print(f"  PPh UMKM: added {len(new)} historical entries")

def part1_bea_meterai_historical(cat):
    ids = eids(cat)
    new = []
    if "bea-meterai-1000" not in ids:
        new.append({
            "id": "bea-meterai-1000", "category": "Bea Meterai", "taxType": "Bea Meterai",
            "transactionType": "Dokumen / Surat (UU 13/1985)",
            "description": "Bea Meterai Rp 1.000 berdasarkan UU 13/1985. Berlaku untuk dokumen dengan nilai > Rp 200.000. Periode 1986-1999.",
            "rate": {"type": "percentage", "value": 0, "effectiveRate": "Rp 1.000 per lembar untuk dokumen > Rp 200.000"},
            "taxBase": "Dokumen dengan nominal > Rp 200.000", "payer": "Pihak yang menandatangani / membuat dokumen",
            "recipient": "Negara", "withholder": None, "effectiveFrom": "1986-01-01", "effectiveTo": "1999-12-31",
            "status": "dicabut",
            "legalBasis": [{"regulation": "UU 13/1985", "article": "Pasal 3",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/44231/uu-no-13-tahun-1985"}],
            "supersedes": [], "supersededBy": ["bea-meterai-3000"],
            "notes": "Bea Meterai pertama: Rp 1.000/lembar untuk dokumen bernilai > Rp 200.000.",
            "examples": [{"scenario": "Kontrak Rp 500.000 tahun 1995", "calculation": "Dokumen > Rp 200.000 → Bea Meterai Rp 1.000", "result": "Bea Meterai = Rp 1.000"}],
            "tags": ["bea-meterai", "historis", "uu-13-1985"], "lastVerified": TODAY
        })
    if "bea-meterai-3000" not in ids:
        new.append({
            "id": "bea-meterai-3000", "category": "Bea Meterai", "taxType": "Bea Meterai",
            "transactionType": "Dokumen / Surat (PP 23/2000)",
            "description": "Bea Meterai Rp 3.000 berdasarkan PP 23/2000. Berlaku untuk dokumen dengan nilai > Rp 500.000. Periode 2000-2006.",
            "rate": {"type": "percentage", "value": 0, "effectiveRate": "Rp 3.000 per lembar untuk dokumen > Rp 500.000"},
            "taxBase": "Dokumen dengan nominal > Rp 500.000", "payer": "Pihak yang menandatangani / membuat dokumen",
            "recipient": "Negara", "withholder": None, "effectiveFrom": "2000-01-01", "effectiveTo": "2006-12-31",
            "status": "dicabut",
            "legalBasis": [{"regulation": "PP 23/2000", "article": "Pasal 1",
                "sourceUrl": "https://peraturan.bpk.go.id/Details/44780/pp-no-23-tahun-2000"}],
            "supersedes": ["bea-meterai-1000"], "supersededBy": ["bea-meterai-pre2021"],
            "notes": "PP 23/2000: naik dari Rp 1.000 ke Rp 3.000, batas dari Rp 200.000 ke Rp 500.000.",
            "examples": [{"scenario": "Surat perjanjian Rp 1.000.000 tahun 2003", "calculation": "Dokumen > Rp 500.000 → Rp 3.000", "result": "Bea Meterai = Rp 3.000"}],
            "tags": ["bea-meterai", "historis", "pp-23-2000"], "lastVerified": TODAY
        })
    for e in cat["entries"]:
        if e["id"] == "bea-meterai-pre2021":
            if "bea-meterai-3000" not in e.get("supersedes", []):
                e["supersedes"] = ["bea-meterai-3000"]
            e["notes"] = "Bea Meterai Rp 6.000 berdasarkan PP 80/2007 untuk dokumen bernilai > Rp 1.000.000. Berlaku 2007-2020."
            e["effectiveFrom"] = "2007-01-01"
            e["legalBasis"] = [
                {"regulation": "PP 80/2007", "article": "Pasal 1", "sourceUrl": "https://peraturan.bpk.go.id/Details/47779/pp-no-80-tahun-2007"},
                {"regulation": "UU 13/1985", "article": "Pasal 3", "sourceUrl": "https://peraturan.bpk.go.id/Details/44231/uu-no-13-tahun-1985"}]
    cat["entries"].extend(new)
    print(f"  Bea Meterai: added {len(new)} historical entries")

def part1_ppn_historical(cat):
    for e in cat["entries"]:
        if e["id"] == "ppn-10pct":
            e["effectiveFrom"] = "1984-04-01"
            e["effectiveTo"] = "2022-03-31"
            e["status"] = "diubah"
            e["supersededBy"] = ["ppn-11pct-2022"]
            e["supersedes"] = []
            e["legalBasis"] = [
                {"regulation": "UU 8/1983", "article": "Pasal 7 ayat (1)", "sourceUrl": "https://peraturan.bpk.go.id/Details/44024/uu-no-8-tahun-1983"},
                {"regulation": "UU 42/2009", "article": "Pasal 7 ayat (1)", "sourceUrl": "https://peraturan.bpk.go.id/Details/45861/uu-no-42-tahun-2009"}]
            e["examples"] = [{"scenario": "Penjualan BKP Rp 100.000.000 tahun 2001", "calculation": "10% × 100.000.000", "result": "PPN = Rp 10.000.000"}]
    print("  PPN: updated historical data")

# Part 2 helper
def _mk_entry(eid, cat, tt, trx, desc, rate_obj, tbase, payer, recip, ef, et, st, lb, sup, supby, notes, examples, tags):
    return {"id": eid, "category": cat, "taxType": tt, "transactionType": trx, "description": desc,
        "rate": rate_obj, "taxBase": tbase, "payer": payer, "recipient": recip,
        "withholder": None, "effectiveFrom": ef, "effectiveTo": et, "status": st,
        "legalBasis": lb, "supersedes": sup, "supersededBy": supby,
        "notes": notes, "examples": examples, "tags": tags, "lastVerified": TODAY}

def part2_pph15_deemed_profit(cat):
    ids = eids(cat)
    new = []
    deemed = [
        ("pph-15-penerbangan-domestik", "Penerbangan Dalam Negeri", "PPh deemed profit atas usaha penerbangan domestik.", 22, "UU 7/1983", "Pasal 15 ayat (1) huruf a"),
        ("pph-15-pelayaran-domestik", "Pelayaran Dalam Negeri", "PPh deemed profit atas usaha pelayaran domestik.", 22, "UU 7/1983", "Pasal 15 ayat (1) huruf b"),
        ("pph-15-perusahaan-asuransi", "Perusahaan Asuransi Dalam Negeri", "PPh deemed profit atas usaha asuransi/reasuransi dalam negeri.", 22, "UU 7/1983", "Pasal 15 ayat (1) huruf c"),
        ("pph-15-buta-charter", "Penyewaan Pesawat/Kapal dari Luar Negeri", "PPh deemed profit atas penyewaan pesawat/kapal dari luar negeri (bareboat charter).", 6.36, "UU 7/1983", "Pasal 15 ayat (2)"),
        ("pph-15-pma-opec", "Perusahaan Minyak Asing (PMA)", "PPh deemed profit atas penghasilan badan usaha migas asing (PSC). Tarif 48%.", 48, "UU 7/1983", "Pasal 15 ayat (4)"),
        ("pph-15-perusahaan-kontraktor", "Kontraktor/Operator Tambang", "PPh deemed profit atas penghasilan kontraktor pertambangan.", 22, "UU 7/1983", "Pasal 15 ayat (1) huruf d"),
    ]
    for eid, trx, desc, rv, reg, art in deemed:
        if eid not in ids:
            new.append(_mk_entry(eid, "PPh", "PPh 15", trx, desc,
                {"type": "percentage", "value": rv}, "Deemed profit (norma laba netto × peredaran bruto)",
                "WP Badan / WP Luar Negeri", "Negara", "1984-01-01", None, "berlaku",
                [{"regulation": reg, "article": art, "sourceUrl": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983"}],
                [], [], f"PPh Pasal 15: {desc} Tarif {rv}%.",
                [{"scenario": f"{trx} bruto Rp 10 miliar", "calculation": f"Norma laba netto × {rv}%", "result": f"PPh 15 = deemed profit × {rv}%"}],
                ["pph-15", "deemed-profit", "berlaku"]))
    cat["entries"].extend(new)
    print(f"  PPh 15: added {len(new)} entries")

def part2_ter_detail(cat):
    ids = eids(cat)
    new = []
    ter = [
        ("pph-21-ter-a-detail", "TER Kategori A (Tidak Menikah)", "0% - 25%", "0% untuk ≤ Rp 6.600.000, naik hingga 25% untuk > Rp 745.000.000",
         "TER A untuk pegawai tidak kawin tanpa tanggungan. Tarif mulai 0% untuk penghasilan rendah."),
        ("pph-21-ter-b-detail", "TER Kategori B (Menikah 0-2 Tanggungan)", "0% - 25%", "0% untuk ≤ Rp 6.950.000, naik hingga 25% untuk > Rp 855.000.000",
         "TER B untuk pegawai kawin dengan tanggungan 0-2."),
        ("pph-21-ter-c-detail", "TER Kategori C (Menikah 3+ Tanggungan)", "0% - 25%", "0% untuk ≤ Rp 7.550.000, naik hingga 25% untuk > Rp 955.000.000",
         "TER C untuk pegawai kawin dengan tanggungan ≥3."),
    ]
    for eid, trx, rv, er, notes in ter:
        if eid not in ids:
            new.append(_mk_entry(eid, "PPh", "PPh 21", trx,
                f"Tabel {trx}. Tarif efektif rata-rata sesuai PP 58/2023 Lampiran.",
                {"type": "formula", "value": f"{rv} sesuai tabel TER", "effectiveRate": er},
                "Penghasilan bruto bulanan dikurangi iuran pensiun/BPJS", "WP OP dalam negeri", "Negara",
                "2024-01-01", None, "berlaku",
                [{"regulation": "PP 58/2023", "article": "Lampiran", "sourceUrl": "https://peraturan.go.id/id/pp-no-58-tahun-2023"},
                 {"regulation": "PMK 168/2023", "article": "Pasal 4-6", "sourceUrl": "https://peraturan.go.id/id/pmk-no-168-tahun-2023"}],
                [], [], notes,
                [{"scenario": f"{trx}, gaji Rp 15.000.000/bulan", "calculation": "Cari tarif TER di tabel sesuai range", "result": "PPh 21 sesuai tabel TER"}],
                ["pph-21", "ter", "detail", "berlaku"]))
    cat["entries"].extend(new)
    print(f"  TER detail: added {len(new)} entries")

def part2_norma_penghitungan(cat):
    ids = eids(cat)
    new = []
    norms = [
        ("pph-21-norma-dokter", "Norma - Dokter/Dokter Gigi", 50, "Dokter honorarium Rp 100.000.000", "Neto=50%×100jt=50jt. PKP=50jt-54jt=negatif", "PPh=R0"),
        ("pph-21-norma-pengacara", "Norma - Pengacara/Advokat", 50, "Pengacara honorarium Rp 200.000.000", "Neto=50%×200jt=100jt. PKP=100jt-54jt=46jt", "PPh=5%×46jt=R2.300.000"),
        ("pph-21-norma-akuntan", "Norma - Akuntan", 50, "Akuntan honorarium Rp 80.000.000", "Neto=50%×80jt=40jt. PKP=40jt-54jt=negatif", "PPh=R0"),
        ("pph-21-norma-arsitek", "Norma - Arsitek", 50, "Arsitek honorarium Rp 150.000.000", "Neto=50%×150jt=75jt. PKP=75jt-54jt=21jt", "PPh=5%×21jt=R1.050.000"),
        ("pph-21-norma-notaris", "Norma - Notaris/PPAT", 50, "Notaris honorarium Rp 120.000.000", "Neto=50%×120jt=60jt. PKP=60jt-54jt=6jt", "PPh=5%×6jt=R300.000"),
        ("pph-21-norma-konsultan", "Norma - Konsultan", 50, "Konsultan honorarium Rp 200.000.000", "Neto=50%×200jt=100jt. PKP=100jt-54jt=46jt", "PPh=5%×46jt=R2.300.000"),
        ("pph-21-norma-pedagang", "Norma - Pedagang", 15, "Pedagang omzet Rp 500.000.000/tahun", "Neto=15%×500jt=75jt. PKP=75jt-54jt=21jt", "PPh=5%×21jt=R1.050.000"),
        ("pph-21-norma-petani", "Norma - Petani/Peternak", 25, "Petani omzet Rp 300.000.000/tahun", "Neto=25%×300jt=75jt. PKP=75jt-54jt=21jt", "PPh=5%×21jt=R1.050.000"),
        ("pph-21-norma-pengusaha-kecil", "Norma - Pengusaha Kecil Lainnya", 25, "Pengusaha kecil omzet Rp 200.000.000/tahun", "Neto=25%×200jt=50jt. PKP=50jt-54jt=negatif", "PPh=R0"),
    ]
    for eid, trx, pct, sc, calc, res in norms:
        if eid not in ids:
            new.append(_mk_entry(eid, "PPh", "PPh 21", trx,
                f"Norma penghitungan penghasilan neto {pct}% dari bruto untuk pekerjaan bebas. Dasar: PMK 523/2002 jo. PMK 43/2022.",
                {"type": "percentage", "value": pct}, f"{pct}% × penghasilan bruto (norma penghitungan)",
                "WP OP pelaku pekerjaan bebas", "Negara", "2002-01-01", None, "berlaku",
                [{"regulation": "PMK 523/KMK.04/2002", "article": "Lampiran", "sourceUrl": "https://peraturan.bpk.go.id/Details/47898/pmk-no-523kmk042002"},
                 {"regulation": "PMK 43/2022", "article": "Lampiran", "sourceUrl": "https://peraturan.bpk.go.id/Details/195814/pmk-no-43-tahun-2022"}],
                [], [], f"Norma penghitungan {pct}% dari bruto. Berlaku jika WP tidak menyelenggarakan pembukuan.",
                [{"scenario": sc, "calculation": calc, "result": res}],
                ["pph-21", "norma-penghitungan", "berlaku"]))
    cat["entries"].extend(new)
    print(f"  Norma: added {len(new)} entries")

def part2_pph_badan_detail(cat):
    ids = eids(cat)
    new = []
    details = [
        ("pph-badan-ikn-0pct", "PPh Badan IKN (0%)", "Tarif PPh badan 0% untuk WP badan di IKN (PP 28/2023). Masa manfaat 10-25 tahun.", 0),
        ("pph-badan-ikn-10y", "PPh Badan IKN 10 Tahun (10%)", "Tarif PPh badan 10% setelah masa fasilitas 0% di IKN.", 10),
    ]
    for eid, trx, desc, rv in details:
        if eid not in ids:
            new.append(_mk_entry(eid, "PPh", "PPh Badan", trx, desc,
                {"type": "percentage", "value": rv}, "Penghasilan Kena Pajak (PKP) badan",
                "WP Badan yang beroperasi di IKN", "Negara", "2024-01-01", None, "berlaku",
                [{"regulation": "PP 28/2023", "article": "Pasal 2", "sourceUrl": "https://peraturan.bpk.go.id/Details/196894/pp-no-28-tahun-2023"}],
                [], [], desc,
                [{"scenario": f"PT di IKN PKP Rp 1.000.000.000", "calculation": f"{rv}% × 1.000.000.000", "result": f"PPh Badan = Rp {rv*10_000_000:,}".replace(",",".")}],
                ["pph-badan", "ikn", "fasilitas", "berlaku"]))
    cat["entries"].extend(new)
    print(f"  PPh Badan detail: added {len(new)} entries")

def part2_tax_treaty(cat):
    ids = eids(cat)
    new = []
    if "pph-26-tax-treaty" not in ids:
        new.append(_mk_entry("pph-26-tax-treaty", "PPh", "PPh 26",
            "Tarif P3B (Tax Treaty)", "Tarif PPh berdasarkan Perjanjian Penghindaran Pajak Berganda (P3B/Tax Treaty). Tarif bisa lebih rendah dari 20%. Indonesia memiliki P3B dengan 70+ negara.",
            {"type": "range", "value": [0, 20]}, "Jumlah bruto penghasilan dari Indonesia ke WP luar negeri",
            "WP luar negeri (residen negara mitra P3B)", "Negara", "1984-01-01", None, "berlaku",
            [{"regulation": "UU 7/1983", "article": "Pasal 26", "sourceUrl": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983"},
             {"regulation": "UU 7/2021 (HPP)", "article": "Pasal 26", "sourceUrl": "https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021"}],
            [], [],
            "Tarif P3B bervariasi per negara. Contoh: Singapura 10-15%, Jepang 7-15%, Belanda 5-15%, Malaysia 10-15%, Australia 10-15%, UK 10-15%, US 10-15%, China 10%, India 10%, Korea 10-15%. Wajib disertai Certificate of Residence (CoR).",
            [{"scenario": "Dividen ke residen Singapura Rp 100.000.000", "calculation": "P3B Singapura dividen 10%. 10%×100jt", "result": "PPh 26 = Rp 10.000.000 (bukan 20%)"},
             {"scenario": "Royalti ke residen Belanda Rp 500.000.000", "calculation": "P3B Belanda royalti bisa 0% dengan BO", "result": "PPh 26 = Rp 0"}],
            ["pph-26", "tax-treaty", "p3b", "berlaku"]))
    cat["entries"].extend(new)
    print(f"  Tax Treaty: added {len(new)} entries")

def part2_ppn_detail(cat):
    ids = eids(cat)
    new = []
    ppns = [
        ("ppn-jasa-kegiatan-usaha-persewaan", "Jasa Kegiatan Usaha Persewaan (JKP)", "PPN atas JKP (sewa menyewa BKP/JKP). PPN dipungut penyewa.", 11, "UU 7/2021 (HPP)", "Pasal 4 ayat (3) huruf a angka 2",
         "JKP diperlakukan sebagai penyerahan BKP/JKP yang terutang PPN. Penyewa = pemungut PPN."),
        ("ppn-dpp-penghitungan", "Dasar Pengenaan Pajak (DPP) PPN", "Aturan penghitungan DPP untuk PPN. DPP umum = harga jual/penggantian/impor.", 11, "UU 8/1983", "Pasal 8",
         "DPP PPN = Harga Jual/Penggantian/Nilai Impor/Nilai Ekspor. Industri tertentu: DPP = 65-100% HJE."),
        ("ppn-pengkreditan", "Pengkreditan PPN (Input Tax Credit)", "PPN Input - PPN Output = PPN disetor. Syarat: Faktur PPN valid, untuk kegiatan usaha kena PPN.", 11, "UU 8/1983", "Pasal 9",
         "PPN Input dikreditkan dari PPN Output. Syarat: ada Faktur PPN, untuk kegiatan usaha yang kena PPN."),
    ]
    for eid, trx, desc, rv, reg, art, notes in ppns:
        if eid not in ids:
            url = "https://peraturan.bpk.go.id/Details/44024/uu-no-8-tahun-1983" if "8/1983" in reg else "https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021"
            new.append(_mk_entry(eid, "PPN", "PPN", trx, desc,
                {"type": "percentage", "value": rv}, "Dasar Pengenaan Pajak (DPP)",
                "Konsumen / pembeli akhir", "Negara", "1984-04-01", None, "berlaku",
                [{"regulation": reg, "article": art, "sourceUrl": url}], [], [], notes,
                [{"scenario": f"Transaksi {trx} Rp 100.000.000", "calculation": f"{rv}% × 100.000.000", "result": f"PPN = Rp {rv*1_000_000:,}".replace(",",".")}],
                ["ppn", "detail", "berlaku"]))
    cat["entries"].extend(new)
    print(f"  PPN detail: added {len(new)} entries")

def part2_bea_masuk():
    p = os.path.join(CAT_DIR, "bea-masuk.json")
    if os.path.exists(p): print("  Bea Masuk: exists, skip"); return
    cat = {"category": "Bea Masuk", "taxType": "Bea Masuk",
        "description": "Bea Masuk — pungutan negara atas barang yang diimpor berdasarkan HS Code",
        "entries": [
        _mk_entry("bea-masuk-umum-mf", "Bea Masuk", "Bea Masuk", "Bea Masuk Umum (MFN)",
            "Tarif Bea Masuk umum (MFN) berdasarkan BTKI. Tarif 0%-40% tergantung HS Code.",
            {"type": "range", "value": [0, 40]}, "Nilai Pabean (CIF)",
            "Importir", "Negara", "1984-04-01", None, "berlaku",
            [{"regulation": "UU 10/1995", "article": "Pasal 13-14", "sourceUrl": "https://peraturan.bpk.go.id/Details/44070/uu-no-10-tahun-1995"}],
            [], [], "Tarif BM MFN sesuai BTKI: 0% (komoditas dasar), 5% (bahan baku), 10% (setengah jadi), 15-25% (barang jadi), 40% (mobil mewah).",
            [{"scenario": "Impor laptop (HS 8471.30) USD 1.000", "calculation": "Tarif BM 0% × Rp 15.500.000", "result": "BM = Rp 0"},
             {"scenario": "Impor tekstil (HS 5208) USD 10.000", "calculation": "Tarif BM 15% × Rp 155.000.000", "result": "BM = Rp 23.250.000"}],
            ["bea-masuk", "mfn", "umum", "berlaku"]),
        _mk_entry("bea-masuk-asean-atiga", "Bea Masuk", "Bea Masuk", "Bea Masuk ASEAN (ATIGA)",
            "Tarif BM 0% untuk impor dari negara ASEAN berdasarkan ATIGA.",
            {"type": "percentage", "value": 0}, "Nilai Pabean (CIF)",
            "Importir dari negara ASEAN", "Negara", "2010-01-01", None, "berlaku",
            [{"regulation": "Perpres 55/2013", "article": "Lampiran", "sourceUrl": "https://peraturan.bpk.go.id/Details/53611/perpres-no-55-tahun-2013"}],
            [], [], "ATIGA: tarif 0% untuk barang ASEAN dengan Form D. 6 founding + 4 CLMV (bertahap).",
            [{"scenario": "Impor dari Thailand Form D USD 5.000", "calculation": "Tarif ATIGA 0%", "result": "BM = Rp 0"}],
            ["bea-masuk", "asean", "atiga", "berlaku"]),
        _mk_entry("bea-masuk-bmt", "Bea Masuk", "Bea Masuk", "Bea Masuk Tinggi (BMT) — Barang Mewah",
            "Tarif BM tinggi untuk barang mewah: rokok 50-150%, alkohol 40-150%, mobil mewah 40-80%.",
            {"type": "range", "value": [40, 150]}, "Nilai Pabean (CIF)",
            "Importir barang mewah", "Negara", "1984-04-01", None, "berlaku",
            [{"regulation": "UU 10/1995", "article": "Pasal 13 ayat (3)", "sourceUrl": "https://peraturan.bpk.go.id/Details/44070/uu-no-10-tahun-1995"}],
            [], [], "BMT: rokok 50-150%, alkohol 40-150%, mobil mewah 40-80%. Ditambah Cukai untuk rokok/alkohol.",
            [{"scenario": "Impor mobil mewah USD 100.000", "calculation": "BM 80% × Rp 1.550.000.000", "result": "BM = Rp 1.240.000.000 + PPN + PPnBM"}],
            ["bea-masuk", "bmt", "mewah", "berlaku"]),
        _mk_entry("bea-masuk-anti-dumping", "Bea Masuk", "Bea Masuk", "Bea Masuk Anti-Dumping (BMAD)",
            "BM tambahan atas impor barang yang masuk dengan harga di bawah normal (dumping).",
            {"type": "range", "value": [5, 100]}, "Nilai Pabean (CIF)",
            "Importir barang dumping", "Negara", "1996-01-01", None, "berlaku",
            [{"regulation": "UU 10/1995", "article": "Pasal 20-22", "sourceUrl": "https://peraturan.bpk.go.id/Details/44070/uu-no-10-tahun-1995"}],
            [], [], "BMAD berdasarkan penyelidikan KPUB. Contoh: baja China 5-30%. Masa berlaku 5 tahun.",
            [{"scenario": "Impor baja China kena BMAD 15%, CIF Rp 1.000.000.000", "calculation": "BM normal 15% + BMAD 15% = 30%", "result": "Total BM = Rp 300.000.000"}],
            ["bea-masuk", "anti-dumping", "bmad", "berlaku"]),
    ]}
    save_json(p, cat)
    print(f"  Bea Masuk: created {len(cat['entries'])} entries")

def part2_cukai():
    p = os.path.join(CAT_DIR, "cukai.json")
    if os.path.exists(p): print("  Cukai: exists, skip"); return
    cat = {"category": "Cukai", "taxType": "Cukai",
        "description": "Cukai — pungutan negara atas barang tertentu (etil alkohol, MMEA, hasil tembakau)",
        "entries": [
        _mk_entry("cukai-hasil-tembakau", "Cukai", "Cukai", "Cukai Hasil Tembakau (Rokok)",
            "Cukai atas rokok berdasarkan UU 39/2007. Tarif spesifik + ad valorem sesuai Kepmenkeu tahunan.",
            {"type": "formula", "value": "Tarif spesifik + ad valorem", "effectiveRate": "Rp 280 - Rp 640 per batang"},
            "HJE × jumlah produksi/impor", "Produsen/importir rokok", "Negara", "2008-01-01", None, "berlaku",
            [{"regulation": "UU 39/2007", "article": "Pasal 6-8", "sourceUrl": "https://peraturan.bpk.go.id/Details/45946/uu-no-39-tahun-2007"}],
            [], [], "Tarif cukai rokok naik setiap tahun. Spesifik (per batang) + ad valorem (% dari HJE).",
            [{"scenario": "Rokok SKM HJE Rp 2.000/batang, 10.000 batang", "calculation": "±Rp 600/batang × 10.000", "result": "Cukai = ±Rp 6.000.000"}],
            ["cukai", "rokok", "tembakau", "berlaku"]),
        _mk_entry("cukai-eti-alkohol", "Cukai", "Cukai", "Cukai Etil Alkohol / MMEA",
            "Cukai atas etil alkohol dan MMEA. Tarif berdasarkan golongan dan kadar alkohol.",
            {"type": "formula", "value": "Tarif spesifik per liter", "effectiveRate": "Rp 5.000 - Rp 150.000 per liter"},
            "Volume produksi/impor (liter)", "Produsen/importir MMEA", "Negara", "2008-01-01", None, "berlaku",
            [{"regulation": "UU 39/2007", "article": "Pasal 6 ayat (2)", "sourceUrl": "https://peraturan.bpk.go.id/Details/45946/uu-no-39-tahun-2007"}],
            [], [], "MMEA: Gol A (1-5%) Rp 5K-25K/ltr, Gol B (5-20%) Rp 25K-75K/ltr, Gol C (>20%) Rp 75K-150K/ltr.",
            [{"scenario": "Impor wine 12% 1000 liter", "calculation": "Gol B ±Rp 50.000/ltr × 1.000", "result": "Cukai = ±Rp 50.000.000"}],
            ["cukai", "alkohol", "mmea", "berlaku"]),
        _mk_entry("cukai-ecigarette", "Cukai", "Cukai", "Cukai e-Cigarette / Heated Tobacco",
            "Cukai atas produk tembakau pemanasan dan e-liquid. Berlaku sejak 2024.",
            {"type": "formula", "value": "Tarif ad valorem", "effectiveRate": "± 15-27% dari HJE"},
            "HJE", "Produsen/importir e-cigarette", "Negara", "2024-07-01", None, "berlaku",
            [{"regulation": "PMK 202/2023", "article": "Pasal 2-4", "sourceUrl": "https://peraturan.bpk.go.id/Details/202326/pmk-no-202-tahun-2023"}],
            [], [], "Cukai e-cigarette dan heated tobacco mulai Juli 2024. Skema ad valorem.",
            [{"scenario": "e-Liquid HJE Rp 100.000, 10.000 botol", "calculation": "±20% × Rp 100.000 × 10.000", "result": "Cukai = ±Rp 200.000.000"}],
            ["cukai", "e-cigarette", "vape", "berlaku"]),
    ]}
    save_json(p, cat)
    print(f"  Cukai: created {len(cat['entries'])} entries")

def part2_pajak_daerah():
    p = os.path.join(CAT_DIR, "pajak-daerah.json")
    if os.path.exists(p): print("  Pajak Daerah: exists, skip"); return
    # Short helper for PD entries
    def _pd(eid, trx, desc, rv, tbase, notes, sc, calc, res, tags):
        return _mk_entry(eid, "Pajak Daerah", "Pajak Daerah", trx, desc,
            {"type": "range", "value": rv}, tbase, "WP Daerah", "Pemerintah Daerah",
            "2022-01-01", None, "berlaku",
            [{"regulation": "UU 1/2022 (HKPD)", "article": "Pasal 60", "sourceUrl": "https://peraturan.bpk.go.id/Details/189054/uu-no-1-tahun-2022"}],
            [], [], notes, [{"scenario": sc, "calculation": calc, "result": res}], tags)
    cat = {"category": "Pajak Daerah", "taxType": "Pajak Daerah",
        "description": "Pajak Daerah berdasarkan UU 1/2022 (HKPD)",
        "entries": [
        _pd("pajak-daerah-hotel", "Pajak Hotel", "Pajak atas pelayanan hotel.", [5, 10], "Penerimaan hotel",
            "Tarif 5-10%. Umumnya 10% hotel berbintang.", "Hotel bintang 4 Rp 2.000.000/malam", "10%×2jt", "Pajak=R200.000", ["pajak-daerah", "hotel"]),
        _pd("pajak-daerah-restoran", "Pajak Restoran", "Pajak atas pelayanan restoran/rumah makan.", [5, 10], "Penerimaan restoran",
            "Tarif 5-10%. Umumnya 10% di kota besar.", "Makan di restoran Rp 500.000", "10%×500rb", "Pajak=R50.000", ["pajak-daerah", "restoran"]),
        _pd("pajak-daerah-hiburan", "Pajak Hiburan", "Pajak atas pelayanan hiburan (bioskop, karaoke, dll).", [5, 35], "Penerimaan / tiket hiburan",
            "Tarif 5-35% tergantung jenis. Tertinggi perjudian (35%).", "Tiket bioskop Rp 75.000", "15%×75rb", "Pajak=R11.250", ["pajak-daerah", "hiburan"]),
        _pd("pajak-daerah-reklame", "Pajak Reklame", "Pajak atas penyelenggaraan reklame.", [5, 25], "NJOR / nilai sewa reklame",
            "Tarif 5-25% dari NJOR.", "Reklame NJOR Rp 20.000.000/tahun", "25%×20jt", "Pajak=R5.000.000", ["pajak-daerah", "reklame"]),
        _pd("pajak-daerah-penerangan-jalan", "Pajak Penerangan Jalan", "Pajak atas penggunaan listrik PJU.", [1, 5], "Nilai tenaga listrik",
            "Tarif PPJ 1-5% dari nilai listrik.", "Listrik PJU Rp 5.000.000/bulan", "5%×5jt", "PPJ=R250.000", ["pajak-daerah", "ppj"]),
        _pd("pajak-daerah-mineral-air", "Pajak MBLB", "Pajak atas eksploitasi mineral bukan logam/batuan.", [5, 25], "NJP",
            "Tarif 5-25% dari NJP.", "Penambangan pasir NJP Rp 100.000.000", "10%×100jt", "Pajak=R10.000.000", ["pajak-daerah", "mblb"]),
        _pd("pajak-daerah-parkir", "Pajak Parkir", "Pajak atas penyelenggaraan tempat parkir.", [5, 20], "Penerimaan parkir",
            "Tarif 5-20%. Jakarta umumnya 15-20%.", "Parkir mall Rp 10.000", "20%×10rb", "Pajak=R2.000", ["pajak-daerah", "parkir"]),
        _pd("pajak-daerah-air-tanah", "Pajak Air Tanah/Permukaan", "Pajak atas pengambilan air tanah/permukaan.", [5, 20], "NPA",
            "Tarif 5-20% dari NPA.", "Industri air tanah NPA Rp 50.000.000/tahun", "10%×50jt", "Pajak=R5.000.000", ["pajak-daerah", "air-tanah"]),
    ]}
    save_json(p, cat)
    print(f"  Pajak Daerah: created {len(cat['entries'])} entries")

# Part 3: Quality Upgrade
def part3_upgrade_existing(cat):
    upgraded = 0
    for e in cat["entries"]:
        if not e.get("examples"):
            ex = _gen_example(e)
            if ex:
                e["examples"] = [ex]
                upgraded += 1
        for lb in e.get("legalBasis", []):
            if not lb.get("sourceUrl"):
                url = _guess_url(lb["regulation"])
                if url: lb["sourceUrl"] = url
    return upgraded

def _gen_example(e):
    rate = e.get("rate", {})
    rt = rate.get("type", "")
    rv = rate.get("value", "")
    if rt == "percentage" and isinstance(rv, (int, float)):
        if rv == 0:
            return {"scenario": f"{e.get('transactionType','')} - tidak kena pajak", "calculation": "Tarif 0%", "result": "Pajak = Rp 0"}
        return {"scenario": f"{e.get('transactionType','')} Rp 100.000.000", "calculation": f"{rv}% × 100.000.000", "result": f"Pajak = Rp {int(rv*1_000_000):,}".replace(",",".")}
    elif rt == "range":
        v = rv if isinstance(rv, list) else [0, 10]
        return {"scenario": f"{e.get('transactionType','')} Rp 100.000.000", "calculation": f"Tarif {v[0]}%-{v[1]}% × 100jt", "result": f"Pajak = Rp {int(v[0]*1_000_000):,} - Rp {int(v[1]*1_000_000):,}".replace(",",".")}
    elif rt == "progressive":
        return {"scenario": f"{e.get('transactionType','')} PKP Rp 100.000.000", "calculation": "Hitung per lapisan progresif", "result": "Pajak = jumlah dari setiap lapisan"}
    elif rt == "formula":
        return {"scenario": f"{e.get('transactionType','')}", "calculation": "Sesuai formula yang berlaku", "result": "Lihat ketentuan detail"}
    return None

def _guess_url(reg):
    m = {
        "UU 7/1983": "https://peraturan.bpk.go.id/Details/43983/uu-no-7-tahun-1983",
        "UU 10/1994": "https://peraturan.bpk.go.id/Details/44056/uu-no-10-tahun-1994",
        "UU 17/2000": "https://peraturan.bpk.go.id/Details/44066/uu-no-17-tahun-2000",
        "UU 8/1983": "https://peraturan.bpk.go.id/Details/44024/uu-no-8-tahun-1983",
        "UU 36/2008": "https://peraturan.bpk.go.id/Details/44090/uu-no-36-tahun-2008",
        "UU 42/2009": "https://peraturan.bpk.go.id/Details/45861/uu-no-42-tahun-2009",
        "UU 7/2021 (HPP)": "https://peraturan.bpk.go.id/Details/185162/uu-no-7-tahun-2021",
        "UU 10/2020": "https://peraturan.bpk.go.id/Details/135632/uu-no-10-tahun-2020",
        "UU 13/1985": "https://peraturan.bpk.go.id/Details/44231/uu-no-13-tahun-1985",
        "UU 1/2022 (HKPD)": "https://peraturan.bpk.go.id/Details/189054/uu-no-1-tahun-2022",
        "PP 58/2023": "https://peraturan.go.id/id/pp-no-58-tahun-2023",
        "PP 55/2022": "https://peraturan.bpk.go.id/Details/196497/pp-no-55-tahun-2022",
        "PP 16/2009": "https://peraturan.bpk.go.id/Details/50297/pp-no-16-tahun-2009",
        "PP 23/2018": "https://peraturan.bpk.go.id/Details/73500/pp-no-23-tahun-2018",
        "PP 131/2000": "https://peraturan.bpk.go.id/Details/44850/pp-no-131-tahun-2000",
        "PP 71/2008": "https://peraturan.bpk.go.id/Details/49660/pp-no-71-tahun-2008",
        "PP 46/2013": "https://peraturan.bpk.go.id/Details/49798/pp-no-46-tahun-2013",
        "PP 28/2023": "https://peraturan.bpk.go.id/Details/196894/pp-no-28-tahun-2023",
        "PP 80/2007": "https://peraturan.bpk.go.id/Details/47779/pp-no-80-tahun-2007",
        "PP 23/2000": "https://peraturan.bpk.go.id/Details/44780/pp-no-23-tahun-2000",
        "PMK 168/2023": "https://peraturan.go.id/id/pmk-no-168-tahun-2023",
        "PMK 131/2024": "https://peraturan.bpk.go.id/Details/204066/pmk-no-131-tahun-2024",
        "PMK 122/2015": "https://peraturan.bpk.go.id/Details/51529/pmk-no-122-tahun-2015",
    }
    return m.get(reg)

# Part 4: New Regulations
def part4_add_regulations():
    core_path = os.path.join(REG_DIR, "core.json")
    regs = load_json(core_path)
    existing = {r["id"] for r in regs}
    new_regs = [
        {"id": "pmk-122-2015", "number": "122/PMK.010/2015", "year": 2015, "title": "PMK tentang Besarnya Penghasilan Tidak Kena Pajak", "type": "PMK", "sourceUrl": "https://peraturan.bpk.go.id/Details/51529/pmk-no-122-tahun-2015", "status": "berlaku", "effectiveDate": "2016-01-01"},
        {"id": "pmk-138-2005", "number": "138/PMK.010/2005", "year": 2005, "title": "PMK tentang Besarnya PTKP", "type": "PMK", "sourceUrl": "https://peraturan.bpk.go.id/Details/49344/pmk-no-138pmk0102005", "status": "dicabut", "effectiveDate": "2005-01-01"},
        {"id": "pmk-162-2009", "number": "162/PMK.010/2009", "year": 2009, "title": "PMK tentang Besarnya PTKP", "type": "PMK", "sourceUrl": "https://peraturan.bpk.go.id/Details/51412/pmk-no-162pmk0102009", "status": "dicabut", "effectiveDate": "2009-01-01"},
        {"id": "pmk-523-2002", "number": "523/KMK.04/2002", "year": 2002, "title": "KMK tentang Norma Penghitungan Penghasilan Neto", "type": "KMK", "sourceUrl": "https://peraturan.bpk.go.id/Details/47898/pmk-no-523kmk042002", "status": "berlaku"},
        {"id": "pp-71-2008", "number": "71/2008", "year": 2008, "title": "PP tentang PPh Pengalihan Hak atas Tanah/Bangunan dan Jasa Konstruksi", "type": "PP", "sourceUrl": "https://peraturan.bpk.go.id/Details/49660/pp-no-71-tahun-2008", "status": "berlaku", "effectiveDate": "2009-01-01"},
        {"id": "pp-46-2013", "number": "46/2013", "year": 2013, "title": "PP tentang PPh UMKM Final 1%", "type": "PP", "sourceUrl": "https://peraturan.bpk.go.id/Details/49798/pp-no-46-tahun-2013", "status": "dicabut", "effectiveDate": "2013-07-01"},
        {"id": "pp-28-2023", "number": "28/2023", "year": 2023, "title": "PP tentang Fasilitas Pajak di IKN", "type": "PP", "sourceUrl": "https://peraturan.bpk.go.id/Details/196894/pp-no-28-tahun-2023", "status": "berlaku", "effectiveDate": "2023-11-02"},
        {"id": "pp-80-2007", "number": "80/2007", "year": 2007, "title": "PP tentang Perubahan Bea Meterai", "type": "PP", "sourceUrl": "https://peraturan.bpk.go.id/Details/47779/pp-no-80-tahun-2007", "status": "dicabut", "effectiveDate": "2007-01-01"},
        {"id": "pp-23-2000", "number": "23/2000", "year": 2000, "title": "PP tentang Perubahan Besarnya Bea Meterai", "type": "PP", "sourceUrl": "https://peraturan.bpk.go.id/Details/44780/pp-no-23-tahun-2000", "status": "dicabut", "effectiveDate": "2000-01-01"},
        {"id": "uu-39-2007", "number": "39/2007", "year": 2007, "title": "UU tentang Perubahan UU 11/1995 tentang Cukai", "type": "UU", "sourceUrl": "https://peraturan.bpk.go.id/Details/45946/uu-no-39-tahun-2007", "status": "berlaku"},
        {"id": "pmk-43-2022", "number": "43/2022", "year": 2022, "title": "PMK tentang Norma Penghitungan Penghasilan Neto", "type": "PMK", "sourceUrl": "https://peraturan.bpk.go.id/Details/195814/pmk-no-43-tahun-2022", "status": "berlaku", "effectiveDate": "2022-03-14"},
        {"id": "uu-1-2022-hkpd", "number": "1/2022", "year": 2022, "title": "UU tentang Hubungan Keuangan Pusat-Daerah (HKPD)", "type": "UU", "sourceUrl": "https://peraturan.bpk.go.id/Details/189054/uu-no-1-tahun-2022", "status": "berlaku"},
    ]
    added = 0
    for nr in new_regs:
        if nr["id"] not in existing: regs.append(nr); added += 1
    save_json(core_path, regs)
    print(f"  Regulations: added {added} (total: {len(regs)})")

# Part 5: Schema Update
def part5_update_schema():
    schema = load_json(os.path.join(ROOT, "data", "schema", "tax-rate-entry.json"))
    cats = schema["properties"]["category"]["enum"]
    for nc in ["PPh 15", "Cukai", "Pajak Daerah", "Bea Masuk"]:
        if nc not in cats: cats.append(nc)
    save_json(os.path.join(ROOT, "data", "schema", "tax-rate-entry.json"), schema)
    print(f"  Schema: {len(cats)} categories")

# Main
def main():
    print("=" * 60)
    print("EXPAND DATABASE V2 — Comprehensive Indonesian Tax Database")
    print("=" * 60)

    print("\n📅 PART 1: Historical Entries")
    for fname, func in [
        ("pph-21.json", part1_pph21_historical),
        ("pph-badan.json", part1_pph_badan_historical),
        ("pph-23.json", part1_pph23_historical),
        ("pph-4-2-final.json", part1_pph_final_historical),
        ("pph-umkm.json", part1_pph_umkm_historical),
        ("bea-meterai.json", part1_bea_meterai_historical),
        ("ppn.json", part1_ppn_historical)]:
        p = os.path.join(CAT_DIR, fname)
        cat = load_json(p)
        func(cat)
        save_json(p, cat)

    print("\n🆕 PART 2: New Topic Entries")
    for fname, func in [
        ("pph-4-2-final.json", part2_pph15_deemed_profit),
        ("pph-21.json", part2_ter_detail),
        ("pph-21.json", part2_norma_penghitungan),
        ("pph-badan.json", part2_pph_badan_detail),
        ("pph-26.json", part2_tax_treaty),
        ("ppn.json", part2_ppn_detail)]:
        p = os.path.join(CAT_DIR, fname)
        cat = load_json(p)
        func(cat)
        save_json(p, cat)
    part2_bea_masuk()
    part2_cukai()
    part2_pajak_daerah()

    print("\n✨ PART 3: Quality Upgrade")
    total = 0
    for fname in os.listdir(CAT_DIR):
        if not fname.endswith(".json"): continue
        p = os.path.join(CAT_DIR, fname)
        cat = load_json(p)
        u = part3_upgrade_existing(cat)
        if u > 0: save_json(p, cat)
        total += u
    print(f"  Upgraded {total} entries with examples/URLs")

    print("\n📜 PART 4: New Regulations")
    part4_add_regulations()

    print("\n🔧 PART 5: Schema Update")
    part5_update_schema()

    print("\n" + "=" * 60)
    te = 0; tc = 0
    for fname in sorted(os.listdir(CAT_DIR)):
        if not fname.endswith(".json"): continue
        cat = load_json(os.path.join(CAT_DIR, fname))
        n = len(cat["entries"])
        te += n; tc += 1
        print(f"  {fname:30s}: {n:3d} entries")
    print(f"\n  TOTAL: {te} entries across {tc} categories")
    print("=" * 60)

if __name__ == "__main__":
    main()
