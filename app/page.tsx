import Image from "next/image";
import { lora } from "@/app/fonts/fonts";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center grow">
      <main className="flex flex-col gap-8 items-center">
        <Image
          src="/images/ggb.jpg"
          alt="Bay Area Wiki logo"
          width={180}
          height={38}
          className="rounded-md shadow-xl"
          priority
        />
        <p className={lora.className}>Bay Area Wiki</p>
        {/* <input type="text" placeholder="Search" /> */}
        <Link
          className="text-gray-500 hover:text-gray-400 hover:underline"
          href="/explore"
        >
          →
        </Link>
      </main>
    </div>
  );
}
