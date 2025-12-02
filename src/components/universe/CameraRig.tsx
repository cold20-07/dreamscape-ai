"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Dream } from "@/types";

interface CameraRigProps {
    selectedDream: Dream | null;
    positions: [number, number, number][];
    dreams: Dream[];
}

export function CameraRig({ selectedDream, positions, dreams }: CameraRigProps) {
    const { controls } = useThree();

    useFrame((state) => {
        if (selectedDream) {
            const index = dreams.findIndex(d => d.id === selectedDream.id);
            if (index !== -1) {
                const [x, y, z] = positions[index];

                // Target position: slightly offset from the node
                const targetPos = new THREE.Vector3(x, y, z + 4);

                // Smoothly move camera
                state.camera.position.lerp(targetPos, 0.05);

                // Look at the node
                // We need to be careful not to fight with OrbitControls too much
                // Ideally, we update OrbitControls target
                if (controls) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const orbitControls = controls as any;
                    orbitControls.target.lerp(new THREE.Vector3(x, y, z), 0.05);
                    orbitControls.update();
                }
            }
        } else {
            // Return to default view or idle movement
            // state.camera.position.lerp(new THREE.Vector3(0, 0, 14), 0.02);
            // Let OrbitControls handle the rest when not selected
        }
    });

    return null;
}
