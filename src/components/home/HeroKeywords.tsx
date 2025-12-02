"use client";

import { motion } from "framer-motion";

const keywords = ["EXPERIENTIAL", "BRANDING", "DIGITAL"];

export function HeroKeywords() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen w-full py-20">
            <div className="flex flex-col items-center justify-center gap-0 z-10 mix-blend-difference">
                {keywords.map((word, index) => (
                    <motion.h1
                        key={word}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            delay: 0.2 + index * 0.15,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="hero-text text-center text-5xl md:text-9xl tracking-tighter-custom leading-[0.85] select-none hover:text-transparent hover:stroke-white hover:stroke-1 transition-colors duration-300"
                        style={{
                            WebkitTextStroke: "1px transparent",
                        }}
                    >
                        {word}
                    </motion.h1>
                ))}
            </div>
        </div>
    );
}
