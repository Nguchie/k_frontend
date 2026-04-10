const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const USE_API_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY === "true";
const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;
const BACKEND_INTERNAL_URL = process.env.BACKEND_INTERNAL_URL;

function normalizeUrl(value?: string) {
  if (!value) {
    return "";
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function normalizeOrigin(value?: string) {
  return normalizeUrl(value);
}

function normalizeApiBaseUrl(value?: string) {
  const normalized = normalizeUrl(value);
  if (!normalized) {
    return "";
  }

  return `${normalized.replace(/\/api\/?$/i, "")}/api`;
}

function getDirectApiBaseUrl() {
  if (API_BASE_URL) {
    return normalizeApiBaseUrl(API_BASE_URL);
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

export function getBackendInternalUrl() {
  return normalizeOrigin(BACKEND_INTERNAL_URL || BACKEND_ORIGIN || API_BASE_URL?.replace(/\/api\/?$/i, ""));
}
