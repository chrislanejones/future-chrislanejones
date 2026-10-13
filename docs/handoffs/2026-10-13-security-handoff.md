# Security handoff: Linux updates, Convex/admin, and injection

Reviewed October 13, 2026 for Chris Lane Jones. Repository: `/home/clj/repo/future-chrislanejones-beach`, branch `design/beach-homepage`. Claude was committing concurrently; observed HEADs ranged from `a625631` to `4a52f16`. The intervening changes concerned blog artwork and presentation, not fixes for the security findings below. Re-read current source before implementing.

**Outcome: the admin backend has meaningful authorization checks, but the site is not ready to call security-clean. Prioritize the executable blog-content pipeline, vulnerable dependencies, and overdue workstation updates.** APT updates, application dependencies, the active Node runtime, Windows/WSL, and hosted services are separate maintenance tasks.

This handoff records an audit, not completed remediation. No system upgrades, dependency upgrades, production mutations, authentication configuration changes, content changes or deployments were performed by this security review. A harmless HTML execution check ran in an isolated local file. Normal unauthenticated queries were used for a small set of read-only backend checks; private response contents and credentials were not printed.

## Quick status and priorities

| Priority | Finding | Evidence | Action |
| --- | --- | --- | --- |
| P1 | Blog HTML can execute JavaScript, including inside the admin editor/preview. | Unsanitized HTML sinks, explicit stored-script execution, and a successful isolated event-handler probe. | Remove content-script execution; use one shared allowlist sanitizer and known widget components. |
| P1 | Installed dependency versions have published advisories. | Full `pnpm audit`: 10 findings, 4 high / 5 moderate / 1 low; production-only audit: 8 findings, 3 high / 4 moderate / 1 low. | Patch Next.js and Sharp first; resolve transitive dependencies and rerun both audits. |
| P1 | Linux workstation has a substantial update backlog. | Cached APT metadata: 147 upgradable packages, 53 candidate rows mentioning a security suite. | Refresh package indexes, review the new simulation, install updates and restart affected processes. |
| P2 | Active Node is an unsupported release, independent of APT's Node. | `node --version` = `v25.2.1`, executable supplied by `fnm`; APT separately has Node 24.18.0 installed. | Move the project and its processes to a supported, patched LTS runtime. |
| P2 | Public writes have length limits but no observed application rate limiting. | Contact creation, comments and likes accept anonymous calls. | Add server-enforced abuse controls and validate record relationships. |
| P2 | Production CSP is report-only and allows inline/eval scripts. | Live response headers and `next.config.mjs`. | After removing executable content, introduce an enforced policy compatible with Next/Clerk/widgets. |
| P2 | Local secrets file is readable by other local users; dev server listens on all interfaces. | `.env.local` mode 0644 with traversable parent directories; Next listens on `*:3010`. | Tighten file permissions and bind the development server to loopback unless network access is deliberately needed. |
| P3 | Admin authorization configuration is duplicated and has development/default fallbacks. | Convex auth helper, issuer configuration and UploadThing router. | Make production settings explicit, centralize policy semantics, and test owner/non-owner/anonymous behavior. |

Priority reflects this application's exposure and remediation order. It is not a new CVSS score. Package advisory severity does not prove that an exploit is reachable in this deployment. No compromise was established by this review.

## 1. Linux and app updates

### Observed host

- Debian GNU/Linux 13, codename `trixie`; `/etc/os-release` reported `DEBIAN_VERSION_FULL=13.5`.
- WSL2 kernel: `6.18.33.2-microsoft-standard-WSL2`.
- `/etc/wsl.conf` enables systemd.
- APT cache timestamp inspected: October 6, 2026. **These counts are from cached metadata, not a freshly refreshed system index.**
- `sudo -n true` reported that a password is required. The system APT index was therefore not refreshed and no packages were installed. Run the sudo commands in an interactive terminal; do not paste a password into a handoff, prompt or command log.
- `apt-get --simulate upgrade`: **147 upgraded, 0 newly installed, 0 removed, 0 not upgraded** against that cache. No held packages were reported.
- `unattended-upgrades` is not installed. `apt-daily.timer` and `apt-daily-upgrade.timer` are active, but those timers alone do not establish that automatic security installation is configured. No `APT::Periodic`/`Unattended-Upgrade` settings were returned by the configuration check.
- `needrestart` is installed.

