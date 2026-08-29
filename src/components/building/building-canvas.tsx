import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import * as THREE from "three"

import { residences } from "@/data/residences"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { TowerModel } from "@/components/building/tower-model"

type BuildingCanvasProps = {
  selectedId: string
  visibleIds: Set<string>
  onSelect: (id: string) => void
}

export default function BuildingCanvas({ selectedId, visibleIds, onSelect }: BuildingCanvasProps) {
  const reducedMotion = useReducedMotion()

  return (
    <Canvas
      aria-label="Interactive 3D model of Syndiqo Tower"
      camera={{ position: [10.5, 6.4, 12.5], fov: 35, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      fallback={<p className="canvas-fallback">3D view unavailable. Use the residence list below.</p>}
      gl={{
        alpha: true,
        antialias: true,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onPointerMissed={() => {
        document.body.style.cursor = "default"
      }}
      performance={{ min: 0.55 }}
      shadows="soft"
    >
      <Suspense fallback={null}>
        <hemisphereLight args={["#eaf8fd", "#607086", 1.65]} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={3.1}
          position={[7, 11, 7]}
          shadow-bias={-0.0004}
          shadow-mapSize-height={1024}
          shadow-mapSize-width={1024}
        />
        <directionalLight color="#70d3f5" intensity={1.1} position={[-7, 4, -6]} />

        <TowerModel
          residences={residences}
          selectedId={selectedId}
          visibleIds={visibleIds}
          onSelect={onSelect}
        />

        <mesh position={[0, -4.6, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#dbe8ed" metalness={0} roughness={0.92} />
        </mesh>
        <gridHelper args={[24, 24, "#8da9b7", "#c5d5dc"]} position={[0, -4.59, 0]} />

        <OrbitControls
          autoRotate={!reducedMotion}
          autoRotateSpeed={0.42}
          enableDamping
          enablePan={false}
          maxDistance={22}
          maxPolarAngle={Math.PI / 2.05}
          minDistance={11}
          minPolarAngle={Math.PI / 3.4}
          target={[0, -0.25, 0]}
        />
      </Suspense>
    </Canvas>
  )
}
