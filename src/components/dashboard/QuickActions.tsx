"use client";

import { motion } from "framer-motion";
import { Plus, Globe, BookOpen, Moon } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
    const actions = [
        { icon: Plus, label: "Record Dream", href: "/journal?action=new", primary: true },
        { icon: Globe, label: "View Universe", href: "/universe", primary: false },
        { icon: BookOpen, label: "Journal", href: "/journal", primary: false },
        { icon: Moon, label: "Tonight's Prompt", href: "/dashboard/prompt", primary: false },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actions.map((action, index) => (
                <Link key={action.label} href={action.href} className="block">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={`
                            h-full p-6 rounded-2xl border flex flex-col items-center justify-center gap-4 text-center transition-all duration-300
                            ${action.primary
                                ? "bg-white text-black border-white hover:bg-white/90"
                                : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/30"
                            }
                        `}
                    >
                        <action.icon size={24} />
                        <span className="text-sm font-medium tracking-wide uppercase">{action.label}</span>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
