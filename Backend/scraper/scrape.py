#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Scraper für 'Mein schöner Garten' – füllt Tabelle pflanze (+eigenschaft, +datenquelle)

• Aufruf:   python scrape.py  lavendel tomate gurke
• oder:     python scrape.py  --file pflanzen.txt      (eine Pflanze pro Zeile)
"""

import argparse, re, time, sys
from typing import List, Dict, Tuple

import requests
from bs4 import BeautifulSoup
from sqlalchemy import (
    create_engine, MetaData, Table, Column, Integer, String, Text, select
)
from sqlalchemy.exc import IntegrityError
from tqdm import tqdm

DB_URI = "mariadb+pymysql://appuser:geheim@127.0.0.1:3306/gartenclub"

engine = create_engine(DB_URI, echo=False, pool_recycle=3600)
meta   = MetaData(bind=engine)

pflanze_tbl = Table(
    "pflanze", meta,
    Column("pflanzenID", Integer, primary_key=True, autoincrement=True),
    Column("name", String(100)),
    Column("wissenschaftlicherName", String(150)),
    Column("eigenschaftID", Integer),
    Column("datenquelleID", Integer),
)

eig_tbl = Table(
    "eigenschaft", meta,
    Column("eigenschaftID", Integer, primary_key=True, autoincrement=True),
    Column("bezeichnung", String(100)),
    Column("beschreibung", Text),
)

quelle_tbl = Table(
    "externedatenquelle", meta,
    Column("datenquelleID", Integer, primary_key=True, autoincrement=True),
    Column("quellenname", String(150)),
    Column("zugriffstyp", String(50)),
    Column("datenformat", String(50)),
)

BASE = "https://www.mein-schoener-garten.de"

def url_varianten(name: str) -> List[str]:
    n = name.strip().lower()
    return [
        f"{BASE}/pflanzen/{n}",
        f"{BASE}/pflanzen/gemuese/{n}",
        f"{BASE}/pflanzen/gemuese/{n}n",
        f"{BASE}/pflanzen/kraeuter/{n}",
        f"{BASE}/pflanzen/obst/{n}",
        f"{BASE}/pflanzen/{n}s",
    ]

def finde_html(name: str) -> Tuple[str, str]:
    """gibt (URL, HTML) oder (None, None) zurück"""
    for u in url_varianten(name):
        try:
            r = requests.get(u, timeout=6)
            if r.status_code == 200 and "/pflanzen" in r.url:
                return r.url, r.text
        except requests.RequestException:
            pass
    return None, None

def parse(html: str) -> Dict[str, str]:
    soup = BeautifulSoup(html, "html.parser")
    main = soup.find("main")
    wiss = None
    if main:
        i_tag = main.find("i")
        if i_tag:
            w = i_tag.get_text(strip=True)
            if re.match(r"^[A-ZÄÖÜ][a-zäöüß\-\.]+", w):
                wiss = w

    absatz = soup.select_one("main p")
    beschr = absatz.get_text(" ", strip=True)[:250] + "…" if absatz else "Quelle MSG"
    return {"wiss": wiss, "beschreibung": beschr}

def fk_datenquelle(conn) -> int:
    """legt Eintrag 'Mein schöner Garten' an (einmalig)"""
    sel = select(quelle_tbl.c.datenquelleID).where(quelle_tbl.c.quellenname == "Mein schöner Garten")
    existing = conn.execute(sel).scalar()
    if existing:
        return existing
    res = conn.execute(
        quelle_tbl.insert().values(
            quellenname="Mein schöner Garten",
            zugriffstyp="Scraping",
            datenformat="HTML"
        )
    )
    return res.inserted_primary_key[0]

def fk_eigenschaft(conn, beschreibung: str) -> int:
    """legt Dummy-Eigenschaft 'automatisch' an oder liefert ID"""
    sel = select(eig_tbl.c.eigenschaftID).where(eig_tbl.c.bezeichnung == "automatisch")
    ex = conn.execute(sel).scalar()
    if ex:
        return ex
    res = conn.execute(
        eig_tbl.insert().values(bezeichnung="automatisch", beschreibung=beschreibung)
    )
    return res.inserted_primary_key[0]

def insert_pflanze(conn, name: str, wiss: str, eig_id: int, dq_id: int):
    try:
        conn.execute(
            pflanze_tbl.insert().values(
                name=name, wissenschaftlicherName=wiss, eigenschaftID=eig_id, datenquelleID=dq_id
            )
        )
        return True
    except IntegrityError:
        return False

def scrape(names: List[str]) -> int:
    added = 0
    dq_id = None
    with engine.begin() as conn:
        dq_id = fk_datenquelle(conn)
        for n in tqdm(names, unit="pflanze"):
            url, html = finde_html(n)
            if not html:
                tqdm.write(f"  Keine Seite für {n}")
                continue
            parsed = parse(html)
            eig_id = fk_eigenschaft(conn, parsed["beschreibung"])
            if insert_pflanze(conn, n, parsed["wiss"], eig_id, dq_id):
                added += 1
    return added

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("pflanzen", nargs="*", help="Pflanzennamen")
    parser.add_argument("--file", help="Datei mit einem Pflanzennamen pro Zeile")
    args = parser.parse_args()

    pflanzen = args.pflanzen
    if args.file:
        with open(args.file, encoding="utf-8") as f:
            pflanzen.extend([l.strip() for l in f if l.strip()])

    if not pflanzen:
        sys.exit("  Keine Pflanzennamen übergeben.")

    neu = scrape(pflanzen)
    print(f"  {neu} neue Pflanzen gespeichert.")
