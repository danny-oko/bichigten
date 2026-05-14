/** Must match `AppearanceToggle` / root theme script (localStorage). */
export const THEME_STORAGE_KEY = "mazaalai-profile-dark-preview";

/** Inline in `app/layout.tsx` via `next/script` `beforeInteractive` so theme applies before paint (persists across refresh and all routes). */
export const THEME_BOOTSTRAP_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);if(s==="1")document.documentElement.classList.add("dark");else if(s==="0")document.documentElement.classList.remove("dark");}catch(e){}})();`;
