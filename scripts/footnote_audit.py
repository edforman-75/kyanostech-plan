#!/usr/bin/env python3
# scripts/footnote_audit.py
import argparse, re, os, csv, subprocess, sys, shlex
from pathlib import Path
from collections import defaultdict
from typing import List, Tuple

# Match footnote definition lines like:
# [^id]: Some text with [Label](https://example.com) and maybe more text
FOOTNOTE_LINE_RE = re.compile(r"^\[\^([^\]]+)\]:\s*(.+)$")
# Find ALL http(s) links in the footnote text
URL_RE = re.compile(r"\((https?://[^\s)]+)\)")

class FootnoteHit:
    def __init__(self, file: str, line: int, footnote_id: str, link_text: str, url: str):
        self.file = file
        self.line = line
        self.footnote_id = footnote_id
        self.link_text = link_text
        self.url = url
        self.final_url = None
        self.status = None
        self.recommendation = None

def eprint(*a, **k):
    print(*a, file=sys.stderr, **k)

def check_url(url: str, connect_timeout: int = 8, max_time: int = 15) -> Tuple[str, str]:
    """
    Use curl (present by default on macOS) to resolve redirects and get an HTTP status.
    -s  silent
    -I  HEAD request
    -L  follow redirects
    -k  allow insecure (don’t fail on cert chain; we’re just auditing reachability)
    -o  discard body/headers
    -w  print "code url_effective"
    """
    cmd = [
        "curl", "-sILk",
        "--connect-timeout", str(connect_timeout),
        "--max-time", str(max_time),
        "-o", "/dev/null",
        "-w", "%{http_code} %{url_effective}",
        url,
    ]
    try:
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            return None, f"curl_error:{r.returncode}"
        out = r.stdout.strip()
        if not out:
            return None, "no_output"
        parts = out.split(maxsplit=1)
        if len(parts) == 2:
            code, final = parts
        else:
            code, final = parts[0], url
        return final, code
    except Exception as ex:
        return None, f"exception:{type(ex).__name__}"

def should_exclude(path: Path, patterns: List[str]) -> bool:
    p_str = str(path)
    for pat in patterns:
        # emulate simple glob on full path
        if Path(p_str).match(pat) or path.match(pat):
            return True
    return False

def scan_docs(doc_dir: str, exclude_patterns: List[str], verbose: bool) -> List[FootnoteHit]:
    hits: List[FootnoteHit] = []
    for path in Path(doc_dir).rglob("*.md"):
        if should_exclude(path, exclude_patterns):
            continue
        try:
            with path.open(encoding="utf-8") as fh:
                for i, line in enumerate(fh, 1):
                    m = FOOTNOTE_LINE_RE.match(line.strip())
                    if not m:
                        continue
                    fn_id, rest = m.groups()
                    # There may be multiple links in one footnote
                    for url_match in URL_RE.finditer(rest):
                        url = url_match.group(1)
                        # Try to capture the nearest [text](url) label before this url
                        # Fallback to url if not found.
                        link_text = url
                        bracket_before = rest.rfind("[", 0, url_match.start())
                        bracket_after = rest.rfind("]", 0, url_match.start())
                        if bracket_before != -1 and bracket_after != -1 and bracket_after > bracket_before:
                            candidate = rest[bracket_before+1:bracket_after].strip()
                            if candidate:
                                link_text = candidate
                        hits.append(FootnoteHit(str(path), i, fn_id, link_text, url))
                        if verbose:
                            print(f"[scan] {path}:{i} ^{fn_id} → {url}")
        except UnicodeDecodeError:
            eprint(f"[warn] Skipped non-utf8 file: {path}")
    return hits

def classify(hit: FootnoteHit):
    code = hit.status
    url = hit.url or ""
    final = (hit.final_url or "").rstrip("/")
    orig = url.rstrip("/")

    if not url:
        hit.recommendation = "Add a proper source URL."
        return

    if code in (None, "no_output") or code.startswith("curl_error") or code.startswith("exception"):
        hit.recommendation = f"Manual check (curl failure: {code})."
        return

    if code == "000":
        hit.recommendation = "Manual check (network/SSL blocked)."
        return

    if code == "404":
        hit.recommendation = "Fix link: 404 Not Found."
        return

    if code.startswith("5"):
        hit.recommendation = f"Retry later or replace: {code} server error."
        return

    if code.startswith("4"):
        if code == "401":
            hit.recommendation = "Avoid auth-gated sources; find public citation."
        elif code == "403":
            hit.recommendation = "Forbidden; replace with accessible citation."
        else:
            hit.recommendation = f"Client error {code}; replace link."
        return

    # 2xx / 3xx treated as reachable
    # Heuristic: homepage domains vs article/detail paths
    # We flag likely homepages (no path or very short path)
    from urllib.parse import urlparse
    parsed = urlparse(final or url)
    path_len = len(parsed.path.strip("/"))
    looks_home = (parsed.path in ("", "/")) or (path_len <= 3 and not parsed.query)

    if looks_home:
        hit.recommendation = "Replace homepage with deep link that substantiates the claim."
    else:
        # OK but suggest updating to final resolved URL if it changed
        hit.recommendation = "OK" if (final == orig) else "Update to resolved URL."

