#!/usr/bin/env bash
# remove-font-utilities.sh
# WSL/Debian-safe cleaner for Tailwind font-weight and text-size utilities
# INSIDE class/className attributes across JSX/TSX/JS/TS/MDX.

set -euo pipefail

TARGET_DIR="${1:-./src}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Target directory not found: $TARGET_DIR" >&2
  exit 1
fi

# Build a list for counting (safe) and processing (null-delimited)
FIND_EXPR=( -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.ts" -o -name "*.js" -o -name "*.mdx" \) )
COUNT=$(find "$TARGET_DIR" "${FIND_EXPR[@]}" -print | wc -l | awk '{print $1}')
if [ "$COUNT" -eq 0 ]; then
  echo "No matching files found under $TARGET_DIR"
  exit 0
fi

echo "Cleaning $COUNT files under $TARGET_DIR …"

# Write a small Perl helper to a temp file to avoid shell quoting issues.
TMP_PL=$(mktemp /tmp/cleanup.XXXXXX.pl)
cat > "$TMP_PL" <<'PERL'
#!/usr/bin/env perl
use strict; use warnings;

# Slurp whole files
local $/ = undef;

sub scrub {
  my ($s) = @_;

  # Remove Tailwind font-weights (allow responsive/state prefixes e.g., sm:, hover:)
  $s =~ s/(^|\s)(?:[A-Za-z-]+:)*font-(thin|extralight|light|normal|regular|medium|semibold|bold|extrabold|black)(?=\s|$)//g;

  # Remove Tailwind text-sizes (xs..9xl, base) and arbitrary sizes like text-[15px]
  $s =~ s/(^|\s)(?:[A-Za-z-]+:)*text-(xs|sm|base|lg|xl|[2-9]xl|\[[^\]]+\])(?=\s|$)//g;

  # Collapse extra spaces and trim
  $s =~ s/\s{2,}/ /g;
  $s =~ s/^\s+//;
  $s =~ s/\s+$//;

  return $s;
}

foreach my $file (@ARGV) {
  open my $in,  '<:raw', $file or next;
  my $src = <$in>;
  close $in;

  # Edit only inside class/className attribute values
  $src =~ s/(class(?:Name)?\s*=\s*")([^"]*)(")/$1 . scrub($2) . $3/eg;
  $src =~ s/(class(?:Name)?\s*=\s*\')([^\']*)(\')/$1 . scrub($2) . $3/eg;
  $src =~ s/(class(?:Name)?\s*=\s*\{`)([^`]*)(`\})/$1 . scrub($2) . $3/eg;
  $src =~ s/(class(?:Name)?\s*=\s*\{")([^"]*)("\})/$1 . scrub($2) . $3/eg;

  open my $out, '>:raw', $file or next;
  print {$out} $src;
  close $out;
}
PERL
chmod +x "$TMP_PL"

# Run the helper over the files (null-delimited to handle spaces)
find "$TARGET_DIR" "${FIND_EXPR[@]}" -print0 | xargs -0 -r "$TMP_PL"

echo "✅ Removed Tailwind font-weight and text-size utilities inside class/className under $TARGET_DIR."
echo "Tip: run 'git diff' to review the changes."

# Optional: clean up temp file automatically (comment out if you want to inspect it)
rm -f "$TMP_PL"
