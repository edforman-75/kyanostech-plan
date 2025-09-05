#!/usr/bin/env python3
import csv, argparse, sys, re
from pathlib import Path

def split_multi(vals):
    out = []
    for v in vals or []:
        out += [s.strip() for s in v.split(",") if s.strip()]
    return [o for o in out if o]

def ci_contains(hay, needle):
    if not needle: return True
    return needle.lower() in (hay or "").lower()

def path_ok(p: str, only_paths, not_paths):
    p = p or ""
    if only_paths:
        if not any(sub in p for sub in only_paths):
            return False
    if not_paths:
        if any(sub in p for sub in not_paths):
            return False
    return True

def main():
    ap = argparse.ArgumentParser(description="Make a subset CSV from reports/footnote_audit.csv")
    ap.add_argument("--in", dest="inp", default="reports/footnote_audit.csv")
    ap.add_argument("--out", dest="out", required=True)
    ap.add_argument("--rec", dest="rec", help="substring match on recommendation (ci)")
    ap.add_argument("--status", dest="status", help="substring match on status (ci)")
    ap.add_argument("--issue", dest="issue", help="substring match on issue (ci)")
    ap.add_argument("--domain", dest="domain", help="substring match on domain (ci)")
    ap.add_argument("--not-path", dest="not_path", action="append", default=[])
    ap.add_argument("--only-path", dest="only_path", action="append", default=[])
    args = ap.parse_args()

    only_paths = split_multi(args.only_path)
    not_paths  = split_multi(args.not_path)

    inp = Path(args.inp)
    if not inp.exists():
        print(f"ERR: {inp} not found", file=sys.stderr)
        sys.exit(1)

    want_cols = ["file","line","footnote_id","link_text","url","final_url","status","recommendation","issue","domain"]
    rows_out = []

    with inp.open(newline="", encoding="utf-8") as fh:
        rdr = csv.DictReader(fh)
        # allow for older report without all columns
        cols = rdr.fieldnames or []
        for r in rdr:
            f = r.get("file","")
            if not path_ok(f, only_paths, not_paths):
                continue
            if args.rec    and not ci_contains(r.get("recommendation",""), args.rec): continue
            if args.status and not ci_contains(r.get("status",""),         args.status): continue
            if args.issue  and not ci_contains(r.get("issue",""),          args.issue): continue
            if args.domain and not ci_contains(r.get("domain",""),         args.domain): continue
            rows_out.append(r)

    outp = Path(args.out)
    outp.parent.mkdir(parents=True, exist_ok=True)
    with outp.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=want_cols)
        w.writeheader()
        for r in rows_out:
            w.writerow({k: r.get(k,"") for k in want_cols})

    print(f"Wrote {len(rows_out)} rows -> {outp}")

if __name__ == "__main__":
    main()#!/usr/bin/env python3
import csv, argparse, sys, re
from pathlib import Path

def split_multi(vals):
    out = []
    for v in vals or []:
        out += [s.strip() for s in v.split(",") if s.strip()]
    return [o for o in out if o]

def ci_contains(hay, needle):
    if not needle: return True
    return needle.lower() in (hay or "").lower()

def path_ok(p: str, only_paths, not_paths):
    p = p or ""
    if only_paths:
        if not any(sub in p for sub in only_paths):
            return False
    if not_paths:
        if any(sub in p for sub in not_paths):
            return False
    return True

def main():
    ap = argparse.ArgumentParser(description="Make a subset CSV from reports/footnote_audit.csv")
    ap.add_argument("--in", dest="inp", default="reports/footnote_audit.csv")
    ap.add_argument("--out", dest="out", required=True)
    ap.add_argument("--rec", dest="rec", help="substring match on recommendation (ci)")
    ap.add_argument("--status", dest="status", help="substring match on status (ci)")
    ap.add_argument("--issue", dest="issue", help="substring match on issue (ci)")
    ap.add_argument("--domain", dest="domain", help="substring match on domain (ci)")
    ap.add_argument("--not-path", dest="not_path", action="append", default=[])
    ap.add_argument("--only-path", dest="only_path", action="append", default=[])
    args = ap.parse_args()

    only_paths = split_multi(args.only_path)
    not_paths  = split_multi(args.not_path)

    inp = Path(args.inp)
    if not inp.exists():
        print(f"ERR: {inp} not found", file=sys.stderr)
        sys.exit(1)

    want_cols = ["file","line","footnote_id","link_text","url","final_url","status","recommendation","issue","domain"]
    rows_out = []

    with inp.open(newline="", encoding="utf-8") as fh:
        rdr = csv.DictReader(fh)
        # allow for older report without all columns
        cols = rdr.fieldnames or []
        for r in rdr:
            f = r.get("file","")
            if not path_ok(f, only_paths, not_paths):
                continue
            if args.rec    and not ci_contains(r.get("recommendation",""), args.rec): continue
            if args.status and not ci_contains(r.get("status",""),         args.status): continue
            if args.issue  and not ci_contains(r.get("issue",""),          args.issue): continue
            if args.domain and not ci_contains(r.get("domain",""),         args.domain): continue
            rows_out.append(r)

    outp = Path(args.out)
    outp.parent.mkdir(parents=True, exist_ok=True)
    with outp.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=want_cols)
        w.writeheader()
        for r in rows_out:
            w.writerow({k: r.get(k,"") for k in want_cols})

    print(f"Wrote {len(rows_out)} rows -> {outp}")

if __name__ == "__main__":
    main()
