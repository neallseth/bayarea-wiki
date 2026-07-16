import Image from "next/image";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";
import CoreLayout from "@/components/core-layout";
import { SITE_DESCRIPTION } from "@/lib/site";

export default function Home() {
  return (
    <CoreLayout home>
      <section className="grid w-full items-center gap-10 sm:grid-cols-[minmax(0,1fr)_210px] sm:gap-10">
        <div className="relative z-10 sm:-translate-y-3">
          <h1 className={`${lora.className} text-[4rem] font-semibold leading-[0.9] tracking-[-0.045em] sm:text-[5.25rem]`}>
            <span className="block">Bay Area</span>
            <span className="ml-[1.25ch] block text-[var(--accent-dark)]">Wiki</span>
          </h1>
          <p className="mt-8 max-w-[37ch] text-lg leading-8 text-[var(--muted)]">
            {SITE_DESCRIPTION}
          </p>
          <Link
            className="group mt-7 inline-flex h-10 w-10 items-center justify-center text-2xl text-[var(--muted)] transition-colors hover:text-[var(--accent-dark)]"
            href="/explore"
            aria-label="Explore the archive"
          >
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
        <Image
          src="/images/ggb.jpg"
          alt="Illustration of the Golden Gate Bridge"
          width={210}
          height={315}
          className="hidden h-[315px] w-[210px] translate-y-8 rounded-md object-cover shadow-[0_22px_55px_rgba(52,43,31,0.2)] ring-1 ring-black/10 sm:block"
          priority
        />
      </section>
    </CoreLayout>
  );
}
