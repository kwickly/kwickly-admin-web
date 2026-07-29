/**
 * Color utilities for white-label brand theme generation.
 */

/**
 * Validates that a string is a 6-digit hex color (with or without #).
 */
export function isValidHex(color: string): boolean {
  return /^#?[0-9A-F]{6}$/i.test(color);
}

/**
 * Computes the WCAG relative luminance of a hex color.
 * Returns a value between 0 (black) and 1 (white).
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function getRelativeLuminance(hexColor: string): number {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return 0;

  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = toLinear(parseInt(hex.substring(0, 2), 16));
  const g = toLinear(parseInt(hex.substring(2, 4), 16));
  const b = toLinear(parseInt(hex.substring(4, 6), 16));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Computes the WCAG contrast ratio between two hex colors.
 * Returns a value between 1 (no contrast) and 21 (maximum contrast).
 * WCAG AA requires >= 4.5:1 for normal text, >= 3:1 for large text / UI.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const l1 = getRelativeLuminance(hex1);
  const l2 = getRelativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculates the relative luminance of a color and returns a high-contrast text color
 * (either white `#ffffff` or dark zinc `#09090b`) to maintain accessibility.
 */
export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#ffffff';
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate relative luminance formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 140 ? '#09090b' : '#ffffff';
}

/**
 * Lightens or darkens a hex color by a given percentage.
 * Positive percent = lighter, Negative percent = darker.
 */
export function adjustColorBrightness(hexColor: string, percent: number): string {
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return hexColor;

  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  r = Math.max(0, Math.min(255, r + (r * percent) / 100));
  g = Math.max(0, Math.min(255, g + (g * percent) / 100));
  b = Math.max(0, Math.min(255, b + (b * percent) / 100));

  const toHex = (val: number) => {
    const s = Math.round(val).toString(16);
    return s.length === 1 ? '0' + s : s;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Returns hex color with opacity suffix.
 * e.g., opacity = 10 -> '1a', 20 -> '33'
 */
export function getHexOpacity(hexColor: string, opacityPercent: number): string {
  const base = hexColor.startsWith('#') ? hexColor : `#${hexColor}`;
  const opacityHex = Math.round((opacityPercent / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${base}${opacityHex}`;
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0.03, g: 0.04, b: 0.90 }; // default fallback
}

export function rgbToOklch(r: number, g: number, b: number) {
  const fn = (c: number) => c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  const lR = fn(r);
  const lG = fn(g);
  const lB = fn(b);

  const l = 0.4122214708 * lR + 0.5363325363 * lG + 0.0514459929 * lB;
  const m = 0.2119034982 * lR + 0.6806995451 * lG + 0.1073969566 * lB;
  const s = 0.0883024619 * lR + 0.2817188376 * lG + 0.6299787005 * lB;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let h = Math.atan2(b_, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  return { L, C, h };
}

export function hexToOklchString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  const { L, C, h } = rgbToOklch(r, g, b);
  return `${L.toFixed(3)} ${C.toFixed(3)} ${h.toFixed(1)}`;
}

