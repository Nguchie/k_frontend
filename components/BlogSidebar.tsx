import Link from "next/link";

import { Guide, GuideCategory } from "@/lib/types";

type BlogSidebarProps = {
  categories: GuideCategory[];
  guides?: Guide[];
  currentCategorySlug?: string;
  currentGuideSlug?: string;
};

export function BlogSidebar({
  categories,
  guides = [],
  currentCategorySlug,
  currentGuideSlug,
}: BlogSidebarProps) {
  const relatedGuides = guides
    .filter((guide) => guide.slug !== currentGuideSlug)
    .slice(0, 4);

  return (
    <div className="blog-sidebar-stack">
      <section className="blog-sidebar-card">
        <p className="eyebrow">Guide Categories</p>
        <nav aria-label="Guide categories" className="blog-sidebar-nav">
          <Link
            href="/blog"
            className={`blog-sidebar-link ${!currentCategorySlug ? "active" : ""}`}
          >
            <span>All guides</span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog/guide-category/${category.slug}`}
              className={`blog-sidebar-link ${currentCategorySlug === category.slug ? "active" : ""}`}
            >
              <span>{category.name}</span>
              <strong>{category.guide_count}</strong>
            </Link>
          ))}
        </nav>
      </section>
      {relatedGuides.length ? (
        <section className="blog-sidebar-card">
          <p className="eyebrow">More Guides</p>
          <div className="blog-sidebar-list">
            {relatedGuides.map((guide) => (
              <Link key={guide.slug} href={`/blog/${guide.slug}`} className="blog-sidebar-article">
                <strong>{guide.title_en}</strong>
                <span>{guide.category?.name ?? guide.country?.name ?? "Safari Guide"}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
