"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

export function SceneLighting() {
    const light1 = useRef<THREE.PointLight>(null);
    const light2 = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (light1.current) {
            light1.current.position.x = Math.sin(t * 0.5) * 10;
            light1.current.position.z = Math.cos(t * 0.5) * 10;
        }
        if (light2.current) {
            light2.current.position.x = Math.cos(t * 0.3) * 15;
            light2.current.position.y = Math.sin(t * 0.3) * 10;
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight ref={light1} position={[10, 10, 10]} intensity={1} color="#4c1d95" distance={50} decay={2} />
            <pointLight ref={light2} position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" distance={50} decay={2} />
            <Environment preset="city" />
        </>
    );
}
