/** Must match `AppearanceToggle` / root theme script (localStorage). */
export const THEME_STORAGE_KEY = "mazaalai-profile-dark-preview";

/** Blocking theme IIFE; served from `GET /theme-bootstrap` so the root layout can use `<script src>` only (React 19). */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);if(s==="1")document.documentElement.classList.add("dark");else if(s==="0")document.documentElement.classList.remove("dark");}catch(e){}})();`;
