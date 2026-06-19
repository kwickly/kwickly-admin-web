/**
 * Color utilities for white-label brand theme generation.
 */

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
