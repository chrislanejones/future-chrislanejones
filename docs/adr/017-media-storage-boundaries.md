# ADR-017: Keep uploaded images, resume storage and versioned scene assets distinct

Date: 2026-10-21 · Status: draft

Retrospective record for the beach version's current working tree. The date is when this record was written, not an asserted original adoption or approval date.

## Context

The beach site serves uploaded editorial images, replaceable resume documents and reproducible scene recordings. These have different delivery and lifecycle needs.

## Decision

Retain UploadThing for image bytes and Convex `media` records for URLs/metadata. Retain Convex file storage for PDF/DOCX resumes with same-origin download routes. Keep scene stills/loops, fonts and other intentional static assets in `public/`. Owner checks gate uploads. Media catalog deletion currently removes only its Convex row; it is not an UploadThing deletion operation.

## Consequences

Editorial image uploads do not enlarge Git, resume replacement avoids new committed documents, and scene assets ship with the frontend. Multiple stores require separate cleanup and recovery. A successful file upload followed by a failed catalog write can leave an orphan. Static video revisions still grow repository history.

## Alternatives considered in this record

Putting every uploaded image in Git makes editorial changes deployments. Moving all assets to one store would require URL and lifecycle migration beyond documenting this beach version.

## Revisit when

Orphaned media or static asset history becomes costly, or a unified deletion/backup workflow is requested.

## Evidence

[Upload router](../../src/app/api/uploadthing/core.ts), [media drawer](../../src/app/admin/components/MediaDrawer.tsx), [media functions](../../convex/media.ts), [resume route](../../src/app/career-and-resume/download/[kind]/route.ts), [ADR-002](002-resume-in-convex-storage.md), [ADR-006](006-admin-resume-upload.md).

[Decision index](INDEX.md) · [Chapter 10](README.md)
