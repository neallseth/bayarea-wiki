import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

export const HorizontalRule = () => (
  <hr className="my-3 border-t border-[var(--line)]" />
);

type LinkLikeProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const InternalLink = ({
  className,
  href = "#",
  children,
  ...props
}: LinkLikeProps) => (
  <Link
    href={href}
    className={[
      "font-medium text-[var(--accent-dark)] underline decoration-[color:var(--line)] underline-offset-3 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </Link>
);

export const ExternalLink = ({
  className,
  href = "#",
  children,
  rel,
  ...props
}: LinkLikeProps) => (
  <a
    href={href}
    target="_blank"
    rel={rel ?? "noopener noreferrer"}
    className={[
      "font-medium text-[var(--accent-dark)] underline decoration-[color:var(--line)] underline-offset-3 transition-colors hover:text-[var(--accent)] hover:decoration-[var(--accent)]",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </a>
);
