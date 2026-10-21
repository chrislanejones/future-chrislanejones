# Chapter 5: Content and media

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../04-design-and-scenes/README.md) · [Next chapter](../06-security/README.md)

## Editorial content

Convex tables store projects, posts, conferences, career entries, clients, browser links, navigation, page headers, SEO, gallery content and site settings. Manage supported sections through `/admin` with an allowed Clerk identity. [schema.ts](../../../convex/schema.ts) is the current table contract; generated bindings provide client types.

Local files remain intentional: project presentation, fallback records, conference photos, icon mappings and Browser Tabs grouping are versioned code. An admin category change does not necessarily change a presentation override. Browser Tabs preserves stored categories and groups selected sites through [link-groups.ts](../../../src/app/browser-tabs/link-groups.ts).

## Images: two systems, two responsibilities

The owner-gated [UploadThing route](../../../src/app/api/uploadthing/core.ts) accepts images. UploadThing holds the file bytes and serves their URLs. The admin [MediaDrawer](../../../src/app/admin/components/MediaDrawer.tsx) saves URLs, filenames and metadata to Convex after upload.

The `media` table is a catalog, not a second copy of those images. Its current deletion mutation deletes the database row only; it does not call UploadThing to delete the stored file. Treat orphan-file cleanup as a separate explicit operation. Favicons on saved links are their own URL fields and may point to external sites or a fallback icon.

Static brand assets, scene recordings and fonts are versioned under `public/`. A new external image host may also need a Next Image allowlist entry. Ordinary favicon `<img>` elements use the CSP image policy rather than Next Image optimization.

## Resume files

PDF and DOCX resume files live in Convex storage, referenced by `resumeFiles`. The same-origin download route streams the selected file under a readable filename. Replacing a resume can delete the prior storage object; resume binaries should not be committed to Git. Use the admin upload workflow described by [ADR-006](../../adr/006-admin-resume-upload.md). Inspect [upload-resume.sh](../../../scripts/upload-resume.sh) carefully before use because it targets production.

## Blog bodies

[blog-content.ts](../../../src/lib/blog-content.ts) parses Markdown with Marked and sanitizes HTML with sanitize-html. Stored post content is not trusted executable code. Interactive article behavior is implemented in trusted application components. See [ADR-008](../../adr/008-sanitize-blog-html-with-sanitize-html.md).

## Empty databases and fallbacks

Cloning the repository does not clone content or storage. Admin seed controls cover supported sections; seed/import operations must target the intended deployment and avoid duplicate records. Some frontend sections have local fallback content, while others show an empty state. Do not treat a fallback as evidence that a backend write succeeded.

---

[Book contents](../../README.md) · [Project home](../../../README.md) · [Previous chapter](../04-design-and-scenes/README.md) · [Next chapter](../06-security/README.md)
