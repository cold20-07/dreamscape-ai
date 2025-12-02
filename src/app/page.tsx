import { HeroKeywords } from "@/components/home/HeroKeywords";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="full-screen-section relative flex-col gap-12">
        <HeroKeywords />

        <Link
          href="/journal"
          className="z-20 text-sm uppercase tracking-[0.3em] text-mantis-gray hover:text-white transition-colors border-b border-transparent hover:border-white pb-1 animate-fade-in opacity-0"
          style={{ animationDelay: "1.5s" }}
        >
          Enter Dreamscape
        </Link>
      </section>

      {/* Placeholder for scroll content */}
      <section className="min-h-screen flex items-center justify-center bg-mantis-black z-20 relative">
        <div className="text-center max-w-2xl px-4">
          <p className="text-2xl md:text-4xl font-light leading-relaxed text-balance text-mantis-gray">
            We craft digital experiences that transcend the ordinary, merging technology with human emotion.
          </p>
        </div>
      </section>
    </div>
  );
}
