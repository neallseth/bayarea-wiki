import Image from "next/image";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";
import CoreLayout from "@/components/core-layout";

export default function Home() {
  return (
    <CoreLayout home>
      <section className="grid w-full items-center gap-10 sm:grid-cols-[1fr_180px] sm:gap-14">
        <div>
          <h1 className={`${lora.className} text-4xl font-semibold tracking-[-0.025em] sm:text-5xl`}>
            Bay Area Wiki
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-8 text-[var(--muted)]">
            Recording culturally notable places, institutions, communities, and ideas emerging from the San Francisco Bay Area.
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
          width={180}
          height={270}
          className="hidden h-[270px] w-[180px] rounded-md object-cover shadow-[0_18px_45px_rgba(52,43,31,0.18)] ring-1 ring-black/10 sm:block"
          priority
        />
      </section>
    </CoreLayout>
  );
}
