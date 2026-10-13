# ADR-002: The downloadable resume moves out of git into Convex file storage
Date: 2026-10-13   Status: draft

## Context
The resume (PDF + Word) lived in `public/career-files/`, so every version ever
committed sat in the public GitHub and Codeberg history, and each one carries
Chris's phone number and email. Deleting the files from `main` does nothing
for history. As long as the resume ships through git, every update adds another
copy that can never be taken back.

## Decision
The files live in Convex file storage, with one row per format in a
`resumeFiles` table (`kind` "pdf" | "docx", `storageId`, `filename`, `updatedAt`,
indexed `by_kind`). `convex/resume.ts` exposes one public query, `getDownload`,
and two internal mutations, `generateUploadUrl` and `setFile`, which are
reachable only from the CLI. `setFile` deletes the blob it replaces.
`src/app/career-and-resume/download/[kind]/route.ts` streams the file from
chrislanejones.com under a readable filename: the PDF opens inline, Word
downloads as an attachment, and the CDN caches it for 60s (`s-maxage=60`).
`scripts/upload-resume.sh` pushes a new pair to prod, and `.gitignore` blocks
`*[Rr]esume*.pdf` / `.docx`. Separately, git history is being rewritten with
`git filter-repo` to purge the old files. Chris runs that force-push himself.

## Consequences
+ The resume stops landing in git. New versions replace the old blob instead of
  piling up in history, and `.gitignore` catches an accidental re-add.
+ Downloads stay on chrislanejones.com with a clean filename, and the site
  doesn't serve a convex.site link.
- A resume update no longer ships with `git push`. It takes
  `scripts/upload-resume.sh` against prod, which needs the Convex CLI logged in,
  plus `jq` and `curl`.
- The download now depends on Convex being up, and each CDN miss makes the
  Next route fetch the full blob again. Old `/career-files/*Resume*` URLs 404.
- The script uploads the PDF and the Word file in two separate steps, so a
  failure halfway through leaves prod serving a mismatched pair.

## Alternatives rejected
- Keep the files in `/public`. Every update leaks another copy into git.
- UploadThing (already used for media). It works, but it adds a second storage
  path just for one pair of files.
- A Convex HTTP action serving the file. That serves from the convex.site
  domain instead of chrislanejones.com.
- An admin upload UI. Deferred for now, since the CLI script covers one update
  every few months.

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason: the
leak it was meant to close stayed open. `filter-repo` only rewrites the copies
Chris controls. GitHub can keep old commits reachable by SHA, and forks,
clones, and caches still hold the files. Meanwhile the resume is still a public
download with the same phone number on it. So this took on a deploy step and a
runtime dependency without making the number any less public. The win is
"no new copies in git," not "the number is private," and that gets lost.
Early warning sign to watch for: an old resume commit SHA that still opens on
github.com or codeberg.org after the force-push, or a resume PDF/DOCX showing
up in `git log --all -- '*esume*'`.
