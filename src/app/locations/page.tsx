"use client";

import { useDreams } from "@/context/DreamContext";
import { EntityCard } from "@/components/entities/EntityCard";
import { motion } from "framer-motion";

export default function LocationsPage() {
    const { locations } = useDreams();

    return (
        <div className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                    LOCATIONS
                </h1>
                <p className="text-mantis-gray text-lg">
                    The landscapes of your dream world.
                </p>
            </motion.div>

            {locations.length === 0 ? (
                <div className="text-center py-20 text-mantis-gray">
                    <p>No locations mapped yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {locations.map((loc, index) => (
                        <EntityCard
                            key={loc.id}
                            type="location"
                            name={loc.name}
                            description={loc.description}
                            appearances={loc.appearances}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
