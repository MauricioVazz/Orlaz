// Lightweight environment helper for the frontend.
// Returns safe defaults when process.env is not populated in the runtime.

const safe = (key, fallback = '') => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key] !== undefined) {
      return process.env[key];
    }
  } catch (e) {
    // ignore
  }
  if (typeof window !== 'undefined' && window.__ENV && window.__ENV[key] !== undefined) {
    return window.__ENV[key];
  }
  return fallback;
};

const ENV = {
  NEXT_PUBLIC_API_BASE: safe('NEXT_PUBLIC_API_BASE', 'http://localhost:3000'),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: safe('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', ''),
};

export default ENV;
