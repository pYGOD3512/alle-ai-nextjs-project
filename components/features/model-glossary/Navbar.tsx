'use client'

import Link from "next/link";
import Image from "next/image";
interface NavbarProps {
  linkText: string;
  linkUrl: string;
}

export default function Navbar({ linkText, linkUrl }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 mx-auto flex justify-between md:justify-around items-center p-2 bg-white shadow z-10">
      <div className="text-xl font-bold">
        <Link href="/">
          <Image src="/logo.png" alt="Alle-AI Logo" width={125} height={125} />
        </Link>
      </div>
      <div>
        <Link href={linkUrl} className="text-black hover:underline">
          {linkText}
        </Link>
      </div>
    </nav>
  );
}