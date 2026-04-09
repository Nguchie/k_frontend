import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <p className="eyebrow">
        {items.map((item, index) => (
          <span key={item.label}>
            {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
            {index < items.length - 1 ? " / " : ""}
          </span>
        ))}
      </p>
    </nav>
  );
}
