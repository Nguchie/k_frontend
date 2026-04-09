const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USE_API_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY === "true";
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL;

function normalizeOrigin(value?: string) {
  return value ? value.replace(/\/$/, "") : "";
}

function getDirectApiBaseUrl() {
  if (API_BASE_URL) {
    return API_BASE_URL;
  }

  const backendOrigin = normalizeOrigin(BACKEND_INTERNAL_URL || BACKEND_ORIGIN);
  return backendOrigin ? `${backendOrigin}/api` : "";
}

export function useApiProxy() {
  return USE_API_PROXY;
}

export function getApiBaseUrl() {
  if (typeof window !== "undefined" && USE_API_PROXY) {
    return "/api/proxy";
  }

  return getDirectApiBaseUrl();
}

export function getBackendOrigin() {
  if (USE_API_PROXY) {
    return "/api/proxy-media";
  }

  const backendOrigin = normalizeOrigin(BACKEND_INTERNAL_URL || BACKEND_ORIGIN);
  if (backendOrigin) {
    return backendOrigin;
  }

  if (API_BASE_URL) {
    return API_BASE_URL.replace(/\/api\/?$/, "");
  }

  return "";
}
