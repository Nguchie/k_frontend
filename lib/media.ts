import { ImageAsset } from "@/lib/types";
import { getBackendOrigin } from "@/lib/backend";

const FALLBACKS = {
  wildlife: "/hero/default-hero-1.jpg",
};

function toAbsoluteMediaUrl(path: string) {
  if (!path) {
    return path;
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  if (path.startsWith("/hero/")) {
    return path;
  }
  const backendOrigin = getBackendOrigin();
  if (!backendOrigin) {
    return path;
  }

  const normalizedOrigin = backendOrigin.replace(/\/$/, "");
  if (path.startsWith("/")) {
    return `${normalizedOrigin}${path}`;
  }

  try {
    return new URL(path, `${normalizedOrigin}/`).toString();
  } catch {
    return path;
  }
}

export function getImageSource(image: ImageAsset | string | null | undefined) {
  if (typeof image === "string" && image) {
    return toAbsoluteMediaUrl(image);
  }

  if (image && typeof image !== "string") {
    return toAbsoluteMediaUrl(image.image);
  }

  return null;
}

export function getFirstGalleryImage(gallery: ImageAsset[] | null | undefined) {
  return gallery?.[0] ?? null;
}

export function getHeroImageSource(image: ImageAsset | string | null | undefined) {
  return getImageSource(image) || FALLBACKS.wildlife;
}

export function getEmbeddableVideoUrl(url: string | null | undefined) {
  const raw = String(url || "").trim();
  if (!raw) {
    return null;
  }

  const iframeMatch = raw.match(/<iframe[^>]+src\s*=\s*['"]([^'"]+)['"]/i);
  const extracted = iframeMatch?.[1]?.trim() || raw;

  try {
    const parsed = new URL(extracted);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.toString();
      }

      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        const videoId = parsed.pathname.split("/shorts/")[1]?.split("/")[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    }

    if (host.includes("youtu.be")) {
      const videoId = parsed.pathname.replace(/^\/+/, "").split("/")[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return parsed.toString();
  } catch {
    return extracted;
  }
}
