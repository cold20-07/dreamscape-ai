"use client";

import Link from "next/link";

export function BottomBranding() {
    return (
        <div className="relative md:fixed bottom-0 md:bottom-8 left-0 md:left-8 right-0 md:right-8 z-50 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-4 p-8 md:p-0 bg-black md:bg-transparent text-xs font-medium tracking-wide text-white pointer-events-auto md:pointer-events-none drop-shadow-md">
            <div className="flex flex-col gap-1 pointer-events-auto text-center md:text-left order-2 md:order-1">
                <Link href="/" className="text-lg font-bold tracking-tighter hover:opacity-70 transition-opacity">
                    DREAMSCAPE
                </Link>
                <span className="text-white/60">MADE WITH LOVE ❥</span>
            </div>

            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-0 text-center pointer-events-auto order-1 md:order-2">
                <p className="text-sm tracking-[0.5em] uppercase opacity-80 hover:opacity-100 transition-opacity cursor-default">
                    we create feelings.
                </p>
            </div>

            <div className="pointer-events-auto order-3">
                <button
                    type="button"
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
