import { THEME_BOOTSTRAP_SCRIPT } from "@/lib/theme-storage";

/** Serves the blocking theme IIFE so `app/layout.tsx` can use `<script src>` only (no innerHTML → no React 19 dev warning). */
export function GET() {
  return new Response(THEME_BOOTSTRAP_SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
