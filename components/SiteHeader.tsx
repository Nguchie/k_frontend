"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  brand: string;
};

export function SiteHeader({ brand }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 720) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="site-header">
      <div className="header-top-row">
        <Link href="/" className="brand">
          <img src="/kennice_logo.jpeg" alt={`${brand} logo`} className="brand-logo" />
          {brand.toUpperCase()}
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="site-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          Menu
        </button>
      </div>
      <div className="header-bottom-row">
        <div className="translate-widget-wrap">
          <div id="google_translate_element" />
        </div>
      </div>
      <div className={`header-nav-shell ${isMenuOpen ? "is-open" : ""}`}>
        <nav id="site-navigation" className="main-nav">
          <Link href="/countries" onClick={() => setIsMenuOpen(false)}>Countries</Link>
          <Link href="/destinations" onClick={() => setIsMenuOpen(false)}>Destinations</Link>
          <Link href="/tours" onClick={() => setIsMenuOpen(false)}>Tours</Link>
          <Link href="/blog" onClick={() => setIsMenuOpen(false)}>Safari Guides</Link>
          <Link href="/reviews" onClick={() => setIsMenuOpen(false)}>Reviews</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
          <div className="nav-utility-group">
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Have a Question?</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
