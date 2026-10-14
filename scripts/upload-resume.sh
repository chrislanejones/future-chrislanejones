#!/usr/bin/env bash
# Upload a new resume to Convex storage (prod). The resume never goes in git.
#
#   scripts/upload-resume.sh path/to/resume.pdf path/to/resume.docx
#
# Files are published as Chris_Lane_Jones_Resume.{pdf,docx}; the previous
# blobs are deleted by resume:setFile.
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "usage: $0 <resume.pdf> <resume.docx>" >&2
  exit 1
fi

upload() {
  local kind="$1" file="$2" type="$3"
  local url id
  url=$(pnpm exec convex run --prod resume:generateUploadUrl | jq -r .)
  id=$(curl -sS -X POST -H "Content-Type: $type" --data-binary @"$file" "$url" | jq -r .storageId)
  pnpm exec convex run --prod resume:setFile \
    "{\"kind\":\"$kind\",\"storageId\":\"$id\",\"filename\":\"Chris_Lane_Jones_Resume.$kind\"}"
  echo "$kind -> $id"
}

upload pdf "$1" application/pdf
upload docx "$2" application/vnd.openxmlformats-officedocument.wordprocessingml.document
