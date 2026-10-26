/**
 * Colour themes. The whole UI is painted from a handful of CSS variables
 * (HSL channels, e.g. "340 80% 98%") that Tailwind's `cream-*` /
 * `espresso-*` / `surface` / `shade` colours and globals.css read.
 *
 *   cream-*     page background tones
 *   espresso-*  ink: 100 (hover) … 500 (muted text) … 800 (headings)
 *   surface     cards, inputs, pills
 *   shade       shadows
 *   glow-a/b    soft ambient glows behind the content
 *
 * The default (Beyaz) values live in globals.css under :root; picking a
 * theme overrides them on <html>.
 */

export interface Theme {
  id: string;
  name: string;
  dark?: boolean;
  vars: Record<string, string>;
  /** Swatch on the picker */
  swatch: string;
  swatchShadow: string;
  /** Browser UI colour (<meta name="theme-color">) */
  meta: string;
}

export const THEMES: Theme[] = [
  {
    id: "siyah",
    name: "Siyah",
    dark: true,
    vars: {
      "--cream-50": "240 6% 6%",
      "--cream-100": "240 5% 8.5%",
      "--cream-200": "240 5% 11%",
      "--espresso-100": "240 4% 16%",
      "--espresso-200": "240 4% 24%",
      "--espresso-300": "240 4% 42%",
      "--espresso-500": "240 5% 64%",
      "--espresso-600": "240 6% 78%",
      "--espresso-700": "240 8% 88%",
      "--espresso-800": "240 10% 96%",
      "--surface": "240 5% 13%",
      "--shade": "0 0% 0%",
      "--glow-a": "240 6% 30%",
      "--glow-b": "240 5% 18%",
    },
    swatch: "radial-gradient(circle at 32% 28%, #4a4a50 0%, #17171a 55%, #050506 100%)",
    swatchShadow: "0 10px 22px -8px rgb(0 0 0 / 0.55)",
    meta: "#0e0e10",
  },
  {
    id: "beyaz",
    name: "Beyaz",
    vars: {
      "--cream-50": "0 0% 100%",
      "--cream-100": "220 14% 97%",
      "--cream-200": "220 13% 94%",
      "--espresso-100": "220 14% 95%",
      "--espresso-200": "220 13% 87%",
      "--espresso-300": "220 10% 74%",
      "--espresso-500": "220 7% 44%",
      "--espresso-600": "220 9% 30%",
      "--espresso-700": "220 12% 18%",
      "--espresso-800": "220 16% 10%",
      "--surface": "0 0% 100%",
      "--shade": "220 25% 10%",
      "--glow-a": "220 14% 88%",
      "--glow-b": "220 20% 94%",
    },
    swatch: "radial-gradient(circle at 32% 28%, #ffffff 0%, #f6f7f9 55%, #e4e6ea 100%)",
    swatchShadow: "0 10px 22px -8px rgb(30 35 45 / 0.28)",
    meta: "#ffffff",
  },
  {
    id: "pembe",
    name: "Pembe",
    vars: {
      "--cream-50": "340 80% 98.5%",
      "--cream-100": "335 70% 96%",
      "--cream-200": "330 60% 93%",
      "--espresso-100": "340 60% 95%",
      "--espresso-200": "340 45% 87%",
      "--espresso-300": "340 45% 76%",
      "--espresso-500": "340 30% 46%",
      "--espresso-600": "340 34% 37%",
      "--espresso-700": "340 38% 27%",
      "--espresso-800": "340 42% 18%",
      "--surface": "0 0% 100%",
      "--shade": "340 40% 22%",
      "--glow-a": "340 75% 85%",
      "--glow-b": "325 70% 90%",
    },
    swatch: "radial-gradient(circle at 32% 28%, #fde4ee 0%, #f3a6c3 55%, #d97aa0 100%)",
    swatchShadow: "0 10px 22px -8px rgb(200 80 130 / 0.45)",
    meta: "#fff5f9",
  },
];

/** Paints the whole page in the given theme. Client-only. */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
  root.style.colorScheme = theme.dark ? "dark" : "light";
  root.dataset.theme = theme.id;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme.meta);
}

/** The theme's page background — used by the colour-reveal transition. */
export function themeBackground(theme: Theme) {
  const v = theme.vars;
  return `linear-gradient(165deg, hsl(${v["--cream-50"]}) 0%, hsl(${v["--cream-100"]}) 55%, hsl(${v["--cream-200"]}) 100%)`;
}
