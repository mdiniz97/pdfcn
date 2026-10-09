import type { Style } from "@/registry/bases/forme/lib/pdf-primitives";

/**
 * Monospaced code snippet on a muted filled background with rounded corners.
 * Props - `code` | `title` | `maxLines` | `accentColor` | `renderingBase` | `style`
 * @see {@link CodeProps}
 */
export interface CodeProps {
  /** Source text. Line breaks are preserved; long lines wrap within the block. */
  code: string;
  /** Small label bar above the code (filename, language, or command). */
  title?: string;
  /** Truncate the snippet after this many lines, adding an ellipsis line. */
  maxLines?: number;
  /**
   * Accent color for a left rule on the block. Omit for a plain filled block.
   */
  accentColor?: string;
  renderingBase?: "takumi" | "forme";
  style?: Style;
}
