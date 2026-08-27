"use client";

import DOMPurify from "isomorphic-dompurify";

const sanitizeOptions = {
  ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li", "a"],
  ALLOWED_ATTR: ["href", "target", "rel"],
};

export function RichText({ value, className = "" }: { value: string | null | undefined; className?: string }) {
  if (!value) return null;
  const hasMarkup = /<\/?[a-z][\s\S]*>/i.test(value);
  if (!hasMarkup) return <span className={className}>{value}</span>;

  const cleanValue = DOMPurify.sanitize(value, sanitizeOptions);
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: cleanValue }} />;
}
