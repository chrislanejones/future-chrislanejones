// @vitest-environment node
import { describe, expect, test } from "vitest";
import { renderPostHtml, sanitizePostHtml } from "./blog-content";

// Anything that can run code must come out inert.
describe("sanitizePostHtml blocks active content", () => {
  test.each([
    ["script tag and its text", "<p>hi</p><script>alert(1)</script>", /<script|alert/i],
    ["event handler", '<img src="/a.webp" onerror="alert(1)">', /onerror/i],
    ["javascript: link", '<a href="javascript:alert(1)">x</a>', /javascript:/i],
    ["mixed-case javascript: link", '<a href="JaVaScRiPt:alert(1)">x</a>', /javascript:/i],
    ["entity-encoded javascript: link", '<a href="&#106;avascript:alert(1)">x</a>', /avascript:/i],
    ["javascript: link with leading space", '<a href=" javascript:alert(1)">x</a>', /javascript:/i],
    ["javascript: link split by an encoded tab", '<a href="java&#x09;script:alert(1)">x</a>', /href|script:/i],
    ["event handler on details", "<details open ontoggle=alert(1)>x</details>", /ontoggle|alert/i],
    ["markup inside an attribute value", '<p title="</p><img src=x onerror=alert(1)>">x</p>', /<img/i],
    ["data: link", '<a href="data:text/html,<script>alert(1)</script>">x</a>', /data:|script/i],
    ["iframe", '<iframe src="https://evil.example"></iframe>', /iframe|evil/i],
    ["srcdoc", '<iframe srcdoc="<script>alert(1)</script>"></iframe>', /srcdoc|script/i],
    ["svg onload", '<svg onload="alert(1)"><script>alert(2)</script></svg>', /svg|onload|alert/i],
    ["math href", '<math><mi xlink:href="javascript:alert(1)">x</mi></math>', /math|javascript/i],
    ["object and embed", '<object data="x.swf"></object><embed src="x.swf">', /object|embed/i],
    ["form controls", '<form action="/x"><input name="a"><button formaction="/y">go</button></form>', /form|input|button/i],
    ["style tag", "<style>body{display:none}</style><p>x</p>", /style|display/i],
    ["style attribute", '<div style="position:fixed;inset:0">x</div>', /style|fixed/i],
    ["link, meta, base", '<link rel="stylesheet" href="/x.css"><meta http-equiv="refresh" content="0;url=https://evil.example"><base href="https://evil.example/">', /link|meta|base|evil/i],
    ["noscript mutation", '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript>', /onerror/i],
    ["protocol-relative image", '<img src="//evil.example/x.png">', /evil/i],
  ])("%s", (_name, input, forbidden) => {
    expect(sanitizePostHtml(input)).not.toMatch(forbidden);
  });

  test("drops id and name, which can clobber page globals", () => {
    const out = sanitizePostHtml('<div id="cookie" name="location" class="note">x</div>');
    expect(out).toBe('<div class="note">x</div>');
  });
});

// What posts actually use must survive.
describe("sanitizePostHtml keeps post content", () => {
  test("widget markers and classes", () => {
    expect(sanitizePostHtml('<div class="stepper" data-stepper="build">x</div>')).toBe('<div class="stepper" data-stepper="build">x</div>');
  });

  test("tables, code and quotes", () => {
    const html = "<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table><pre><code>let x = 1;</code></pre><blockquote>q</blockquote>";
    expect(sanitizePostHtml(html)).toBe(html);
  });

  test("https links and images, data: images", () => {
    expect(sanitizePostHtml('<a href="https://example.com/a">a</a>')).toBe('<a href="https://example.com/a">a</a>');
    expect(sanitizePostHtml('<img src="https://example.com/a.webp" alt="A">')).toBe('<img src="https://example.com/a.webp" alt="A" />');
    expect(sanitizePostHtml('<img src="data:image/png;base64,iVBORw0KGgo=" alt="">')).toContain("data:image/png");
  });

  test("new-tab links get noopener noreferrer", () => {
    expect(sanitizePostHtml('<a href="https://example.com" target="_blank">x</a>')).toBe('<a href="https://example.com" target="_blank" rel="noopener noreferrer">x</a>');
  });
});

describe("renderPostHtml", () => {
  test("renders Markdown and sanitizes it", () => {
    const out = renderPostHtml("**bold** text\n\n<script>alert(1)</script>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).not.toMatch(/script|alert/i);
  });

  test("passes HTML posts through the same allowlist", () => {
    expect(renderPostHtml('<p onclick="x()">hi</p>')).toBe("<p>hi</p>");
  });

  test("empty content", () => {
    expect(renderPostHtml(undefined)).toBe("");
    expect(renderPostHtml("")).toBe("");
  });
});
