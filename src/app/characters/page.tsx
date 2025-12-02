"use client";

import { useDreams } from "@/context/DreamContext";
import { EntityCard } from "@/components/entities/EntityCard";
import { motion } from "framer-motion";

export default function CharactersPage() {
    const { characters } = useDreams();

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                    CHARACTERS
                </h1>
                <p className="text-mantis-gray text-lg">
                    The recurring figures of your subconscious.
                </p>
            </motion.div>

            {characters.length === 0 ? (
                <div className="text-center py-20 text-mantis-gray">
                    <p>No characters identified yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {characters.map((char, index) => (
                        <EntityCard
                            key={char.id}
                            type="character"
                            name={char.name}
                            description={char.description}
                            appearances={char.appearances}
                            subtext={char.relationship}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
