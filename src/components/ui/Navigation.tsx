"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/journal", label: "Journal" },
    { href: "/timeline", label: "Timeline" },
    { href: "/insights", label: "Insights" },
    { href: "/characters", label: "Characters" },
    { href: "/locations", label: "Locations" },
    { href: "/universe", label: "Universe" },
    { href: "/settings", label: "Settings" },
];

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex fixed top-8 right-8 z-50 gap-8 font-sans text-xs font-medium tracking-wide text-mantis-white mix-blend-difference">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="group relative overflow-hidden"
                    >
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                            {link.label}
                        </span>
                        <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                            {link.label}
                        </span>
                    </Link>
                ))}
            </nav>

            {/* Mobile Navigation Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-8 right-8 z-50 text-white mix-blend-difference"
            >
                <div className="space-y-2">
                    <span className={`block w-8 h-0.5 bg-current transition-transform ${isOpen ? "rotate-45 translate-y-2.5" : ""}`}></span>
                    <span className={`block w-8 h-0.5 bg-current transition-opacity ${isOpen ? "opacity-0" : ""}`}></span>
                    <span className={`block w-8 h-0.5 bg-current transition-transform ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}></span>
                </div>
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center md:hidden"
                    >
                        <nav className="flex flex-col gap-8 text-2xl font-light tracking-widest">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
