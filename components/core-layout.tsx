import Link from "next/link";
import Image from "next/image";

export default function CoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
        <Link className="contents" href={"/"}>
          <Image
            src="/images/ggb.jpg"
            className="mb-6"
            alt="Bay Area Wiki logo"
            width={30}
            height={38}
            priority
          />
        </Link>
      </div>
      {children}
    </div>
  );
}
