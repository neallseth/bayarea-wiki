import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

export const HorizontalRule = () => (
  <hr className="border-t border-gray-300 my-2" />
);

export const InternalLink = (
  props: AnchorHTMLAttributes<HTMLAnchorElement>
) => (
  <Link href={props.href ?? "#"} className="text-blue-600 hover:text-blue-400">
    {props.children}
  </Link>
);

export const ExternalLink = (
  props: AnchorHTMLAttributes<HTMLAnchorElement>
) => (
  <Link
    href={props.href ?? "#"}
    target="_blank"
    className="text-blue-600 hover:text-blue-400 hover:underline"
  >
    {props.children}
  </Link>
);