The 147 count is a package-update count, not 147 vulnerabilities. Likewise, 53 candidates mentioning a security suite is not a CVE count; security fixes can also be incorporated into normal stable updates.

### Representative cached update candidates

| Package | Installed | Cached candidate |
| --- | --- | --- |
| Chromium | 149.0.7827.196-1~deb13u1 | 154.0.8037.92-1~deb13u1 |
| Google Chrome | 150.0.7871.46-1 | 154.0.8037.97-1 |
| OpenSSL | 3.5.6-1~deb13u2 | 3.5.7-1~deb13u3 |
| APT-managed Node.js | 24.18.0-1nodesource1 | 24.21.0-1nodesource1 |
| libc6 | 2.41-12+deb13u3 | 2.41-12+deb13u4 |
| rsync | 3.4.1+ds1-5+deb13u3 | 3.5.0+ds1-0+deb13u1 |
| ImageMagick | 8:7.1.1.43+dfsg1-1+deb13u10 | 8:7.1.1.43+dfsg1-1+deb13u12 |

Browser and media-parser updates matter on a workstation that opens websites and processes downloaded images. The active browser sessions and long-running Node processes need restarting after their relevant updates; replacing an executable on disk does not replace code already loaded in a process. Coordinate this with Claude's active work.

### Maintenance sequence for the next operator

Run from an interactive Linux terminal:

```sh
sudo apt-get update
apt list --upgradable
apt-get --simulate upgrade
sudo apt-get upgrade
apt list --upgradable
sudo needrestart
```

Review the fresh simulation before installation. The prior no-removal result is not a promise about a later package index. Do not substitute an automatic `full-upgrade`, `autoremove`, or reboot for reviewing the actual proposed changes.

For automatic Debian security installation, install and configure `unattended-upgrades`, review its allowed origins and reboot policy, and verify it with a dry run:

```sh
sudo apt-get install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
sudo unattended-upgrade --dry-run --debug
systemctl list-timers apt-daily.timer apt-daily-upgrade.timer
```

