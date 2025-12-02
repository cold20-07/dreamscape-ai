"use client";

import { useRef, useCallback } from "react";
import { Bold, Italic, List, Quote, Heading1, Heading2 } from "lucide-react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertFormat = useCallback((prefix: string, suffix: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newValue = `${before}${prefix}${selection}${suffix}${after}`;
        onChange(newValue);

        // Restore selection/cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    }, [onChange]);

    const tools = [
        { icon: Bold, label: "Bold", format: ["**", "**"] },
        { icon: Italic, label: "Italic", format: ["_", "_"] },
        { icon: Heading1, label: "H1", format: ["# ", ""] },
        { icon: Heading2, label: "H2", format: ["## ", ""] },
        { icon: Quote, label: "Quote", format: ["> ", ""] },
        { icon: List, label: "List", format: ["- ", ""] },
    ];

    return (
        <div className="flex flex-col gap-2 group">
            <div className="flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                {tools.map((tool) => (
                    <button
                        key={tool.label}
                        type="button"
                        onClick={() => insertFormat(tool.format[0], tool.format[1])}
                        className="p-2 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                        title={tool.label}
                    >
                        <tool.icon size={16} />
                    </button>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-transparent border-b border-white/20 py-4 text-xl text-white placeholder:text-white/20 focus:outline-none focus:border-white transition-colors min-h-[200px] resize-none font-sans leading-relaxed"
            />
        </div>
    );
}
