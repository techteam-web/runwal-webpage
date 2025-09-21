import { useGLTF } from '@react-three/drei'

export function Trees(props) {
  const { nodes } = useGLTF('/model/trees-v1.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[753.803, -7.895, 570.208]} rotation={[-1.577, 0.004, -1.958]}>
        {/* tree base */}
        <mesh geometry={nodes.Tree01.geometry} >
          <meshBasicMaterial color={'#390F0F'}/>
        </mesh>

        {/* tree variation 1 */}
        <mesh
          geometry={nodes.Tree01_1.geometry}
        >
          <meshBasicMaterial color={'#355935'} />
        </mesh>
        {/* tree variation 2 */}
        <mesh
          geometry={nodes.Tree01_2.geometry}
        >
          <meshBasicMaterial color={'#1C5B11'}/>
        </mesh>

        {/* tree variation 2 */}
        <mesh
          geometry={nodes.Tree01_3.geometry}
        >
          <meshBasicMaterial color={'#445626'}/>
        </mesh>
      </group>
    </group>
  )
}

useGLTF.preload('/model/trees-v1.glb')