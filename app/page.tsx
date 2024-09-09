import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center">
      <main className="flex flex-col gap-12">
        <Image
          src="/images/ggb.jpg"
          alt="Bay Area Wiki logo"
          width={180}
          height={38}
          priority
        />
        <p>Bay Area Wiki</p>
        <input type="text" placeholder="Search" />
      </main>
    </div>
  );
}
