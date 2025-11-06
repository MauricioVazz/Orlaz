// Utility to build API URLs used across the app.
// Exports a default function `buildUrl(path, params)` that combines
// NEXT_PUBLIC_API_BASE (when set) with the provided path and optional
// query parameters.

function stringifyParams(params) {
  if (!params) return "";
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (Array.isArray(v))
        return v
          .map((val) => `${encodeURIComponent(k)}=${encodeURIComponent(val)}`)
          .join("&");
      return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
    });
  return entries.length ? `?${entries.join("&")}` : "";
}

export default function buildUrl(path = "", params) {
  // Default to localhost backend during development when NEXT_PUBLIC_API_BASE
  // isn't configured. This ensures buildUrl returns an absolute URL so client
  // fetches target the backend instead of the Next.js host (which can return
  // the app's 404 page).
  const base =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_API_BASE
      ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")
      : "http://localhost:3000";

  // Ensure path starts with '/'
  const normalizedPath = path && path[0] === "/" ? path : `/${path}`;
  const query = stringifyParams(params);

  return `${base}${normalizedPath}${query}`;
}
