import { Instance, Instances } from "@react-three/drei"
import type { ThreeEvent } from "@react-three/fiber"
import { useMemo, useState } from "react"
import * as THREE from "three"

import type { Residence } from "@/data/residences"

type TowerModelProps = {
  residences: Residence[]
  selectedId: string
  visibleIds: Set<string>
  onSelect: (id: string) => void
}

const floorHeights = [-3.05, -1.84, -0.63, 0.58, 1.79, 3]

function UnitBay({
  residence,
  selected,
  visible,
  onSelect,
}: {
  residence: Residence
  selected: boolean
  visible: boolean
  onSelect: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const x = residence.wing === "A" ? -1.38 : 1.38
  const y = floorHeights[residence.floor - 2]

  const color = useMemo(() => {
    if (!visible) return new THREE.Color("#334963")
    if (selected) return new THREE.Color("#03aded")
    if (hovered) return new THREE.Color("#70d3f5")
    if (residence.status === "preview") return new THREE.Color("#75b9d6")
    if (residence.status === "waitlist") return new THREE.Color("#607086")
    return new THREE.Color("#b9e7f8")
  }, [hovered, residence.status, selected, visible])

  const handlePointer = (event: ThreeEvent<PointerEvent>, active: boolean) => {
    event.stopPropagation()
    setHovered(active)
    const canvas = event.nativeEvent.target
    if (canvas instanceof HTMLElement) canvas.style.cursor = active && visible ? "pointer" : "grab"
  }

  return (
    <group position={[x, y, 0]}>
      <mesh
        position={[0, 0, 2.2]}
        onClick={(event) => {
          event.stopPropagation()
          if (visible) onSelect(residence.id)
        }}
        onPointerOut={(event) => handlePointer(event, false)}
        onPointerOver={(event) => handlePointer(event, true)}
      >
        <boxGeometry args={[2.42, 0.74, 0.08]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={selected ? 1.2 : hovered && visible ? 0.65 : visible ? 0.18 : 0}
          metalness={0.24}
          roughness={0.24}
        />
      </mesh>

      <mesh position={[0, -0.48, 2.48]} castShadow receiveShadow>
        <boxGeometry args={[2.66, 0.1, 0.72]} />
        <meshStandardMaterial color="#dfe3e6" metalness={0.05} roughness={0.82} />
      </mesh>

      {[-0.82, 0, 0.82].map((mullionX) => (
        <mesh key={mullionX} position={[mullionX, 0, 2.27]}>
          <boxGeometry args={[0.055, 0.8, 0.08]} />
          <meshStandardMaterial color="#10223f" roughness={0.58} />
        </mesh>
      ))}

      <mesh position={[0, -0.08, 2.86]}>
        <boxGeometry args={[2.5, 0.055, 0.055]} />
        <meshStandardMaterial color="#edf4f7" metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  )
}

function Structure() {
  return (
    <group>
      <mesh position={[0, -0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.86, 8.35, 4.25]} />
        <meshStandardMaterial color="#193653" metalness={0.04} roughness={0.78} />
      </mesh>

      <Instances limit={8} castShadow receiveShadow>
        <boxGeometry args={[6.18, 0.13, 4.72]} />
        <meshStandardMaterial color="#d4dde2" metalness={0.05} roughness={0.84} />
        {[-4.12, -3.53, -2.32, -1.11, 0.1, 1.31, 2.52, 3.73].map((y) => (
          <Instance key={y} position={[0, y, 0.12]} />
        ))}
      </Instances>

      <Instances limit={6} castShadow>
        <boxGeometry args={[0.18, 8.5, 0.26]} />
        <meshStandardMaterial color="#e8eef1" roughness={0.76} />
        {[-2.83, -0.08, 2.83].map((x) => (
          <Instance key={`front-${x}`} position={[x, -0.2, 2.24]} />
        ))}
        {[-2.83, 2.83].map((x) => (
          <Instance key={`back-${x}`} position={[x, -0.2, -2.12]} />
        ))}
      </Instances>

      <Instances limit={18}>
        <boxGeometry args={[0.66, 0.68, 0.055]} />
        <meshStandardMaterial color="#5b93ad" emissive="#147fb0" emissiveIntensity={0.12} roughness={0.22} />
        {floorHeights.flatMap((y) => [
          <Instance key={`left-${y}`} position={[-2.96, y, 1.25]} rotation={[0, Math.PI / 2, 0]} />,
          <Instance key={`right-${y}`} position={[2.96, y, 1.25]} rotation={[0, Math.PI / 2, 0]} />,
          <Instance key={`rear-${y}`} position={[0, y, -2.16]} />,
        ])}
      </Instances>

      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[6.38, 0.2, 4.84]} />
        <meshStandardMaterial color="#10223f" metalness={0.08} roughness={0.7} />
      </mesh>
      <mesh position={[0.9, 4.68, -0.35]} castShadow>
        <boxGeometry args={[2.18, 0.78, 1.65]} />
        <meshStandardMaterial color="#607086" roughness={0.8} />
      </mesh>
      <mesh position={[0, -4.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.3, 0.46, 5.55]} />
        <meshStandardMaterial color="#7b8999" roughness={0.88} />
      </mesh>
    </group>
  )
}

export function TowerModel({ residences, selectedId, visibleIds, onSelect }: TowerModelProps) {
  return (
    <group rotation={[0, -0.18, 0]} dispose={null}>
      <Structure />
      {residences.map((residence) => (
        <UnitBay
          key={residence.id}
          residence={residence}
          selected={residence.id === selectedId}
          visible={visibleIds.has(residence.id)}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
