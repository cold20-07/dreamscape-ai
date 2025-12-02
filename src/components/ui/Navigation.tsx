"use client";

import Link from "next/link";

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
    return (
        <nav className="fixed top-8 right-8 z-50 flex gap-8 font-sans text-xs font-medium tracking-wide text-mantis-white mix-blend-difference">
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
    );
}
