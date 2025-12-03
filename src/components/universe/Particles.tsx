"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 2000;

// Seeded random number generator for deterministic results
function seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Generate particles outside component for purity
function generateParticles(): Float32Array {
    const temp = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
        const x = (seededRandom(i * 3) - 0.5) * 50;
        const y = (seededRandom(i * 3 + 1) - 0.5) * 50;
        const z = (seededRandom(i * 3 + 2) - 0.5) * 50;
        temp[i * 3] = x;
        temp[i * 3 + 1] = y;
        temp[i * 3 + 2] = z;
    }
    return temp;
}

const PARTICLES = generateParticles();

export function Particles() {
    const mesh = useRef<THREE.Points>(null);
    const { pointer, viewport } = useThree();

    useFrame((state) => {
        if (!mesh.current) return;

        const time = state.clock.getElapsedTime();

        // Rotate the entire particle system slowly
        mesh.current.rotation.y = time * 0.05;
        mesh.current.rotation.x = Math.sin(time * 0.1) * 0.05;

        // Interactive movement based on pointer
        // We can't easily update individual particles in a performant way without a shader,
        // so we'll move the whole group slightly based on mouse position.
        const x = (pointer.x * viewport.width) / 50;
        const y = (pointer.y * viewport.height) / 50;

        mesh.current.position.x += (x - mesh.current.position.x) * 0.1;
        mesh.current.position.y += (y - mesh.current.position.y) * 0.1;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[PARTICLES, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#ffffff"
                transparent
                opacity={0.4}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
