import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HeroTextProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function HeroText({ children, className = "", delay = 0 }: HeroTextProps) {
    return (
        <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
            className={`hero-text ${className}`}
        >
            {children}
        </motion.h1>
    );
}

interface SectionTitleProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function SectionTitle({ children, className = "", delay = 0 }: SectionTitleProps) {
    return (
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
            className={`section-title ${className}`}
        >
            {children}
        </motion.h2>
    );
}

interface BodyTextProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export function BodyText({ children, className = "", delay = 0 }: BodyTextProps) {
    return (
        <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
            className={`text-lg leading-relaxed ${className}`}
        >
            {children}
        </motion.p>
    );
}

interface RevealTextProps {
    children: string;
    className?: string;
    delay?: number;
}

export function RevealText({ children, className = "", delay = 0 }: RevealTextProps) {
    const words = children.split(" ");

    return (
        <div className={className}>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        delay: delay + index * 0.05,
                        ease: [0.4, 0, 0.2, 1]
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
}
