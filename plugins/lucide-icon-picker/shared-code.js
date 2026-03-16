// Code partagé pour la sandbox Lucide (non copié dans Bubble)
const LUCIDE_SCRIPT_ID = "lucide-script";
const LUCIDE_URL = "https://unpkg.com/lucide@latest/dist/umd/lucide.min.js";

export function loadExternalScript(scriptId, url) {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    const existing = document.getElementById(scriptId);
    if (existing) {
      const doneAttr = existing.getAttribute("data-loaded");
      if (doneAttr === "true" || existing.readyState === "complete") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = url;
    script.async = true;
    script.setAttribute("data-loaded", "false");
    script.onload = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    script.onerror = () => {
      script.setAttribute("data-loaded", "true");
      resolve();
    };
    document.head.appendChild(script);
  });
}

export function loadLucide() {
  if (typeof window !== "undefined" && window.lucide && window.lucide.createIcons) {
    return Promise.resolve();
  }
  return loadExternalScript(LUCIDE_SCRIPT_ID, LUCIDE_URL);
}

