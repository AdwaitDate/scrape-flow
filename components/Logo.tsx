"use client"; 

import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';


const SquareDashedMousePointer = dynamic(
  () => import("lucide-react").then((mod) => mod.SquareDashedMousePointer),
  { ssr: false }
);

function Logo({
  fontSize = "text-2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link href="/" className={cn("text-2xl font-extrabold flex items-center gap-2", fontSize)}>
      <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-2">
        {SquareDashedMousePointer && <SquareDashedMousePointer size={iconSize} className="stroke-white" />}
      </div>
        <div>
            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Flow
            </span>
            <span className="text-stone-700 dark:text-stone-300">Scrape</span>
        </div>
    </Link>
  );
}

export default Logo;
