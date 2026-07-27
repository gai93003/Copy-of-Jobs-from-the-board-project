import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import "./ThreeBackground.css";

const HDR_URL =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/equirectangular/venice_sunset_1k.hdr";
const LAMP_URL =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/IridescenceLamp/glTF-Binary/IridescenceLamp.glb";

function ThreeBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.05, 20);
    camera.position.set(0.35, 0.05, 0.35);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = -0.5;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
    controls.target.set(0, 0.2, 0);
    controls.update();

    let fallbackMesh = null;

    const addFallbackModel = () => {
      if (fallbackMesh) {
        return;
      }

      scene.background = new THREE.Color("#0b1220");

      const fallbackGeometry = new THREE.TorusKnotGeometry(0.13, 0.05, 220, 32);
      const fallbackMaterial = new THREE.MeshPhysicalMaterial({
        color: "#f7f8ff",
        metalness: 0.75,
        roughness: 0.18,
        clearcoat: 1,
        iridescence: 1,
        iridescenceIOR: 1.3,
        iridescenceThicknessRange: [150, 450],
      });

      fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
      fallbackMesh.position.set(0, 0.2, 0);
      scene.add(fallbackMesh);

      const keyLight = new THREE.DirectionalLight("#ffffff", 2);
      keyLight.position.set(1.2, 1.8, 1.4);
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight("#80a7ff", 1.25);
      rimLight.position.set(-1.8, 1.1, -1.4);
      scene.add(rimLight);

      const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
      scene.add(ambientLight);
    };

    const loadScene = async () => {
      const hdrLoader = new HDRLoader();
      const gltfLoader = new GLTFLoader();

      try {
        const [texture, gltf] = await Promise.all([
          hdrLoader.loadAsync(HDR_URL),
          gltfLoader.loadAsync(LAMP_URL),
        ]);

        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
        scene.add(gltf.scene);
      } catch (error) {
        console.warn("Background assets failed to load, using fallback model.", error);
        addFallbackModel();
      }
    };

    loadScene();

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", onWindowResize);

    const animate = () => {
      const elapsed = performance.now() * 0.001;
      if (fallbackMesh) {
        fallbackMesh.rotation.y = elapsed * 0.35;
        fallbackMesh.rotation.x = Math.sin(elapsed * 0.4) * 0.15;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(animate);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.setAnimationLoop(null);
      controls.dispose();
      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }

        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="three-background" aria-hidden="true" />;
}

export default ThreeBackground;
