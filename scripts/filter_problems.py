#!/usr/bin/env python3
import argparse, csv, re, sys, pathlib

def compile_pat(s):
    return re.compile(s) if s else None

def match(pat, s):
    return bool(pat.search(s or "")) if pat else True

def main():
    ap = argparse.ArgumentParser(description="Filter footnote audit CSV to only problematic rows.")
    ap.add_argument("--in", dest="in_csv", required=True, help="Input CSV (reports/footnote_audit.csv)")
    ap.add_argument("--out", dest="out_csv", required=True, help="Output CSV path")
    ap.add_argument("--keep-rec", help="Regex to KEEP by recommendation (e.g. '404|Forbidden|Replace homepage|Update')")
    ap.add_argument("--keep-status", help="Regex to KEEP by HTTP status (e.g. '^(403|404)$')")
    ap.add_argument("--keep-domain", help="Regex to KEEP by domain (e.g. 'ballotpedia|opensecrets')")
    ap.add_argument("--keep-text", help="Regex to KEEP if appears in url/final_url/link_text")
    ap.add_argument("--not-path", help="Comma-separated substrings to EXCLUDE by file path")
    ap.add_argument("--exclude-ok", action="store_true", help="Drop rows where recommendation == 'OK'")
    args = ap.parse_args()

    rec_pat   = compile_pat(args.keep_rec)
    sts_pat   = compile_pat(args.keep_status)
    dom_pat   = compile_pat(args.keep_domain)
    text_pat  = compile_pat(args.keep_text)

    not_paths = [s.strip() for s in (args.not_path or "").split(",") if s.strip()]

    in_p  = pathlib.Path(args.in_csv)
    out_p = pathlib.Path(args.out_csv)
    out_p.parent.mkdir(parents=True, exist_ok=True)

    kept = 0
    with in_p.open(newline="", encoding="utf-8") as fin, out_p.open("w", newline="", encoding="utf-8") as fout:
        r = csv.DictReader(fin)
        w = csv.DictWriter(fout, fieldnames=r.fieldnames)
        w.writeheader()
        for row in r:
            fpath = row.get("file","")
            if any(excl in fpath for excl in not_paths):
                continue

            if args.exclude_ok and (row.get("recommendation","").strip() == "OK"):
                continue

            ok = True
            if rec_pat:   ok = ok and match(rec_pat, row.get("recommendation",""))
            if sts_pat:   ok = ok and match(sts_pat, row.get("status",""))
            if dom_pat:   ok = ok and match(dom_pat, row.get("domain",""))
            if text_pat:
                blob = " ".join([row.get("url",""), row.get("final_url",""), row.get("link_text","")])
                ok = ok and match(text_pat, blob)

            if ok:
                w.writerow(row)
                kept += 1

    print(f"wrote {kept} rows -> {out_p}")
if __name__ == "__main__":
    main()
