import { siteConfig } from "@/lib/site";

export function StickyWhatsApp() {
  const href = siteConfig.whatsappUrl;
  return (
    <a className="sticky-whatsapp" href={href} target="_blank" rel="noreferrer">
      Chat with Safari Expert
    </a>
  );
}
