export const ROTATION_SPEED = 0.003;
export const INITIAL_PHI = 0;
export const INITIAL_THETA = 0.25;
export const DRAG_FACTOR = 200;
export const MIN_THETA = -1;
export const MAX_THETA = 1;
export const MAX_DPR = 2;

export const DEFAULT_MARKER_SIZE = 0.05;
export const SELECTED_MARKER_SIZE = 0.09;

export const GLOBE_DARK = 1;
export const GLOBE_DIFFUSE = 1.2;
export const GLOBE_MAP_SAMPLES = 16000;
export const GLOBE_MAP_BRIGHTNESS = 6;
export const GLOBE_BASE_COLOR_RGB: [number, number, number] = [0.2, 0.25, 0.4];
export const GLOBE_DEFAULT_MARKER_COLOR_RGB: [number, number, number] = [1, 0.7, 0.2];
export const GLOBE_GLOW_COLOR_RGB: [number, number, number] = [0.1, 0.2, 0.5];

export const FALLBACK_COLOR_RGB: [number, number, number] = [0.96, 0.62, 0.04]; // Amber-500
export const SELECTED_MARKER_COLOR_RGB: [number, number, number] = [1, 0.85, 0.2];

/**
 * Validates a hex color string and converts it to cobe's [r, g, b] range (0-1).
 * Falls back to FALLBACK_COLOR_RGB if malformed.
 */
export function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) {
    return FALLBACK_COLOR_RGB;
  }
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num)) {
    return FALLBACK_COLOR_RGB;
  }
  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  return [r, g, b];
}

/**
 * Derives a deterministic CSS-safe identifier for cobe marker IDs and custom properties.
 */
export function getSafeMarkerId(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9_-]/g, "-");
}
