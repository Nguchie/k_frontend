"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

export function TawkWidget() {
  useEffect(() => {
    const originalConsoleError = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      if (args.length === 1 && args[0] === true) {
        return;
      }

      originalConsoleError(...args);
    };

    if (document.querySelector('script[data-tawk="true"]')) {
      return () => {
        console.error = originalConsoleError;
      };
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/69cbbc0291b2531c36cf742a/1jl1tcrdp";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    script.setAttribute("data-tawk", "true");
    document.body.appendChild(script);

    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}
