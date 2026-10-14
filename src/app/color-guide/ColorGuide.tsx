"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { ArrowDown, ArrowLeftRight, Check, Copy, Download, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setTheme, useTheme } from "@/lib/theme-store";
import { contrastRatio } from "@/lib/color-contrast";
import styles from "./color-guide.module.css";

const colors = [
  { token: "--coast-base", name: "Canvas", use: "The space around everything." },
  { token: "--coast-panel", name: "Surface", use: "Quiet separation for content." },
  { token: "--coast-soft", name: "Sea mist", use: "Selected rows and soft emphasis." },
  { token: "--coast-ink", name: "Ink", use: "Headlines and everyday reading." },
  { token: "--coast-muted", name: "Secondary ink", use: "Supporting text, still readable." },
  { token: "--coast-accent", name: "Coastal blue", use: "Actions, links, and focus." },
  { token: "--coast-on-accent", name: "On blue", use: "Text on the action color." },
  { token: "--coast-line", name: "Quiet line", use: "Decorative dividers, not input outlines." },
  { token: "--coast-control-line", name: "Control edge", use: "A stronger outline for controls." },
] as const;

function readPalette() {
  const node = document.querySelector("[data-color-guide]");
  if (!node) return "{}";
  const computed = getComputedStyle(node);
  return JSON.stringify(Object.fromEntries(colors.map(({ token }) => [token, computed.getPropertyValue(token).trim()])));
}

function subscribePalette(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  callback();
  return () => observer.disconnect();
}

