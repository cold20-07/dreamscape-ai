"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Dream } from "@/types";

interface ConnectionsProps {
    dreams: Dream[];
    positions: [number, number, number][];
    filteredDreams: Dream[];
}

export function Connections({ dreams, positions, filteredDreams }: ConnectionsProps) {
    const lines = useMemo(() => {
        const points: THREE.Vector3[] = [];
        const visibleIds = new Set(filteredDreams.map(d => d.id));

        // Connect dreams that share tags or are close in time
        for (let i = 0; i < dreams.length; i++) {
            for (let j = i + 1; j < dreams.length; j++) {
                const dreamA = dreams[i];
                const dreamB = dreams[j];

                // Only connect if both are in the filtered set
                if (!visibleIds.has(dreamA.id) || !visibleIds.has(dreamB.id)) continue;

                // Check for shared tags
                const sharedTags = dreamA.tags.filter(tag => dreamB.tags.includes(tag));

                if (sharedTags.length > 0) {
                    points.push(new THREE.Vector3(...positions[i]));
                    points.push(new THREE.Vector3(...positions[j]));
                }
            }
        }
        return points;
    }, [dreams, positions, filteredDreams]);

    // Flatten points for bufferAttribute
    const vertices = useMemo(() => new Float32Array(lines.flatMap(v => [v.x, v.y, v.z])), [lines]);

    if (lines.length === 0) return null;

    return (
        <lineSegments>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[vertices, 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial color="#a78bfa" opacity={0.05} transparent linewidth={1} />
        </lineSegments>
    );
}
