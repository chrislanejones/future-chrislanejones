# Chapter 9: Deployment and operations

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../08-maintenance/README.md) · [Architecture decisions](../../adr/README.md)

## Separate frontend and backend releases

The root README's deployment convention is Vercel previews for pull requests and `main` for the public site. Confirm the actual Vercel project settings before publishing; this repository does not contain a CI workflow that proves that configuration.

Frontend environment variables and Convex environment variables are separate. Choose matching Clerk credentials, JWT issuer and owner allowlists. A frontend build or Git push does not transfer development content or deploy new Convex functions.

For backend API/schema changes, first inspect compatibility with existing records, deploy the required backend changes to the intended deployment, and then release a frontend that calls them. See [ADR-007](../../adr/007-strict-project-category-and-drop-sociallinks-field.md). Routine dependency checks here do not authorize an accidental production data import.

## Before release

1. Confirm branch, working tree and target environments. Preserve unrelated changes.
2. Run the checks in [Testing and dependencies](../08-maintenance/README.md).
3. Review the frontend build output and any peer/audit exceptions.
4. Check the preview's key pages, metadata, sitemap, media and admin access.
5. Publish deliberately, then verify the public URLs. An unmerged local change is not a shipped release.

## Assets and storage

Everything in `public/` ships with the frontend. Recorded loops and audio contribute to deployment size; measure current assets instead of relying on a fixed historic megabyte count. External UploadThing images and Convex resume files are separate stores and are not included in a Git checkout or frontend deployment.

Retain the previous deployment and lockfile for rollback. Backend schema/data changes require their own recovery plan; rolling back the frontend does not roll them back. Do not automatically seed or import production data during a build.

## Operational references

- [Scene capture handoff](../../handoffs/2026-10-15-page-banner-scenes.md)
- [Resume upload decision](../../adr/006-admin-resume-upload.md)
- [Storage boundaries](../../adr/017-media-storage-boundaries.md)
- [Frontend/backend deployment decision](../../adr/020-separate-frontend-and-backend-deployments.md)

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../08-maintenance/README.md) · [Architecture decisions](../../adr/README.md)
