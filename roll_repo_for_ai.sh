#!/usr/bin/env bash
# roll_repo_split.sh
# Rolls a repo into readable text chunks (comment stripped, binary skip, size safe).

set -euo pipefail

REPO_DIR="${1:-.}"
MAX_SIZE_KB="${2:-40}"  # default 40 KB
MAX_SIZE_BYTES=$((MAX_SIZE_KB * 1024))
OUT_DIR="rolled-repo"
OUT_BASENAME="rolled_part"
PART_NUM=1
OUT_FILE="${OUT_DIR}/${OUT_BASENAME}_${PART_NUM}.txt"

mkdir -p "$OUT_DIR"
cd "$REPO_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: $REPO_DIR is not a git repository."
  exit 1
fi

FILES=$(git ls-files --cached --others --exclude-standard | grep -v '^public/' || true)
if [[ -z "$FILES" ]]; then
  echo "No files found to include."
  exit 0
fi

echo "Rolling up repo into chunks under ${MAX_SIZE_KB}KB each..."
echo "Output folder: $OUT_DIR"
echo ""

# Start first file
{
  echo "# Rolled repository from: $REPO_DIR"
  echo "# Generated on $(date)"
  echo "# Ignored .gitignore, skipped binaries, removed comments, excluded /public"
  echo ""
} > "$OUT_FILE"

get_size() {
  stat -c%s "$1" 2>/dev/null || stat -f%z "$1"
}

CUR_SIZE=$(get_size "$OUT_FILE")

for f in $FILES; do
  [[ -f "$f" ]] || continue

  # Skip binaries
  if file "$f" | grep -qi 'binary'; then
    echo "Skipping binary file: $f"
    continue
  fi

  # Clean comments according to language
  case "$f" in
    *.py | *.sh | *.zsh | *.bash)
      CLEAN_CMD="grep -vE '^\s*#' '$f'"
      ;;
    *.js | *.ts | *.jsx | *.tsx | *.java | *.c | *.cpp | *.h | *.css | *.scss | *.go | *.rs)
      CLEAN_CMD="grep -vE '^\s*(//|/\*|\*|\*/)' '$f'"
      ;;
    *)
      CLEAN_CMD="cat '$f'"
      ;;
  esac

  echo "→ Processing: $f"

  HEADER="----- FILE: $f -----"
  printf "%s\n" "$HEADER" >> "$OUT_FILE"
  CUR_SIZE=$(get_size "$OUT_FILE")

  # Stream up to 3000 lines safely and split mid-file if needed
  eval "$CLEAN_CMD" | head -n 3000 | while IFS= read -r line; do
    line_size=${#line}
    # +2 accounts for newline spacing
    if (( CUR_SIZE + line_size + 2 > MAX_SIZE_BYTES )); then
      echo "→ Chunk $PART_NUM done ($((CUR_SIZE / 1024)) KB)"
      PART_NUM=$((PART_NUM + 1))
      OUT_FILE="${OUT_DIR}/${OUT_BASENAME}_${PART_NUM}.txt"
      {
        echo "# Rolled repository from: $REPO_DIR"
        echo "# Part $PART_NUM"
        echo ""
      } > "$OUT_FILE"
      CUR_SIZE=$(get_size "$OUT_FILE")
    fi
    printf "%s\n" "$line" >> "$OUT_FILE"
    CUR_SIZE=$((CUR_SIZE + line_size + 2))
  done

  printf "\n\n" >> "$OUT_FILE"
  CUR_SIZE=$(get_size "$OUT_FILE")
done

echo "→ Chunk $PART_NUM done ($((CUR_SIZE / 1024)) KB)"
echo ""
echo "✅ Finished!"
echo "All chunks are under ${MAX_SIZE_KB}KB."
ls -lh "$OUT_DIR"/rolled_part_*.txt