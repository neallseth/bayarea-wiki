import Link from "next/link";
import Image from "next/image";
import { lora } from "@/app/fonts/fonts";

export function SiteHeader() {
  return (
    <header className="mx-auto mb-14 flex w-full max-w-[70ch] items-center justify-between border-b border-[var(--line)] pb-4 sm:mb-18">
      <Link className="group flex items-center gap-3 no-underline" href="/" aria-label="Bay Area Wiki home">
        <Image
          src="/images/ggb.jpg"
          className="h-[42px] w-7 rounded-sm object-cover shadow-sm ring-1 ring-black/10"
          alt=""
          width={28}
          height={42}
          priority
        />
        <span className={`${lora.className} text-[15px] font-semibold tracking-tight sm:text-base`}>
          Bay Area Wiki
        </span>
      </Link>
      <nav aria-label="Primary navigation" className="flex items-center gap-4 text-sm sm:gap-6">
        <Link className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]" href="/explore">
          Explore
        </Link>
        <Link className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]" href="/bay-area-wiki">
          About
        </Link>
      </nav>
    </header>
  );
}

export default function CoreLayout({
  children,
  home = false,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <div className="w-full">
      {!home && <SiteHeader />}
      <main
        className={`mx-auto w-full max-w-[70ch] ${
          home
            ? "flex min-h-[calc(100dvh-2.5rem)] items-center pb-4 sm:min-h-[calc(100dvh-3.5rem)] sm:pb-7"
            : "pb-20"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
