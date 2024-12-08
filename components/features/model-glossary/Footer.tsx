'use client'

import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" text-center py-4">
      <div className="container mx-auto">
        <p className="text-sm text-gray-600">
          Copyright © 2024 Alle-AI. All rights reserved.
        </p>
        <div className="mt-2">
          <Link href="/terms" className="text-[#666] underline text-sm  hover:text-[#000]">Terms of Service</Link>
          <span className="mx-2">|</span>
          <Link href="/privacy" className="text-[#666] underline text-sm hover:text-[#000]">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
} 