type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  centered?: boolean;
  level?: "h1" | "h2" | "h3";
};

export function SectionHeading({ eyebrow, title, body, centered = false, level = "h2" }: SectionHeadingProps) {
  const HeadingTag = level;

  return (
    <div className={`section-heading ${centered ? "centered" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <HeadingTag>{title}</HeadingTag>
      {body ? <p className="section-body">{body}</p> : null}
    </div>
  );
}
