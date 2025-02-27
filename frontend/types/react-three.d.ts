// types/react-three.d.ts
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: ReactThreeFiber.Node<THREE.Mesh, typeof THREE.Mesh>;
      sphereGeometry: ReactThreeFiber.Node<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      meshStandardMaterial: ReactThreeFiber.Node<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      ambientLight: ReactThreeFiber.Node<THREE.AmbientLight, typeof THREE.AmbientLight>;
      pointLight: ReactThreeFiber.Node<THREE.PointLight, typeof THREE.PointLight>;
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    mesh: ReactThreeFiber.Node<THREE.Mesh, typeof THREE.Mesh>;
    sphereGeometry: ReactThreeFiber.Node<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    meshStandardMaterial: ReactThreeFiber.Node<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    ambientLight: ReactThreeFiber.Node<THREE.AmbientLight, typeof THREE.AmbientLight>;
    pointLight: ReactThreeFiber.Node<THREE.PointLight, typeof THREE.PointLight>;
  }
}