export function ColorGuide() {
  const theme = useTheme();
  const serialized = useSyncExternalStore(subscribePalette, readPalette, () => "{}");
  const palette: Record<string, string> = JSON.parse(serialized);
  const [foreground, setForeground] = useState<string>("--coast-ink");
  const [background, setBackground] = useState<string>("--coast-base");
  const [notice, setNotice] = useState("");
  const ratio = contrastRatio(palette[foreground] ?? "", palette[background] ?? "");
  const ready = Object.keys(palette).length > 0;

  async function copy(value: string, label: string) {
    try { await navigator.clipboard.writeText(value); setNotice(`${label} copied.`); }
    catch { setNotice("Copy is unavailable in this browser. Select the visible value to copy it manually."); }
  }

  function download() {
    const css = `/* Coastal palette: ${theme}. Source: globals.css */\n[data-coastal-theme] {\n${colors.map(({ token }) => `  ${token}: ${palette[token]};`).join("\n")}\n}\n`;
    const url = URL.createObjectURL(new Blob([css], { type: "text/css" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `coastal-${theme}.css`; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${theme === "dark" ? "Dark" : "Light"} palette downloaded.`);
  }

  return (
    <div className={styles.guide} data-color-guide>
      <header className={styles.hero}>
        <p className={styles.kicker}>Chris Lane Jones / Color & type</p>
        <h1>A little blue.<br />A lot of clarity.</h1>
        <p className={styles.intro}>A coastal palette that feels like the site, with readable type and color choices you can check.</p>
        <div className={styles.actions}>
          <Button asChild variant="primary" round><a href="#palette">Explore the palette <ArrowDown size={18} aria-hidden="true" /></a></Button>
          <Button variant="secondary" round onClick={() => setTheme(theme === "dark" ? "light" : "dark")} disabled={!ready}>
            {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            {theme === "dark" ? "Try light mode" : "Try dark mode"}
          </Button>
        </div>
      </header>

      <section className={styles.balance} aria-labelledby="balance-title">
        <div className={styles.proportions} aria-label="Suggested color proportions: 60 percent canvas, 30 percent secondary surfaces, 10 percent accent">
          <div className={styles.sixty}><span>60</span><span>Canvas</span></div>
          <div className={styles.thirty}><span>30</span><span>Surface</span></div>
          <div className={styles.ten}><span>10</span><span>Blue</span></div>
        </div>
        <div className={styles.balanceCopy}><h2 id="balance-title">Room to breathe. Blue where it counts.</h2><p>Use 60–30–10 as a starting point for visual balance. Give the page a calm canvas, group content with softer surfaces, and save blue for actions and emphasis.</p><p>The proportions are a design guideline. Contrast depends on the two colors touching, not how much of each color you use.</p></div>
      </section>

      <section id="palette" className={styles.section} aria-labelledby="palette-title">
        <div className={styles.sectionHead}><h2 id="palette-title">One palette. Shared everywhere.</h2><p>These values come directly from the site’s CSS tokens. Switch the theme to see their counterparts.</p></div>
        <div className={styles.swatches}>
          {colors.map((color) => <article key={color.token} className={styles.swatch}>
            <div className={styles.paint} style={{ backgroundColor: `var(${color.token})` }} aria-hidden="true" />
            <div className={styles.swatchTitle}><h3>{color.name}</h3><Button variant="ghost" size="icon" aria-label={`Copy ${color.name} color`} disabled={!ready} onClick={() => copy(palette[color.token], color.name)}><Copy size={18} aria-hidden="true" /></Button></div>
            <p className={styles.hex}>{palette[color.token]?.toUpperCase() ?? "Loading…"}</p>
            <p>{color.use}</p><code>{color.token}</code>
          </article>)}
        </div>
        <Button variant="secondary" round disabled={!ready} onClick={download}><Download size={18} aria-hidden="true" /> Download this palette</Button>
        <p className={styles.notice} role="status">{notice}</p>
      </section>

      <section id="contrast" className={styles.section} aria-labelledby="contrast-title">
        <div className={styles.sectionHead}><h2 id="contrast-title">Good neighbors make readable colors.</h2><p>Choose a foreground and a background. The result uses WCAG’s contrast calculation for opaque sRGB colors.</p></div>
        <div className={styles.checker}>
          <div className={styles.preview} style={{ "--preview-ink": `var(${foreground})`, "--preview-base": `var(${background})` } as CSSProperties}>
            <span className={styles.specimen}>Aa</span><p className={styles.sampleTitle}>A clearer view.</p><p>Small text should be easy to read, too. This is your selected color pairing.</p>
          </div>
          <div className={styles.checkerControls}>
            <div className={styles.selects}>
              <div><label htmlFor="contrast-foreground">Text color</label><select id="contrast-foreground" value={foreground} onChange={(event) => setForeground(event.target.value)}>{colors.map(({ token, name }) => <option value={token} key={token}>{name}</option>)}</select></div>
              <div><label htmlFor="contrast-background">Background</label><select id="contrast-background" value={background} onChange={(event) => setBackground(event.target.value)}>{colors.map(({ token, name }) => <option value={token} key={token}>{name}</option>)}</select></div>
            </div>
            <Button variant="ghost" onClick={() => { setForeground(background); setBackground(foreground); }}><ArrowLeftRight size={18} aria-hidden="true" /> Swap colors</Button>
            <div aria-live="polite" aria-atomic="true"><p className={styles.ratio}>{ratio === null ? "…" : `${ratio.toFixed(2)}:1`}</p><p>{ratio === null ? "Reading the palette…" : ratio >= 4.5 ? "Passes AA for normal text" : "Does not pass AA for normal text"}</p>
              <ul className={styles.results}><li>Normal text / 4.5:1 <strong>{ratio === null ? "…" : ratio >= 4.5 ? "Pass" : "Fail"}</strong></li><li>Large text / 3:1 <strong>{ratio === null ? "…" : ratio >= 3 ? "Pass" : "Fail"}</strong></li><li>AAA normal text / 7:1 <strong>{ratio === null ? "…" : ratio >= 7 ? "Pass" : "Fail"}</strong></li></ul>
            </div>
          </div>
        </div>
        <p className={styles.footnote}>Large text means at least 24 CSS pixels, or about 18.67 pixels when bold. Pass/fail uses the unrounded ratio. This checker does not certify the whole website. <a href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">Read the WCAG guidance</a>.</p>
      </section>

      <section className={styles.section} aria-labelledby="type-title">
        <div className={styles.sectionHead}><h2 id="type-title">The font already fits.</h2><p>Keep TT Interphases Pro. Three primary size roles, fluid scaling, and the existing 400, 600, and 700 weights are enough for a clear hierarchy.</p></div>
        <div className={styles.typeSamples}><div><span>Display</span><p className={styles.typeDisplay}>Make space.</p><code>--type-display</code></div><div><span>Heading</span><p className={styles.typeHeading}>A new perspective.</p><code>--type-heading</code></div><div><span>Body</span><p className={styles.typeBody}>Comfortable reading starts with room between the lines. Keep body copy around 16–18 pixels and give each paragraph a sensible line length.</p><code>--type-body</code></div></div>
        <p className={styles.footnote}>These are the new shared roles. Older pages still use the legacy scale while they are migrated.</p>
      </section>

      <section className={styles.mobileSection} aria-labelledby="mobile-title">
        <div><h2 id="mobile-title">A smaller screen.<br />The same clear priorities.</h2><p>One content column. Comfortable edges. Controls you can reach. Open the menu on your phone to try the new grouped navigation.</p></div>
        <ul className={styles.mobileRules}><li><Check aria-hidden="true" /><span><strong>Start with the work.</strong> Lead with the introduction and main action, then projects, writing, and personal content.</span></li><li><Check aria-hidden="true" /><span><strong>Keep the reading comfortable.</strong> Use 16–24px page gutters and avoid shrinking labels just to fit another column.</span></li><li><Check aria-hidden="true" /><span><strong>Make room for fingers.</strong> Aim for 44–48px controls. Keep close and contact actions easy to find.</span></li><li><Check aria-hidden="true" /><span><strong>Expand only what you need.</strong> Group menu links under clear labels; keep the active page marked with more than color.</span></li></ul>
      </section>
      <footer className={styles.guideFooter}><p>Keep the blue. Refine the pairings. Reuse the components.</p><a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">Non-text contrast guidance</a></footer>
    </div>
  );
}
