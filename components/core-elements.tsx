import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

export const HorizontalRule = () => (
  <hr className="border-t border-gray-300 my-2" />
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
    className={["text-blue-600 hover:text-blue-400", className]
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
    className={["text-blue-600 hover:text-blue-400 hover:underline", className]
      .filter(Boolean)
      .join(" ")}
    {...props}
  >
    {children}
  </a>
);
