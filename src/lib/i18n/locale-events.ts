export function subscribeLocaleChange(onChange: () => void): () => void {
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
  };
}

export function readLocaleFromUrl(): "id" | "en" {
  if (typeof window === "undefined") return "id";
  return new URLSearchParams(window.location.search).get("lang") === "en"
    ? "en"
    : "id";
}
