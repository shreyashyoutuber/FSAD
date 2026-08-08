import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

// Item dimensions map (width, height/depth, altitude) in Three.js units
const ITEM_3D_PROPS = {
    wall:     { w: 3.5, h: 2.8, d: 0.2, color: '#64748b', shape: 'box' },
    window:   { w: 1.5, h: 1.4, d: 0.15, color: '#7dd3fc', shape: 'box', transparent: true, opacity: 0.5 },
    door:     { w: 1.0, h: 2.4, d: 0.12, color: '#d97706', shape: 'box' },
    bed:      { w: 2.0, h: 0.5, d: 2.5, color: '#6366f1', shape: 'box' },
    wardrobe: { w: 1.8, h: 2.2, d: 0.6, color: '#8b5cf6', shape: 'box' },
    sofa:     { w: 2.2, h: 0.8, d: 1.0, color: '#10b981', shape: 'box' },
    tv:       { w: 1.8, h: 1.0, d: 0.1, color: '#0f172a', shape: 'box' },
    dining:   { w: 1.8, h: 0.75, d: 1.0, color: '#f59e0b', shape: 'box' },
    kitchen:  { w: 2.5, h: 0.9, d: 0.7, color: '#ef4444', shape: 'box' },
    bathroom: { w: 1.0, h: 1.0, d: 1.4, color: '#14b8a6', shape: 'box' },
    ac:       { w: 1.2, h: 0.3, d: 0.3, color: '#3b82f6', shape: 'box' },
    plant:    { w: 0.4, h: 1.2, d: 0.4, color: '#22c55e', shape: 'cylinder' },
    light:    { w: 0.3, h: 0.3, d: 0.3, color: '#fbbf24', shape: 'sphere' },
}

function FurnitureObject({ item, roomLeft, roomTop, roomPxW, roomPxH, roomWidthFt, roomHeightFt }) {
    const meshRef = useRef()
    const props = ITEM_3D_PROPS[item.type] || ITEM_3D_PROPS.wall

    // Convert 2D canvas pixels to 3D world units
    const scaleX = roomWidthFt / roomPxW
    const scaleZ = roomHeightFt / roomPxH
    const x3 = ((item.x - roomLeft) - roomPxW / 2) * scaleX
    const z3 = ((item.y - roomTop) - roomPxH / 2) * scaleZ

    const geometry = props.shape === 'cylinder'
        ? <cylinderGeometry args={[props.w / 2, props.w / 2, props.h, 16]} />
        : props.shape === 'sphere'
        ? <sphereGeometry args={[props.w / 2, 16, 16]} />
        : <boxGeometry args={[props.w, props.h, props.d]} />

    return (
        <mesh
            ref={meshRef}
            position={[x3, props.h / 2, z3]}
            rotation-y={(item.rotation * Math.PI) / 180}
            castShadow
            receiveShadow
        >
            {geometry}
            <meshStandardMaterial
                color={props.color}
                transparent={!!props.transparent}
                opacity={props.opacity || 1}
                roughness={0.6}
                metalness={0.1}
            />
        </mesh>
    )
}

function FloorAndWalls({ roomWidthFt, roomHeightFt }) {
    const floorColor = '#f1f5f9'
    const wallColor = '#e2e8f0'
    const wallHeight = 2.8
    const halfW = roomWidthFt / 2
    const halfH = roomHeightFt / 2

    return (
        <group>
            {/* Floor */}
            <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 0]}>
                <planeGeometry args={[roomWidthFt, roomHeightFt]} />
                <meshStandardMaterial color={floorColor} roughness={0.8} />
            </mesh>

            {/* Back wall (North) */}
            <mesh position={[0, wallHeight / 2, -halfH]} receiveShadow>
                <boxGeometry args={[roomWidthFt, wallHeight, 0.15]} />
                <meshStandardMaterial color={wallColor} roughness={0.9} />
            </mesh>

            {/* Left wall (West) */}
            <mesh position={[-halfW, wallHeight / 2, 0]} receiveShadow>
                <boxGeometry args={[0.15, wallHeight, roomHeightFt]} />
                <meshStandardMaterial color={wallColor} roughness={0.9} />
            </mesh>

            {/* Right wall (East) - semi-transparent for visibility */}
            <mesh position={[halfW, wallHeight / 2, 0]}>
                <boxGeometry args={[0.15, wallHeight, roomHeightFt]} />
                <meshStandardMaterial color={wallColor} transparent opacity={0.25} roughness={0.9} />
            </mesh>

            {/* Front wall (South) - also semi-transparent */}
            <mesh position={[0, wallHeight / 2, halfH]}>
                <boxGeometry args={[roomWidthFt, wallHeight, 0.15]} />
                <meshStandardMaterial color={wallColor} transparent opacity={0.15} roughness={0.9} />
            </mesh>

            {/* Ceiling (barely visible - just for ambient) */}
            <mesh rotation-x={Math.PI / 2} position={[0, wallHeight, 0]}>
                <planeGeometry args={[roomWidthFt, roomHeightFt]} />
                <meshStandardMaterial color='#f8fafc' roughness={1} transparent opacity={0.4} side={THREE.DoubleSide} />
            </mesh>

            {/* Grid lines on floor */}
            <gridHelper args={[Math.max(roomWidthFt, roomHeightFt) + 2, 20, '#cbd5e1', '#e2e8f0']} position={[0, 0.01, 0]} />
        </group>
    )
}

function SceneContent({ items, roomLeft, roomTop, roomPxW, roomPxH, roomWidthFt, roomHeightFt }) {
    return (
        <>
            {/* Camera */}
            <PerspectiveCamera makeDefault position={[roomWidthFt * 0.8, roomHeightFt * 0.9, roomHeightFt * 1.1]} fov={50} />

            {/* Orbit Controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={40}
                maxPolarAngle={Math.PI / 2.1}
            />

            {/* Lighting */}
            <ambientLight intensity={0.5} color="#ffffff" />
            <directionalLight
                position={[roomWidthFt, roomHeightFt * 1.5, roomHeightFt]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                color="#fff8f0"
            />
            <pointLight position={[0, 2.5, 0]} intensity={0.4} color="#fef3c7" />

            {/* Room Geometry */}
            <FloorAndWalls roomWidthFt={roomWidthFt} roomHeightFt={roomHeightFt} />

            {/* All Placed Furniture */}
            {items.map(item => (
                <FurnitureObject
                    key={item.id}
                    item={item}
                    roomLeft={roomLeft}
                    roomTop={roomTop}
                    roomPxW={roomPxW}
                    roomPxH={roomPxH}
                    roomWidthFt={roomWidthFt}
                    roomHeightFt={roomHeightFt}
                />
            ))}
        </>
    )
}

export default function FloorPlanner3DViewer({ items, roomLeft, roomTop, roomPxW, roomPxH, roomWidthFt, roomHeightFt }) {
    return (
        <div style={{ width: '100%', height: '500px', borderRadius: '16px', overflow: 'hidden', background: 'linear-gradient(180deg, #e0f2fe 0%, #f1f5f9 100%)' }}>
            <Canvas shadows gl={{ antialias: true }}>
                <SceneContent
                    items={items}
                    roomLeft={roomLeft}
                    roomTop={roomTop}
                    roomPxW={roomPxW}
                    roomPxH={roomPxH}
                    roomWidthFt={roomWidthFt}
                    roomHeightFt={roomHeightFt}
                />
            </Canvas>
        </div>
    )
}
