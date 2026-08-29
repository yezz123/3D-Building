import { OrbitControls } from "@react-three/drei"
import { Canvas, useThree } from "@react-three/fiber"
import { Suspense, useEffect } from "react"
import * as THREE from "three"

import { SiteLandscape } from "@/components/building/site-landscape"
import { TowerModel } from "@/components/building/tower-model"
import type { ApartmentOwnership } from "@/data/ownership"
import type { Tower } from "@/data/towers"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

export type FacadeView = "front" | "east" | "west"

type BuildingCanvasProps = {
  tower: Tower
  facadeView: FacadeView
  selectedId: string
  visibleIds: Set<string>
  ownerships: ApartmentOwnership[]
  onSelect: (id: string) => void
}

const cameraPositions: Record<FacadeView, [number, number, number]> = {
  front: [10.8, 7.2, 17.2],
  east: [-18.2, 6.5, 10.2],
  west: [18.2, 6.5, 10.2],
}

function CameraPreset({ view }: { view: FacadeView }) {
  const camera = useThree((state) => state.camera)

  useEffect(() => {
    camera.position.set(...cameraPositions[view])
    camera.lookAt(0, -0.25, 0)
    camera.updateProjectionMatrix()
  }, [camera, view])

  return null
}

export default function BuildingCanvas({ tower, facadeView, selectedId, visibleIds, ownerships, onSelect }: BuildingCanvasProps) {
  const reducedMotion = useReducedMotion()

  return (
    <Canvas
      aria-label={`Interactive 3D model of ${tower.name}`}
      camera={{ position: cameraPositions.front, fov: 35, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      fallback={<p className="canvas-fallback">3D view unavailable. Use the residence list below.</p>}
      gl={{ alpha: true, antialias: true, outputColorSpace: THREE.SRGBColorSpace, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.08 }}
      onPointerMissed={() => { document.body.style.cursor = "default" }}
      performance={{ min: 0.55 }}
      shadows="soft"
    >
      <Suspense fallback={null}>
        <CameraPreset view={facadeView} />
        <hemisphereLight args={["#eaf8fd", "#607086", 1.65]} />
        <directionalLight castShadow color="#ffffff" intensity={3.1} position={[7, 11, 7]} shadow-bias={-0.0004} shadow-mapSize-height={1024} shadow-mapSize-width={1024} />
        <directionalLight color="#70d3f5" intensity={1.1} position={[-7, 4, -6]} />

        <TowerModel key={tower.id} tower={tower} selectedId={selectedId} visibleIds={visibleIds} ownerships={ownerships} onSelect={onSelect} />
        <SiteLandscape reducedMotion={reducedMotion} />

        <mesh position={[0, -4.6, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#d8edf0" metalness={0} roughness={0.92} />
        </mesh>
        <gridHelper args={[24, 24, "#8cb8bb", "#c5dcda"]} position={[0, -4.59, 0]} />

        <OrbitControls autoRotate={!reducedMotion} autoRotateSpeed={0.35} enableDamping enablePan={false} maxDistance={27} maxPolarAngle={Math.PI / 2.05} minDistance={13} minPolarAngle={Math.PI / 3.4} target={[0, -0.25, 0]} />
      </Suspense>
    </Canvas>
  )
}
