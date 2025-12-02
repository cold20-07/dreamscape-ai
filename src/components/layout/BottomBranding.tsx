"use client";

import Link from "next/link";

export function BottomBranding() {
    return (
        <div className="fixed bottom-8 left-8 right-8 z-50 flex items-end justify-between text-xs font-medium tracking-wide text-mantis-white mix-blend-difference pointer-events-none">
            <div className="flex flex-col gap-1 pointer-events-auto">
                <Link href="/" className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity">
                    DREAMSCAPE
                </Link>
                <span className="text-mantis-gray">MADE WITH LOVE ❥</span>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-center pointer-events-auto">
                <p className="text-sm tracking-[0.5em] uppercase opacity-80 hover:opacity-100 transition-opacity cursor-default">
                    we create feelings.
                </p>
            </div>

            <div className="pointer-events-auto">
                <button
                    onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                    className="group flex items-center gap-2 hover:opacity-70 transition-opacity"
                >
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>SCROLL</span>
                </button>
            </div>
        </div>
    );
}
