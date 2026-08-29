import { Html, Instance, Instances } from "@react-three/drei"
import type { ThreeEvent } from "@react-three/fiber"
import { useMemo, useState, type CSSProperties } from "react"
import * as THREE from "three"

import type { ApartmentOwnership } from "@/data/ownership"
import type { Residence } from "@/data/residences"
import type { Tower } from "@/data/towers"

type TowerModelProps = {
  tower: Tower
  selectedId: string
  visibleIds: Set<string>
  ownerships: ApartmentOwnership[]
  onSelect: (id: string) => void
}

const floorHeights = [-3.05, -1.84, -0.63, 0.58, 1.79, 3]

function UnitBay({ residence, selected, visible, tower, ownership, onSelect }: {
  residence: Residence
  selected: boolean
  visible: boolean
  tower: Tower
  ownership?: ApartmentOwnership
  onSelect: (id: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const x = residence.wing === "A" ? -1.38 : 1.38
  const y = floorHeights[residence.floor - 2]
  const terraceDepth = tower.style === "terraces" ? 0.68 + (residence.floor - 2) * 0.055 : 0.58

  const color = useMemo(() => {
    if (!visible) return new THREE.Color("#334963")
    if (selected) return new THREE.Color(tower.palette.accent)
    if (hovered) return new THREE.Color("#d8f5ff")
    if (residence.status === "preview") return new THREE.Color(tower.palette.glass).multiplyScalar(0.82)
    if (residence.status === "waitlist") return new THREE.Color("#607086")
    return new THREE.Color(tower.palette.glass)
  }, [hovered, residence.status, selected, tower.palette.accent, tower.palette.glass, visible])

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
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 1.2 : hovered && visible ? 0.62 : visible ? 0.16 : 0} metalness={0.24} roughness={0.24} />
      </mesh>

      <mesh position={[0, -0.48, 2.44 + terraceDepth / 2]} castShadow receiveShadow>
        <boxGeometry args={[2.68, 0.1, terraceDepth]} />
        <meshStandardMaterial color={tower.palette.slab} metalness={0.04} roughness={0.82} />
      </mesh>

      {[-0.82, 0, 0.82].map((mullionX) => (
        <mesh key={mullionX} position={[mullionX, 0, 2.27]}>
          <boxGeometry args={[0.055, 0.8, 0.08]} />
          <meshStandardMaterial color={tower.palette.body} roughness={0.58} />
        </mesh>
      ))}

      <mesh position={[0, -0.08, 2.78 + terraceDepth]}>
        <boxGeometry args={[2.5, 0.055, 0.055]} />
        <meshStandardMaterial color="#edf4f7" metalness={0.5} roughness={0.35} />
      </mesh>

      {ownership ? (
        <Html center distanceFactor={12} position={[0, .08, 2.91]}>
          <a
            className="tower-owner-plaque"
            href={ownership.website}
            onClick={(event) => event.stopPropagation()}
            rel="noreferrer"
            style={{ "--owner-color": ownership.brandColor } as CSSProperties}
            target="_blank"
          >
            <img alt="" src={ownership.logoUrl} />
            <span>{ownership.ownerName}</span>
          </a>
        </Html>
      ) : null}
    </group>
  )
}

function SideFacades({ tower }: { tower: Tower }) {
  return (
    <group>
      {floorHeights.flatMap((y, floorIndex) =>
        [-1.15, 0.1, 1.35].flatMap((z, windowIndex) => [
          <mesh key={`east-${y}-${z}`} position={[-2.96, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.68, 0.68, 0.06]} />
            <meshStandardMaterial color={tower.palette.glass} emissive={tower.palette.accent} emissiveIntensity={0.09} metalness={0.18} roughness={0.26} />
          </mesh>,
          <mesh key={`west-${y}-${z}`} position={[2.96, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.82, 0.62, 0.06]} />
            <meshStandardMaterial color={floorIndex === windowIndex ? tower.palette.accent : tower.palette.glass} emissive={tower.palette.accent} emissiveIntensity={0.08} metalness={0.22} roughness={0.22} />
          </mesh>,
        ]),
      )}

      <Instances limit={12} castShadow receiveShadow>
        <boxGeometry args={[0.72, 0.09, 4.65]} />
        <meshStandardMaterial color={tower.palette.slab} metalness={0.04} roughness={0.84} />
        {floorHeights.flatMap((y) => [
          <Instance key={`east-slab-${y}`} position={[-3.28, y - 0.47, 0.08]} />,
          <Instance key={`west-slab-${y}`} position={[3.28, y - 0.47, 0.08]} />,
        ])}
      </Instances>

      {[-2.7, -0.9, 0.9, 2.7].map((y) => (
        <mesh key={`east-fin-${y}`} position={[-3.34, y, 0.08]} castShadow>
          <boxGeometry args={[0.12, 0.98, 4.72]} />
          <meshStandardMaterial color={tower.palette.bodySecondary} roughness={0.72} />
        </mesh>
      ))}
    </group>
  )
}

