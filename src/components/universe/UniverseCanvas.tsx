"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { useState, useMemo } from "react";
import { useDreams } from "@/context/DreamContext";
import { Dream } from "@/types";
import { DreamModal } from "@/components/journal/DreamModal";
import { UniverseControls } from "./UniverseControls";
import { NodeDetailsPanel } from "./NodeDetailsPanel";
import { DreamNode } from "./DreamNode";
import { Connections } from "./Connections";
import { SceneLighting } from "./SceneLighting";
import { Particles } from "./Particles";
import { CameraRig } from "./CameraRig";

export function UniverseCanvas() {
    const { dreams } = useDreams();
    const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filtering State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTags, setFilterTags] = useState<string[]>([]);

    // Deterministic positions based on dream ID
    const positions = useMemo(() => {
        return dreams.map((dream) => {
            let hash = 0;
            for (let i = 0; i < dream.id.length; i++) {
                hash = ((hash << 5) - hash) + dream.id.charCodeAt(i);
                hash |= 0;
            }
            const seededRandom = (seed: number) => {
                const x = Math.sin(seed++) * 10000;
                return x - Math.floor(x);
            };

            return [
                (seededRandom(hash) - 0.5) * 15,
                (seededRandom(hash + 1) - 0.5) * 10,
                (seededRandom(hash + 2) - 0.5) * 10,
            ] as [number, number, number];
        });
    }, [dreams]);

    // Derived Filtered Dreams
    const filteredDreams = useMemo(() => {
        return dreams.filter(dream => {
            const matchesSearch = dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dream.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTags = filterTags.length === 0 || filterTags.every(tag => dream.tags.includes(tag));
            return matchesSearch && matchesTags;
        });
    }, [dreams, searchQuery, filterTags]);

    // Get all unique tags for the filter dropdown
    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        dreams.forEach(d => d.tags.forEach(t => tags.add(t)));
        return Array.from(tags);
    }, [dreams]);

    const handleNodeClick = (dream: Dream) => {
        setSelectedDream(dream);
    };

    const handleViewFull = (dream: Dream) => {
        setSelectedDream(dream);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="w-full h-full absolute inset-0 bg-[#020205]">
                <UniverseControls
                    onSearch={setSearchQuery}
                    onFilterTags={setFilterTags}
                    availableTags={availableTags}
                />

                <Canvas camera={{ position: [0, 0, 14], fov: 45 }} gl={{ antialias: false }}>
                    <color attach="background" args={['#020205']} />
                    <fog attach="fog" args={['#020205', 10, 30]} />

                    <SceneLighting />

                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
                    <Particles />

                    {dreams.map((dream, i) => {
                        const isVisible = filteredDreams.find(d => d.id === dream.id);
                        return (
                            <DreamNode
                                key={dream.id}
                                dream={dream}
                                position={positions[i]}
                                onClick={handleNodeClick}
                                dimmed={!isVisible}
                            />
                        );
                    })}

                    <Connections dreams={dreams} positions={positions} filteredDreams={filteredDreams} />

                    <CameraRig selectedDream={selectedDream} positions={positions} dreams={dreams} />

                    <OrbitControls
                        makeDefault
                        enableZoom={true}
                        enablePan={true}
                        autoRotate={!selectedDream}
                        autoRotateSpeed={0.2}
                        maxDistance={25}
                        minDistance={2}
                        enableDamping
                        dampingFactor={0.05}
                    />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} mipmapBlur intensity={0.5} radius={0.4} />
                        <Noise opacity={0.02} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                </Canvas>
            </div>

            <NodeDetailsPanel
                dream={selectedDream}
                onClose={() => setSelectedDream(null)}
                onViewFull={handleViewFull}
            />

            {isModalOpen && selectedDream && (
                <DreamModal
                    dream={selectedDream}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
}