def audit(hits: List[FootnoteHit], verbose: bool, sleep_ms: int):
    # optional polite delay between requests (no external libs)
    delay = max(0, sleep_ms) / 1000.0
    import time
    total = len(hits)
    for idx, h in enumerate(hits, 1):
        if verbose:
            print(f"[check {idx}/{total}] {h.url}", end="", flush=True)
        h.final_url, h.status = check_url(h.url)
        classify(h)
        if verbose:
            # overwrite the same line with result
            trail = f"  → status={h.status}  final={h.final_url or '—'}  rec={h.recommendation}"
            print("\r" + " " * 120 + "\r", end="")  # clear line
            print(f"[check {idx}/{total}] {h.url}{trail}")
        if delay:
            time.sleep(delay)

def write_reports(hits: List[FootnoteHit], out_dir: str, verbose: bool):
    os.makedirs(out_dir, exist_ok=True)
    md_path = Path(out_dir) / "footnote_audit.md"
    csv_path = Path(out_dir) / "footnote_audit.csv"

    by_issue = defaultdict(list)
    for h in hits:
        key = h.recommendation or "Unclassified"
        by_issue[key].append(h)

    with open(md_path, "w", encoding="utf-8") as fh:
        fh.write("# Footnote Audit Report\n\n")
        summary = {
            "total": len(hits),
            "ok": len(by_issue.get("OK", [])),
            "homepage_warnings": len(by_issue.get("Replace homepage with deep link that substantiates the claim.", [])),
            "redirect_updates": len(by_issue.get("Update to resolved URL.", [])),
            "broken_404": len(by_issue.get("Fix link: 404 Not Found.", [])),
        }
        fh.write("## Summary\n")
        for k, v in summary.items():
            fh.write(f"- **{k.replace('_',' ').title()}**: {v}\n")
        fh.write("\n")

        for issue, items in sorted(by_issue.items(), key=lambda kv: kv[0]):
            fh.write(f"## {issue} ({len(items)})\n\n")
            for h in items:
                fh.write(f"- `{h.file}:{h.line}`  (^{h.footnote_id})  \n")
                fh.write(f"  - link text: {h.link_text}  \n")
                fh.write(f"  - url: {h.url}  \n")
                fh.write(f"  - status: {h.status}  \n")
                fh.write(f"  - resolved: {h.final_url or '—'}  \n\n")

    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        w = csv.writer(f)
        w.writerow(["file","line","footnote_id","link_text","url","final_url","status","recommendation"])
        for h in hits:
            w.writerow([h.file, h.line, h.footnote_id, h.link_text, h.url, h.final_url or "", h.status or "", h.recommendation or ""])

    if verbose:
        print(f"✓ Wrote {md_path}")
        print(f"✓ Wrote {csv_path}")

def main():
    ap = argparse.ArgumentParser(description="Audit Markdown footnote URLs (reachability, redirects, and quality).")
    ap.add_argument("--docs", required=True, help="Docs directory to scan (e.g., docs)")
    ap.add_argument("--out", required=True, help="Output directory (e.g., reports)")
    ap.add_argument("--exclude", action="append", default=[], help="Glob patterns to exclude (repeatable)")
    ap.add_argument("--quiet", action="store_true", help="Minimal terminal output")
    ap.add_argument("--sleep-ms", type=int, default=80, help="Delay between requests in milliseconds (default 80)")
    args = ap.parse_args()

    verbose = not args.quiet

    if verbose:
        print(f"[start] scanning '{args.docs}' (excludes: {args.exclude or '—'})")

    hits = scan_docs(args.docs, args.exclude, verbose=verbose)
    if verbose:
        print(f"[scan] found {len(hits)} footnote link(s)")

    audit(hits, verbose=verbose, sleep_ms=args.sleep_ms)
    write_reports(hits, args.out, verbose=verbose)

    if verbose:
        print("[done] audit complete")

if __name__ == "__main__":
    main()