function DistinctiveDetail({ tower }: { tower: Tower }) {
  if (tower.style === "split") {
    return (
      <group>
        <mesh position={[0, 1.55, 2.27]} castShadow>
          <boxGeometry args={[1.05, 2.45, 0.16]} />
          <meshStandardMaterial color={tower.palette.glass} emissive={tower.palette.accent} emissiveIntensity={0.18} metalness={0.28} roughness={0.18} />
        </mesh>
        <mesh position={[0, 3.35, 0]} castShadow>
          <boxGeometry args={[3.25, 0.25, 4.58]} />
          <meshStandardMaterial color={tower.palette.slab} roughness={0.76} />
        </mesh>
      </group>
    )
  }

  if (tower.style === "frame") {
    return (
      <group>
        {[-3.22, 3.22].map((x) => (
          <mesh key={x} position={[x, -0.15, 2.46]} castShadow>
            <boxGeometry args={[0.32, 8.72, 0.34]} />
            <meshStandardMaterial color={tower.palette.bodySecondary} roughness={0.82} />
          </mesh>
        ))}
        <mesh position={[0, 4.18, 2.46]} castShadow>
          <boxGeometry args={[6.62, 0.32, 0.34]} />
          <meshStandardMaterial color={tower.palette.bodySecondary} roughness={0.82} />
        </mesh>
      </group>
    )
  }

  if (tower.style === "crown") {
    return (
      <group>
        <mesh position={[-0.8, 4.5, 0]} castShadow>
          <boxGeometry args={[4.8, 0.55, 3.72]} />
          <meshStandardMaterial color={tower.palette.bodySecondary} roughness={0.72} />
        </mesh>
        <mesh position={[0.4, 4.95, -0.15]} castShadow>
          <boxGeometry args={[3.4, 0.42, 3.05]} />
          <meshStandardMaterial color={tower.palette.slab} roughness={0.76} />
        </mesh>
        <mesh position={[1.05, 5.3, -0.2]} castShadow>
          <boxGeometry args={[2.05, 0.32, 2.25]} />
          <meshStandardMaterial color={tower.palette.accent} roughness={0.5} />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      {[-2.35, 2.35].map((x) => (
        <mesh key={x} position={[x, -0.2, 2.7]} castShadow>
          <boxGeometry args={[0.18, 8.25, 0.95]} />
          <meshStandardMaterial color={tower.palette.bodySecondary} roughness={0.78} />
        </mesh>
      ))}
      <mesh position={[0, 4.62, -0.35]} castShadow>
        <boxGeometry args={[2.28, 0.82, 1.65]} />
        <meshStandardMaterial color={tower.palette.bodySecondary} roughness={0.8} />
      </mesh>
    </group>
  )
}

function Structure({ tower }: { tower: Tower }) {
  return (
    <group>
      {tower.style === "split" ? (
        <>
          <mesh position={[-1.62, -0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.7, 8.35, 4.25]} />
            <meshStandardMaterial color={tower.palette.body} metalness={0.04} roughness={0.78} />
          </mesh>
          <mesh position={[1.62, -0.18, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.7, 8.35, 4.25]} />
            <meshStandardMaterial color={tower.palette.bodySecondary} metalness={0.04} roughness={0.75} />
          </mesh>
        </>
      ) : (
        <mesh position={[0, -0.18, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.86, 8.35, 4.25]} />
          <meshStandardMaterial color={tower.palette.body} metalness={0.04} roughness={0.78} />
        </mesh>
      )}

      <Instances limit={8} castShadow receiveShadow>
        <boxGeometry args={[6.18, 0.13, 4.72]} />
        <meshStandardMaterial color={tower.palette.slab} metalness={0.05} roughness={0.84} />
        {[-4.12, -3.53, -2.32, -1.11, 0.1, 1.31, 2.52, 3.73].map((y) => (
          <Instance key={y} position={[0, y, 0.12]} />
        ))}
      </Instances>

      <SideFacades tower={tower} />
      <DistinctiveDetail tower={tower} />

      <mesh position={[0, 4.2, 0]} castShadow>
        <boxGeometry args={[6.38, 0.2, 4.84]} />
        <meshStandardMaterial color={tower.palette.body} metalness={0.08} roughness={0.7} />
      </mesh>
      <mesh position={[0, -4.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.3, 0.46, 5.55]} />
        <meshStandardMaterial color="#718497" roughness={0.88} />
      </mesh>
    </group>
  )
}

export function TowerModel({ tower, selectedId, visibleIds, ownerships, onSelect }: TowerModelProps) {
  const ownersByUnit = useMemo(
    () => new Map(ownerships.filter((owner) => owner.towerId === tower.id).map((owner) => [owner.unit, owner])),
    [ownerships, tower.id],
  )

  return (
    <group rotation={[0, -0.18, 0]} dispose={null}>
      <Structure tower={tower} />
      {tower.residences.map((residence) => (
        <UnitBay key={residence.id} residence={residence} selected={residence.id === selectedId} visible={visibleIds.has(residence.id)} tower={tower} ownership={ownersByUnit.get(residence.unit)} onSelect={onSelect} />
      ))}
    </group>
  )
}
