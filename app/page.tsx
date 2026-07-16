import Image from "next/image";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";
import CoreLayout from "@/components/core-layout";
import { SITE_DESCRIPTION } from "@/lib/site";

export default function Home() {
  return (
    <CoreLayout home>
      <section className="grid w-full justify-items-center gap-7 text-center sm:grid-cols-[minmax(0,1fr)_210px] sm:items-center sm:justify-items-stretch sm:gap-10 sm:text-left">
        <div className="contents sm:relative sm:z-10 sm:block sm:-translate-y-3">
          <h1 className={`${lora.className} text-[2.75rem] font-semibold leading-none tracking-[-0.045em] sm:text-[5.25rem] sm:leading-[0.9]`}>
            <span className="inline sm:block">Bay Area</span>
            <span className="ml-[0.2ch] inline text-[var(--accent-dark)] sm:ml-[1.25ch] sm:block">Wiki</span>
          </h1>
          <p className="hidden max-w-[37ch] text-lg leading-8 text-[var(--muted)] sm:mt-8 sm:block">
            {SITE_DESCRIPTION}
          </p>
          <Link
            className="group order-3 inline-flex h-10 w-10 items-center justify-center text-2xl text-[var(--muted)] transition-colors hover:text-[var(--accent-dark)] sm:mt-7"
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
          className="order-2 h-[225px] w-[150px] rounded-md object-cover shadow-[0_18px_45px_rgba(52,43,31,0.18)] ring-1 ring-black/10 sm:order-none sm:h-[315px] sm:w-[210px] sm:translate-y-8 sm:shadow-[0_22px_55px_rgba(52,43,31,0.2)]"
          priority
        />
      </section>
    </CoreLayout>
  );
}
