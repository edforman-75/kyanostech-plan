#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob || true 2>/dev/null

ts="$(date +%Y%m%d_%H%M%S)"

for f in docs/*.md; do
  if ! grep -q 'class="fn-ref"' "$f"; then
    continue
  fi

  cp "$f" "${f%.md}.pre_fnfix_${ts}.md"

  perl -0777 -e '
    my $t = do { local $/; <> };
    my %defs;

    $t =~ s{
      <a\s+class="fn-ref"[^>]*             
      (?:
        [^>]*?href="[^"#]*\#fn-([A-Za-z0-9_-]+)" 
      )?
      (?:
        [^>]*?data-fn="([^"]*)"            
      )?
      (?:
        [^>]*?title="([^"]*)"              
      )?
      [^>]*>
      (?:<span[^>]*>)?
      $begin:math:display$?(\\d+)$end:math:display$?
      (?:</span>)?
      </a>
    }{
      my ($k,$dfn,$title,$num)=($1,$2,$3,$4);
      $k ||= $num;
      my $d = defined($dfn) && $dfn ne "" ? $dfn : (defined($title) ? $title : "");
      $d =~ s/\s+/ /g;
      $defs{$k} ||= $d if $d ne "";
      "[^$k]";
    }egx;

    my %existing;
    while ($t =~ /^$begin:math:display$\\^([^$end:math:display$]+)\]:/mg) { $existing{$1}=1; }

    my @add = grep { !$existing{$_} } sort { $a cmp $b } keys %defs;
    if (@add) {
      $t =~ s/\s+\z/\n/;
      $t .= "\n## Footnotes\n\n" unless $t =~ /(^|\n)##\s*Footnotes\s*\n/;
      for my $k (@add) {
        my $d = $defs{$k} // "";
        $d = "TBD – definition not recovered" unless length $d;
        $t .= "[^$k]: $d\n";
      }
    }

    print $t;
  ' "$f" > "$f.tmp" && mv "$f.tmp" "$f"

  echo "✅ Fixed footnotes in $f"
done

echo "Done."
