# ADR-006: The owner can replace the resume from the admin panel (extends ADR-002)
Date: 2026-10-14   Status: proposed

## Context
ADR-002 moved the resume into Convex storage, but the only way to update it was
`scripts/upload-resume.sh`. That needs the Convex CLI logged in to prod, plus
`jq` and `curl`, and it uploads the PDF and Word file in two steps, so a failure
halfway leaves a mismatched pair live. ADR-002 deferred an admin upload UI. The
parking-lot item for it was resolved on 10-14-2026 (PR #24).

## Decision
`convex/resume.ts` adds three public functions, all gated by the owner checks in
`convex/authz.ts`. `generateAdminUploadUrl` (mutation, `requireAdmin`) returns a
storage upload URL. `publish` (mutation, `requireAdmin`) reads the uploaded
blob's `_storage` record and rejects it if `size` is over 10 MB or the recorded
`contentType` doesn't match the format (`application/pdf`, or the `.docx`
OOXML type). A rejected blob is deleted, and `publish` returns `{ error }`
instead of throwing. A thrown mutation rolls back everything it did, including
its own `storage.delete`, so a throw would leave the rejected file in storage.
`getAdminStatus` (query, `isAdmin`, returns `[]` to anyone else) lists the live
file, size, date and URL per format. `publish` and the CLI path's `setFile` both
go through one `replaceFile()` helper, which points the format at the new blob
and deletes the old one. The UI is `src/app/admin/components/ResumeFilesPanel.tsx`,
mounted in the Career Timeline tab (`CareerTimelineTabEnhanced.tsx`). Each
format uploads and publishes on its own.

## Consequences
+ A resume update is a file picker in `/admin`, no CLI session, and each format
  is replaced independently. The CLI script still works.
+ 3 convex-test cases in `convex/resume.test.ts` cover non-owners being
  refused, replace-and-delete-old, and an over-10 MB file actually being deleted.
- A new owner-gated write surface on a public file. If `ADMIN_USER_IDS` is wrong,
  the wrong person can replace the resume, not just read the dashboard.
- The type check trusts the `Content-Type` the browser sent with the upload.
  There is no magic-byte check, so a mislabeled file passes, and a blob with no
  recorded type is accepted. Only the 10 MB size cap always applies.
- Publishing on upload means there is no preview or undo. The old blob is
  deleted the moment the new one is accepted.

## Alternatives rejected
- Keep it CLI-only. Works, but every update needs a prod-logged-in terminal and
  risks the half-finished two-step upload.
- UploadThing (already used for media). A second storage path for one pair of
  files, and the download route already reads from Convex (ADR-002).

## Pre-mortem
It is six months later and this decision was a mistake. Most likely reason: the
panel made replacing the resume so easy that a wrong file went live. A browser
labeled a stale or wrong document `application/pdf`, `publish` accepted it,
and the previous good copy was already deleted, so the fix meant finding the
old file locally and re-uploading. A quieter failure: a future edit makes
`publish` throw after deleting, and rejected uploads start piling up in storage
because the rollback undid the delete.
Early warning sign to watch for: `_storage` holding more than two blobs that no
`resumeFiles` row points at, or the downloaded resume's size changing without a
matching upload.
