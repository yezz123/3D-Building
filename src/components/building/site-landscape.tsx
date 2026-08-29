import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type { Group } from "three"

const trees = [
  [-7.4, -1.7, 1.15, "#4f8f4a"], [-6.7, 1.6, .92, "#69a957"], [-8.4, 2.8, 1.1, "#2f7650"],
  [7.2, -2.1, 1.08, "#69a957"], [8.1, .5, .9, "#4f8f4a"], [6.8, 3.1, 1.2, "#2f7650"],
] as const

function Tree({ x, z, scale, color }: { x: number; z: number; scale: number; color: string }) {
  return (
    <group position={[x, -4.48, z]} scale={scale}>
      <mesh castShadow position={[0, .58, 0]}>
        <cylinderGeometry args={[.11, .16, 1.15, 8]} />
        <meshStandardMaterial color="#7b5438" roughness={.92} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <icosahedronGeometry args={[.68, 1]} />
        <meshStandardMaterial color={color} roughness={.84} />
      </mesh>
      <mesh castShadow position={[-.35, 1.18, .12]}>
        <icosahedronGeometry args={[.42, 1]} />
        <meshStandardMaterial color="#8bbf61" roughness={.86} />
      </mesh>
    </group>
  )
}

function Person({ shirt, trousers = "#173b5a" }: { shirt: string; trousers?: string }) {
  return (
    <group>
      <mesh castShadow position={[0, .95, 0]}><sphereGeometry args={[.12, 12, 8]} /><meshStandardMaterial color="#b97758" roughness={.8} /></mesh>
      <mesh castShadow position={[0, .58, 0]}><capsuleGeometry args={[.13, .42, 4, 8]} /><meshStandardMaterial color={shirt} roughness={.78} /></mesh>
      <mesh castShadow position={[-.075, .2, 0]} rotation={[0, 0, .04]}><capsuleGeometry args={[.045, .27, 3, 6]} /><meshStandardMaterial color={trousers} roughness={.84} /></mesh>
      <mesh castShadow position={[.075, .2, 0]} rotation={[0, 0, -.04]}><capsuleGeometry args={[.045, .27, 3, 6]} /><meshStandardMaterial color={trousers} roughness={.84} /></mesh>
    </group>
  )
}

function Dog() {
  return (
    <group position={[.55, .07, .12]} scale={.72}>
      <mesh castShadow position={[0, .28, 0]}><capsuleGeometry args={[.1, .34, 4, 8]} /><meshStandardMaterial color="#d89d58" roughness={.9} /></mesh>
      <mesh castShadow position={[.28, .35, 0]}><sphereGeometry args={[.14, 10, 8]} /><meshStandardMaterial color="#ca8242" roughness={.9} /></mesh>
      <mesh castShadow position={[.33, .45, .07]} rotation={[.25, 0, -.4]}><coneGeometry args={[.06, .18, 6]} /><meshStandardMaterial color="#6e4734" roughness={.9} /></mesh>
      {[-.12, .13].flatMap((x) => [-.08, .08].map((z) => (
        <mesh castShadow key={`${x}-${z}`} position={[x, .09, z]}><cylinderGeometry args={[.025, .032, .25, 6]} /><meshStandardMaterial color="#9a653d" /></mesh>
      )))}
      <mesh castShadow position={[-.35, .38, 0]} rotation={[0, 0, -.8]}><cylinderGeometry args={[.025, .035, .34, 6]} /><meshStandardMaterial color="#ca8242" /></mesh>
    </group>
  )
}

function WalkingGroup({ reducedMotion }: { reducedMotion: boolean }) {
  const group = useRef<Group>(null)
  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return
    const t = clock.elapsedTime * .18
    group.current.position.x = Math.sin(t) * 3.1 - 5.1
    group.current.position.z = Math.cos(t) * 1.25 + 1.1
    group.current.rotation.y = -t + Math.PI / 2
  })

  return (
    <group ref={group} position={[-6.7, -4.43, 1.5]} scale={.78}>
      <Person shirt="#ff785a" />
      <Dog />
    </group>
  )
}

function Bench({ x, z, rotation = 0 }: { x: number; z: number; rotation?: number }) {
  return (
    <group position={[x, -4.28, z]} rotation={[0, rotation, 0]}>
      <mesh castShadow><boxGeometry args={[1.05, .12, .28]} /><meshStandardMaterial color="#e0b86c" roughness={.8} /></mesh>
      <mesh castShadow position={[0, .27, .13]} rotation={[-.16, 0, 0]}><boxGeometry args={[1.05, .42, .1]} /><meshStandardMaterial color="#d49b4b" roughness={.82} /></mesh>
      {[-.4, .4].map((xLeg) => <mesh key={xLeg} position={[xLeg, -.18, 0]}><boxGeometry args={[.08, .35, .18]} /><meshStandardMaterial color="#173b5a" /></mesh>)}
    </group>
  )
}

export function SiteLandscape({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <group>
      <mesh receiveShadow position={[-7.1, -4.54, .3]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.45, 2.15, 1]}>
        <circleGeometry args={[2.25, 48]} />
        <meshStandardMaterial color="#b8d98b" roughness={.98} />
      </mesh>
      <mesh receiveShadow position={[7.3, -4.54, .45]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.38, 2.08, 1]}>
        <circleGeometry args={[2.25, 48]} />
        <meshStandardMaterial color="#cbe6a3" roughness={.98} />
      </mesh>
      <mesh receiveShadow position={[0, -4.53, 5.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[17.5, 1.45, .05]} />
        <meshStandardMaterial color="#f0d8ac" roughness={.92} />
      </mesh>
      <mesh receiveShadow position={[0, -4.515, 5.24]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[17.5, .09, .06]} />
        <meshStandardMaterial color="#ffbf69" roughness={.72} />
      </mesh>
      {trees.map(([x, z, scale, color]) => <Tree color={color} key={`${x}-${z}`} scale={scale} x={x} z={z} />)}
      <WalkingGroup reducedMotion={reducedMotion} />
      <group position={[5.9, -4.43, 2]} rotation={[0, -1.2, 0]} scale={.72}><Person shirt="#ffd166" trousers="#744c78" /></group>
      <group position={[7.2, -4.43, -.2]} rotation={[0, 2.3, 0]} scale={.7}><Person shirt="#7cdbd5" /></group>
      <Bench x={-7.2} z={3.2} rotation={-.28} />
      <Bench x={7.1} z={3.25} rotation={.25} />
    </group>
  )
}
