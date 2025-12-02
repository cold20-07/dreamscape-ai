"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { Dream } from "@/types";

interface DreamNodeProps {
    dream: Dream;
    position: [number, number, number];
    onClick: (dream: Dream) => void;
    dimmed: boolean;
}

export function DreamNode({ dream, position, onClick, dimmed }: DreamNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.002;
            meshRef.current.rotation.y += 0.002;
            // Gentle pulse effect
            const targetScale = hovered ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 1.5 + position[0]) * 0.05;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    const color = dream.type === 'lucid' ? '#a78bfa' : // Purple-ish for lucid
        dream.type === 'nightmare' ? '#ef4444' : // Red for nightmare
            '#38bdf8'; // Blue for normal

    const geometry = useMemo(() => {
        if (dream.type === 'lucid') return new THREE.IcosahedronGeometry(0.5, 0);
        if (dream.type === 'nightmare') return new THREE.DodecahedronGeometry(0.5, 0);
        return new THREE.SphereGeometry(0.4, 32, 32);
    }, [dream.type]);

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group position={position}>
                <mesh
                    ref={meshRef}
                    geometry={geometry}
                    onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                    onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
                    onClick={(e) => { e.stopPropagation(); onClick(dream); }}
                >

                    {/* Realistic Glassy Material */}
                    <MeshTransmissionMaterial
                        backside
                        samples={4}
                        thickness={0.5}
                        chromaticAberration={0.05}
                        anisotropy={0.1}
                        distortion={0.1}
                        distortionScale={0.1}
                        temporalDistortion={0.2}
                        iridescence={0.5}
                        iridescenceIOR={1}
                        iridescenceThicknessRange={[0, 1400]}
                        clearcoat={1}
                        attenuationDistance={0.5}
                        attenuationColor={color}
                        color={color}
                        roughness={0.1}
                        transparent
                        opacity={dimmed ? 0.1 : 1}
                    />
                </mesh>

                {/* Inner glow for lucid dreams */}
                {dream.type === 'lucid' && (
                    <mesh scale={[0.8, 0.8, 0.8]}>
                        <icosahedronGeometry args={[0.4, 0]} />
                        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.3} />
                    </mesh>
                )}

                {hovered && !dimmed && (
                    <Html distanceFactor={12}>
                        <div className="bg-black/80 text-white p-3 rounded-lg border border-white/20 text-xs w-40 pointer-events-none backdrop-blur-md shadow-xl transform -translate-x-1/2 -translate-y-full mt-[-10px]">
                            <p className="font-bold text-sm mb-1">{dream.title}</p>
                            <p className="opacity-70 mb-1">{new Date(dream.date).toLocaleDateString()}</p>
                            <div className="flex gap-1 flex-wrap">
                                {dream.tags.slice(0, 2).map(t => (
                                    <span key={t} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px]">{t}</span>
                                ))}
                            </div>
                        </div>
                    </Html>
                )}
            </group>
        </Float>
    );
}
