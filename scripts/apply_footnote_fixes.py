#!/usr/bin/env python3
import argparse, csv, pathlib, re, shutil, time

def backup(path: pathlib.Path) -> pathlib.Path:
    ts = time.strftime("%Y%m%d-%H%M%S")
    bak = path.with_suffix(path.suffix + f".footfix.{ts}.bak")
    shutil.copy2(path, bak)
    return bak

def apply_replacement(text, old_url, new_url):
    if not old_url or not new_url or old_url == new_url:
        return text, 0
    # Replace in Markdown footnotes and inline links
    # 1) [text](old_url)
    pat1 = re.compile(r"(\]\()"+re.escape(old_url)+r"(\))")
    # 2) bare old_url occurrences
    pat2 = re.compile(re.escape(old_url))
    n1 = len(pat1.findall(text))
    text = pat1.sub(r"\1"+new_url+r"\2", text)
    n2 = 0
    if n1 == 0:
        n2 = len(pat2.findall(text))
        text = pat2.sub(new_url, text)
    return text, (n1 or n2)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True)
    ap.add_argument("--dry", action="store_true")
    ap.add_argument("--root", default=".")
    args = ap.parse_args()

    root = pathlib.Path(args.root)
    rows = []
    with open(args.csv, newline="", encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))

    touched = 0
    changes = 0
    for row in rows:
        src = root / row["file"]
        if not src.exists():
            print(f"skip missing file: {src}")
            continue
        old = row["url"].strip()
        new = row["final_url"].strip()
        if not new or new == old:
            continue
        text = src.read_text(encoding="utf-8")
        new_text, n = apply_replacement(text, old, new)
        if n == 0:
            print(f"no match: {src} :: {old}")
            continue
        if not args.dry:
            backup(src)
            src.write_text(new_text, encoding="utf-8")
        touched += 1
        changes += n
        print(f"updated: {src}  replacements: {n}")

    print(f"files touched: {touched}  replacements: {changes}  dry={args.dry}")

if __name__ == "__main__":
    main()
