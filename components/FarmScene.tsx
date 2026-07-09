"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cloud, Float, Sparkles, Sky } from "@react-three/drei";
import * as THREE from "three";

// A gently undulating field, animated per-frame with a sine displacement to read as wind.
function Field() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.PlaneGeometry(40, 40, 64, 64), []);
  const basePositions = useMemo(() => geometry.attributes.position.array.slice(), [geometry]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = basePositions[i * 3];
      const y = basePositions[i * 3 + 1];
      const wave = Math.sin(x * 0.4 + t * 0.6) * 0.15 + Math.sin(y * 0.3 + t * 0.4) * 0.1;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.3, 0, 0]} position={[0, -3, -4]}>
      <meshStandardMaterial color="#2f6b3c" roughness={0.9} metalness={0} />
    </mesh>
  );
}

function Sun() {
  return (
    <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0}>
      <mesh position={[6, 5, -14]}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshBasicMaterial color="#efc968" />
      </mesh>
      <pointLight position={[6, 5, -14]} intensity={40} color="#d8a425" distance={40} />
    </Float>
  );
}

function Mountains() {
  const peaks = [
    { x: -8, z: -18, h: 5, s: 6 },
    { x: -2, z: -20, h: 6.5, s: 7 },
    { x: 5, z: -19, h: 4.5, s: 5.5 },
    { x: 11, z: -21, h: 6, s: 6.5 },
  ];
  return (
    <group>
      {peaks.map((p, i) => (
        <mesh key={i} position={[p.x, p.h / 2 - 3.2, p.z]}>
          <coneGeometry args={[p.s, p.h, 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? "#4a3420" : "#5c9a5f"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// A small flock of low-poly birds drifting across the sky.
function Birds() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (group.current) group.current.position.x = ((clock.getElapsedTime() * 0.6) % 24) - 12;
  });
  const positions: [number, number, number][] = [[0, 4.2, -8], [0.6, 4.6, -8.4], [-0.5, 4, -7.6], [1.2, 4.3, -8.8]];
  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <mesh key={i} position={p} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.08, 0.35, 3]} />
          <meshBasicMaterial color="#241a12" />
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.02;
    camera.position.y += (2 + pointer.y * 0.6 - camera.position.y) * 0.02;
    camera.lookAt(0, 1, -8);
  });
  return null;
}

export default function FarmScene() {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <color attach="background" args={["#00000000"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 8, 4]} intensity={1.2} color="#f3eedd" />
      <Sky sunPosition={[6, 5, -14]} turbidity={4} rayleigh={1.2} distance={450000} />
      <Mountains />
      <Field />
      <Sun />
      <Birds />
      <Cloud position={[-5, 4.5, -12]} opacity={0.5} speed={0.15} bounds={[6, 1.5, 1]} segments={12} color="#ffffff" seed={1} />
      <Cloud position={[6, 3.5, -15]} opacity={0.4} speed={0.1} bounds={[5, 1.5, 1]} segments={10} color="#ffffff" seed={2} />
      <Sparkles count={60} scale={[10, 6, 6]} position={[0, 1, -2]} size={3} speed={0.4} color="#b7d6b0" />
      <Rig />
    </Canvas>
  );
}
