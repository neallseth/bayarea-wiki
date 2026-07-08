import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

export const HorizontalRule = () => (
  <hr className="border-t border-gray-300 my-2" />
);

export const InternalLink = ({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <Link
    href={href ?? "#"}
    className="text-blue-600 hover:text-blue-400"
    {...rest}
  >
    {children}
  </Link>
);

export const ExternalLink = ({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:text-blue-400 hover:underline"
    {...rest}
  >
    {children}
  </a>
);
