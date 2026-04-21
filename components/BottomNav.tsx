"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlaySquare, Grid2x2 } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const active = "text-white";
  const idle = "text-zinc-500";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/90 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-around py-3">
        <Link href="/feed">
          <PlaySquare
            className={`h-6 w-6 ${
              pathname === "/feed" ? active : idle
            }`}
          />
        </Link>

        <Link href="/library">
          <Grid2x2
            className={`h-6 w-6 ${
              pathname === "/library" ? active : idle
            }`}
          />
        </Link>
      </div>
    </nav>
  );
}