The Debian tool supports automatic security/other upgrades; the configured origins determine what it actually installs. Review `/etc/apt/apt.conf.d/50unattended-upgrades` and periodic settings rather than assuming every third-party repository is covered. WSL timers can only do work while the distribution is running. [Debian unattended-upgrades manual](https://manpages.debian.org/trixie/unattended-upgrades/unattended-upgrades.8.en.html)

### Node is a separate update path

The current shell runs **Node 25.2.1 from fnm**, not `/usr/bin/node`. Updating the APT `nodejs` package will not automatically replace that selection. Node's official release page lists the 25 line as EOL and the 24 line as LTS at this review date. [Node release status](https://nodejs.org/en/about/previous-releases)

Use a currently patched supported LTS release compatible with the project and deployment platform; Node 24 is the conservative current choice. For this shell's existing manager:

```sh
fnm install 24
fnm use 24
node --version
command -v node
pnpm --version
```

Pin the agreed runtime in `.node-version` or the project's chosen equivalent, declare the supported range, align CI/hosting, and restart the dev server under that runtime. Avoid changing a global default for unrelated projects without checking their requirements. Pin the intended pnpm version as well; the reviewed shell reports pnpm 10.26.0.

### Windows, WSL and hosted services

APT updates Debian userspace. They do not update the Windows host, Windows-installed browsers/apps, every fnm runtime, the project lockfile, or the hosted Convex platform. In Windows PowerShell, inspect/update WSL separately:

```powershell
wsl --version
wsl --update
```

Apply Windows Update and review separately installed Windows apps. Save running work before any WSL shutdown/restart. No Windows patch inventory or host-firewall audit was performed here. [Microsoft WSL commands](https://learn.microsoft.com/en-us/windows/wsl/basic-commands#update-wsl)

## 2. Dependency advisories and update plan

The checks contacted the package registry through pnpm. Full audit reported **10 advisories**; `--prod` reported **8**. These counts include transitive packages and are not counts of distinct remotely exploitable routes. `pnpm why` confirmed Next.js pulls in Sharp and a PostCSS/source-map-js chain; some other findings are in lint/build tooling.

| Package / issue | Reviewed installed version | Severity | Patched range reported by audit | Reference |
| --- | --- | --- | --- | --- |
| Next.js image optimizer SSRF | 16.3.6 | High | >=16.3.8 for this affected branch | [GHSA-cjq9-62q9-8jv4](https://github.com/advisories/GHSA-cjq9-62q9-8jv4) |
| Next.js cached draft-content isolation | 16.3.6 | Moderate | >=16.3.8 | [GHSA-3w37-wq28-93x7](https://github.com/advisories/GHSA-3w37-wq28-93x7) |
| Next.js self-hosted SSG/ISR cache poisoning | 16.3.6 | Moderate | >=16.3.8 | [GHSA-4jqv-mc3x-m676](https://github.com/advisories/GHSA-4jqv-mc3x-m676) |
| Next.js dev MCP information disclosure | 16.3.6 | Low | >=16.3.8 | [GHSA-39w2-rjm5-chcv](https://github.com/advisories/GHSA-39w2-rjm5-chcv) |
| Next.js metadata-image route disclosure | 16.3.6 | Moderate | >=16.3.8 | [GHSA-f87g-xv8r-7p7x](https://github.com/advisories/GHSA-f87g-xv8r-7p7x) |
| Next.js SSG/ISR content substitution / denial of service | 16.3.6 | Moderate | >=16.3.8 | [GHSA-mcj8-r9mp-w47p](https://github.com/advisories/GHSA-mcj8-r9mp-w47p) |
| Sharp / librsvg memory-safety issue | 0.35.4 | High | >=0.35.5 | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) |
| source-map-js parser denial of service | 1.2.1 | High | >=1.2.2 | [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) |
| braces nested-pattern denial of service | 3.0.3 | High | No fixed version reported in this audit | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) |
| postcss-selector-parser excessive CPU consumption | 6.0.10 | Moderate | >=7.1.6 | [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf) |

**Exposure context:** the Next image advisory requires an attacker-controlled allowed remote URL with the relevant behavior. This project has `remotePatterns` for UploadThing hosts, including a wildcard app-subdomain pattern; narrow to the intended app where feasible. This review did not attempt DNS rebinding or requests to private network destinations. Sharp's advisory has SVG/runtime-specific preconditions; do not translate a dependency match into a claim of demonstrated server RCE. [Next advisory](https://github.com/advisories/GHSA-cjq9-62q9-8jv4), [Sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w)

The code search found no use of Next `draftMode` or `use cache` in the reviewed app. Hosted versus self-hosted behavior and exact image-processing paths still need assessing for each advisory. The fixes should nevertheless be scheduled rather than relying on uncertain non-reachability.

### Proposed dependency work

1. Read this installed Next version's local documentation and the upstream release notes. Use an isolated checkout/build directory so a verification build does not interfere with Claude's running dev server.
2. Upgrade Next and its ESLint config together. `16.3.8` is a verified available patch floor for the listed Next findings; the registry reported `16.4.0` as latest at review time. Choose a supported patched release after checking its notes, not merely the numerically largest version.
3. Ensure the resolved Sharp version is at least `0.35.5`; updating only a top-level manifest is insufficient if the lockfile still resolves an affected nested dependency.
4. Update compatible transitive dependency chains for source-map-js and selector parsing. Prefer upstream parent-package updates. A selector-parser major jump needs compatibility testing; do not blindly override a dependency across major versions.
5. Track the braces advisory against the lint-tool chain. If upstream still has no fix, record reachability, mitigation and an owner/review date instead of inventing a patched version or globally suppressing the advisory.
6. Review ordinary outdated packages separately. For example, Clerk was 7.9.5 versus registry 7.9.15. Outdated is not synonymous with vulnerable. Do not combine unrelated TypeScript, Effect or Motion major migrations with an urgent security patch unless required.

Example patch-floor update, to be executed by the implementing operator after reviewing current state:

```sh
pnpm up next@16.3.8 eslint-config-next@16.3.8
pnpm why sharp source-map-js braces postcss-selector-parser
pnpm audit
pnpm audit --prod
pnpm exec tsc --noEmit --incremental false
pnpm run lint
pnpm exec next build
```

The existing `build` script pipes Next output into grep and can mask the build process's failure status. Fix it to preserve that status, preferably simply `next build`. Until then, a direct `pnpm exec next build` is the trustworthy build command. The fresh TypeScript check in this security review passed; the earlier resume mismatch was no longer present. A production build was not run or claimed as passing.

## 3. Injection: the concrete HTML/JavaScript finding

### Data flow and affected files

| Location | Behavior |
| --- | --- |
| `src/lib/blog-content.ts:7` | HTML passes through; Markdown is parsed with marked. Neither branch applies an allowlist sanitizer. |
| `src/lib/blog-content.ts:17` | `stripScripts` removes matching script tags with a regex. It does not remove event handlers, unsafe URLs or other active HTML. |
| `src/app/blog/[slug]/page.tsx:118` | The result is inserted into server-rendered article HTML. |
| `src/app/blog/[slug]/BlogPostPage.tsx:130` | The client reparses raw rendered content into a template. |
| `src/app/blog/[slug]/BlogPostPage.tsx:131` | Stored external script elements are recreated and appended to the article. |
| `src/app/blog/[slug]/BlogPostPage.tsx:140` | Stored inline script text is executed with `new Function`. |
| `src/app/admin/components/HtmlEditorEnhanced.tsx:42` | Stored/pasted HTML enters the visual editor through `innerHTML`. |
| `src/app/admin/AdminDashboard/BlogPostsTabEnhanced.tsx:681` | Admin preview inserts content directly through `dangerouslySetInnerHTML`. |

Marked explicitly does not sanitize HTML. A Markdown parser is not an HTML security boundary. React's normal text escaping also does not protect content inserted through these explicit HTML APIs. [Marked warning](https://marked.js.org/#usage), [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

### Reproduction and realistic threat model

The actual `renderPostHtml` and `stripScripts` helpers were loaded into a temporary local harness. A harmless image error handler survived processing and set a `data-security-probe` flag when the resulting HTML opened in an isolated browser page. The fixture made no network requests and was not saved to Convex or a blog post. Additional checks found that `javascript:` links and iframe `srcdoc` attributes also survive the current helper. The latter two were preservation checks, not claims of separately demonstrated execution.

**Blog creation/editing is admin-gated. This review did not establish that an anonymous commenter can write a blog body.** The realistic risks are unsafe pasted/imported HTML, a compromised editor account, a future content integration, or a future less-trusted editor role. Opening such content in the admin editor/preview is particularly sensitive because JavaScript executes in an authenticated page's context.

The public comment renderer currently uses normal React text output for comment names and bodies, which is a good protection to preserve. Do not turn comments into unsanitized rich HTML when redesigning the admin or blog.

### Implementation requirements

1. Delete the generic stored-script execution path, including `new Function` and dynamic creation of script tags from article content.
2. Keep interactive articles working through explicitly registered, source-controlled components. The existing `data-stepper`/`STEPPER_CONFIGS` mechanism is a useful starting point: only recognized widget IDs may mount known components.
3. Introduce one maintained HTML sanitization policy, shared by the server article renderer and admin preview. Select a maintained sanitizer that supports the relevant runtimes; do not replace the regex with a longer homemade regex.
4. Define allowed tags, attributes and URL schemes explicitly. Preserve required prose, code blocks, tables, images and approved widget markers. Remove scripts, event attributes, executable URLs, unsafe embeds and unsupported active content. Treat SVG/MathML and arbitrary styles as explicit policy decisions, not automatic passes.
5. Sanitize or constrain rich-text paste and visual-editor insertion. A safe public renderer does not fix an unsafe authenticated preview/editor.
6. If embeds are needed, use a dedicated provider-aware component with restricted destinations and capabilities. Do not store arbitrary executable embed HTML as a shortcut.
7. Render historical content through the new policy too. Inventory existing inline scripts before migration, replace legitimate behavior with components, and preview affected posts before publishing.
8. Keep structured-data serialization separate: `src/lib/structured-data.ts` already escapes `<` before embedding JSON-LD. Preserve that protection.

Acceptance: plain text, Markdown and supported HTML still render; code samples display code without executing it; event-handler and script fixtures cannot run in public pages or admin previews; unknown widget IDs do nothing; valid steppers still mount; historical posts remain readable. Test in an isolated test deployment with synthetic data, not by inserting attack strings into production records.

### SQL, NoSQL and command injection assessment

The reviewed Convex code uses its typed database APIs and validators rather than constructing SQL strings. No SQL-string or shell-command injection path was identified in the inspected server request handlers. That finding is narrower than a guarantee that every future input is safe.

`v.string()` validates a type; it does not establish a safe URL, harmless HTML, a sensible length, or permission to modify a record. Continue validating those semantics on the server. Browser-side `document.execCommand` in the editor is not an operating-system shell command, but allowing arbitrary HTML/link values there still requires the HTML policy above.

## 4. Convex and admin authorization

### Good protections observed

- `convex/authz.ts` uses a server-verified identity and an owner allowlist. It does not authorize arbitrary registered users merely because they are signed in.
- An inventory of the top-level Convex function declarations found **134 functions: 42 public queries, 88 public mutations and 4 internal mutations**. Of the public mutations, **85 contain the admin guard** and the other three are the intentionally public contact/comment/like operations discussed below. No public actions were present in that inventory. HTTP routes were reviewed separately.
- Sensitive reads for contact messages, draft posts, admin comments and the media library call the admin helper. Public blog queries filter to published posts, and public comments omit author email addresses.
- Resume upload/replacement functions are internal mutations. The public resume query exposes the intended download URL.
- `src/providers/ConvexAdminProvider.tsx` uses `ConvexProviderWithAuth` with Clerk tokens. The separate unauthenticated provider on public pages is intentional.
- `src/app/api/uploadthing/core.ts` checks the authenticated user's ID against the owner allowlist and has file-size/count limits.

The local auth-helper test returned false for anonymous and non-owner fixtures and true for an allowlisted owner fixture. Separately, unauthenticated queries to the **locally configured Convex deployment** returned empty lists/zero for five sensitive endpoints: contact messages, unread count, admin posts, admin comments and media. No returned record contents were printed. These checks are consistent with the source guards; they do not replace authenticated owner/non-owner testing or prove production configuration matches the local target.

Convex endpoints are independently reachable; Next middleware is not the database authorization boundary. Keep authorization at the start of each sensitive public backend function. [Convex authentication and authorization](https://docs.convex.dev/auth/overview)

### Improvements to make

1. **Explicit production configuration.** Both the Convex helper and UploadThing have a hardcoded owner fallback; Convex's issuer configuration also falls back to a development Clerk issuer. These fallbacks do not mean everyone is authorized, and this review did not establish which issuer production currently uses. Verify production issuer/audience and owner settings in the respective hosting dashboards without copying their values into this document.
2. **Consistent policy semantics.** Convex and Next have separate environment stores, but should share the parsing/validation contract. Their behavior for an explicitly empty allowlist currently differs. Prefer a deliberately configured, fail-closed production policy and a documented bootstrap procedure. Use issuer-aware identity keys if supporting multiple issuers; with the current single verified issuer, `subject` is already scoped by that verification.
3. **Authorize the admin page itself.** `src/middleware.ts` requires login for admin routes, but the page does not separately reject a signed-in non-owner before rendering the dashboard shell. Backend guards prevent the reviewed privileged operations; add a clear server-side owner check and access-denied view as defense in depth and better UX.
4. **Exercise three principals.** Test anonymous, authenticated non-owner and owner against every mutation and sensitive query. For the first two, ensure a rejected mutation leaves data unchanged. For the owner, verify permitted operations still work. Use test accounts and synthetic records in a test deployment.
5. **Keep maintenance endpoints internal where practical.** Existing public seed/cleanup mutations are guarded, but operational functions without a UI caller can become internal functions to reduce the public surface. Do not remove their authorization merely because their names contain “seed”.
6. **Add missing empty argument validators.** Eleven inventoried declarations lacked explicit `args`, mostly no-input read/seed helpers: `browserLinks.getCategories/seedLinks`, `careerTimeline.getAllEvents/seedTimeline`, `projects.getAll/getFeatured`, and `seo.getAllSEO/getStaleSEOPaths/cleanupStaleSEO/cleanupStaleSEOPublic/seedSEOData`. Add `args: {}` and appropriate return validators. This is contract hardening, not a demonstrated authorization bypass.
7. **Remove misleading obsolete backend-shaped code.** `src/app/admin/effects/settings-effects.ts` defines unguarded-looking Convex query/mutation wrappers outside the deployed `convex/` directory. No callers were found. This is not evidence of an exposed Convex endpoint today; delete or clearly retire the unused duplicate so future refactoring does not copy it over the guarded implementation.

The three `convex/http.ts` GET routes expose SEO, published sitemap data and active redirects. Their wildcard CORS setting is not itself an authorization flaw for deliberately public data. Do not use a narrower CORS header as a substitute for protecting private functions.

## 5. Public forms, likes and abuse controls

Affected functions:

- `convex/contactMessages.ts:58`, `create`.
- `convex/blogPosts.ts:264`, `addComment`.
- `convex/blogPosts.ts:195`, `toggleLike`.

Length caps exist, and comments begin unapproved. However, no application-enforced rate limiter/challenge verification was found for these calls. Calling Convex directly bypasses form UI restrictions. Many small valid requests can still create spam, consume storage/resources, or inflate engagement.

Required follow-up:

1. Enforce abuse controls at the server entry point. If a challenge is verified by an HTTP action/server route, make its database-write helper internal so an attacker cannot bypass verification by calling a public mutation directly.
2. Add bounded per-principal and overall budgets appropriate to anonymous traffic. Do not treat a client-supplied IP, UUID, timestamp, email or `userIdentifier` as authenticated identity. Use trusted server context when available; document the limitations of anonymous rate limiting.
3. Validate trimmed required values, sensible email syntax and allowed contact sources. Length caps are necessary but do not reject empty/whitespace-only submissions.
4. Before adding comments/likes, confirm the referenced post exists and is published. Before accepting a reply, confirm its parent exists and belongs to that post. `v.id` validates the identifier's type, not these relationships.
5. Likes currently trust a random localStorage string. A caller can choose many such strings; count them as low-trust engagement unless the identity design changes. Do not use these identifiers for admin authorization.
6. Paginate administrative message/comment/media lists and limit expensive public reads. Avoid unbounded `.collect()` on collections an anonymous caller can grow.

Acceptance: a test burst hits a controlled limit, blocked requests do not write records, normal submissions still work, invalid/missing/unpublished post relationships are rejected, and moderation/private emails remain protected. No spam or load test was run against production.

## 6. Browser policy and uploads

### Production headers observed

A normal unauthenticated GET to `https://www.chrislanejones.com/` returned HTTP 200 with:

- HSTS: `max-age=63072000`.
- `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- A restrictive Permissions-Policy for several unused capabilities.
- **Content-Security-Policy-Report-Only**, with no enforced `Content-Security-Policy` header.

The policy includes `unsafe-inline` and `unsafe-eval` for scripts. Report-only does not block violations, and no `report-to`/`report-uri` destination was present in the reviewed policy. It should not be described as an enforced XSS defense or assumed to produce centrally collected reports. [MDN report-only behavior](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy-Report-Only)

Remove the stored-script dependency first. Then implement an appropriate nonce/hash strategy using this Next version's documentation, inventory third-party scripts, monitor a report policy and enforce a tested policy. Simply renaming the current header leaves broad inline/eval allowances. Keep development exceptions separate from production requirements and account for any static-rendering/cache implications.

The anonymous HTTP client received 404 for `/admin`; this can be compatible with authentication protection. It is not proof that a legitimate owner's interactive sign-in flow is healthy. Test that separately.

### Upload and URL rules

Owner checks and size/count limits already exist. Confirm the accepted media formats, how SVG or other active formats are handled, storage delivery headers, and whether the image-processing pipeline is patched. Prefer passive raster formats for ordinary blog covers. Do not turn on local-IP image fetching or broaden remote image hosts to fix a broken image.

Validate media/link/redirect destinations according to their purpose. For public navigation, allow expected local paths and approved URL schemes. For redirects, reject invalid destinations and unsupported status codes. These fields are currently admin-controlled; this is hardening against mistakes/imported content and future role expansion, not a demonstrated anonymous open-redirect injection.

The current resume download URL is generated by `ctx.storage.getUrl` from an internal-managed storage record, not directly taken from a URL query parameter. Do not mislabel that handler as a confirmed arbitrary-URL SSRF vulnerability. Retain that constrained source if refactoring it.

## 7. Local secrets and development exposure

- `.env.local` is Git-ignored, which is correct, but mode **0644** allows reads by other local users when traversing its parent directories; those directories were **0755**. Tighten the existing file to its owner:

  ```sh
  chmod 600 .env.local
  ```

  This does not isolate programs running as the same user. It also does not rotate credentials or remove a previously committed secret.

- A filename/content-pattern check across 529 currently tracked files found no matching private-key, Clerk secret-key, GitHub-token, AWS-key-ID or OpenAI-key patterns. No tracked `.env`/private-key filenames matched the check. This limited check excluded binary/large files and did not scan Git history, deployment settings or every credential format; it is not a comprehensive secret-leak guarantee.
- Keep server secrets out of `NEXT_PUBLIC_*`. Public Convex URLs, Clerk publishable keys and analytics project keys are not automatically secret leaks; their public nature makes backend authorization and abuse controls essential.
- The Next development server listens on **all interfaces at port 3010**. Actual reachability depends on WSL networking and Windows firewall settings, which were not established here. Bind to loopback for local-only work, for example `pnpm exec next dev --hostname 127.0.0.1 --port 3010`, when restarting it. Do not terminate Claude's active server during an audit.
- Apply account MFA/passkeys, least-privilege deployment access, protected production credentials and recoverable backups through the relevant service settings. Their current state was not inspected; this is an operator verification list, not a claim that they are disabled.

## 8. Definition of done for the implementing agent

1. Preserve unrelated work and record the current commit before changes. Work in small reviewable changes: runtime/patches, safe content rendering, abuse controls, then policy hardening.
2. Record fresh APT status after a successful refresh; install reviewed updates and confirm affected processes use updated binaries. Record the chosen supported Node runtime separately from the APT package.
3. Update and commit both manifest and pnpm lockfile. Rerun full and production audits; document any remaining advisory with actual reachability, mitigation and follow-up date. Do not blindly apply a major-version “fix everything” operation.
4. Make typecheck, lint and the direct build succeed. Do not disable strict TypeScript, set `ignoreBuildErrors`, or suppress security findings merely to get a green command.
5. Add focused regression tests for stored HTML, Markdown raw HTML, unsafe URLs, admin preview/paste, known widgets, and three-principal backend authorization. Test rejected writes leave no side effects.
6. Verify existing content, media uploads, resume downloads, contact messages, comment moderation and sign-in still work in a test deployment.
7. Confirm the intended production issuer/allowlist, security headers, deployed package versions and deployment target after release. A local green build does not verify production configuration.
8. Keep an explicit rollback path and a recoverable database/content backup before content migrations. Exercise restoration with synthetic/test data. Do not use production records as security test fixtures.

## Audit coverage and limits

Completed: source review of authorization, public inputs, stored HTML rendering, upload entry points, relevant HTTP handlers and headers; Convex function inventory; current lockfile advisory checks; cached APT upgrade simulation; runtime/service/listener checks; isolated HTML execution proof; local auth-helper checks; five anonymous backend read checks; limited tracked-file secret-pattern review; and a fresh TypeScript check.

Not established: full production dependency/runtime inventory, real non-owner/owner account tests, hosted-service IAM/MFA configuration, complete Git-history secret scanning, Windows patch/firewall state, externally reachable WSL ports, backup restoration, comprehensive penetration testing, or exploitation of the dependency advisories. No full-system or application security certification is implied.

This security handoff is the source for these findings. The companion CSS/admin design guide is `Here-I-Am-Rock-You-like-a-hurricaneeeeeeee.md`; do not confuse the new page-editor proposal there with an implemented security-reviewed CMS.
