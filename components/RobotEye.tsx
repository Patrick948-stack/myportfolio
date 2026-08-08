"use client";
import { useEffect, useRef } from "react";
import type { Material, Mesh, Object3D } from "three";

const MODEL_URL = "/models/robotic_eye.glb";

const MAX_YAW = 0.5;
const MAX_PITCH = 0.35;
const TRACK_LERP = 0.12;

const SHAKE_DURATION = 220;
const SHAKE_CYCLES = 5;
const SHAKE_AMPLITUDE = 0.4;
const SPIN_DURATION = 260;
const CLICK_ANIM_DURATION = SHAKE_DURATION + SPIN_DURATION;

export default function RobotEye() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    Promise.all([
      import("three"),
      import("three/addons/loaders/GLTFLoader.js"),
      import("three/addons/environments/RoomEnvironment.js"),
    ]).then(([THREE, { GLTFLoader }, { RoomEnvironment }]) => {
      if (disposed || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 4.5);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;
      pmremGenerator.dispose();

      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(2, 3, 4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xff004f, 0.6);
      rim.position.set(-3, -1, -2);
      scene.add(rim);

      const pivot = new THREE.Group();
      scene.add(pivot);

      let hitTargets: Object3D[] = [];
      let loaded = false;

      const loader = new GLTFLoader();
      loader.load(
        MODEL_URL,
        (gltf) => {
          if (disposed) return;
          const model = gltf.scene;

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const scale = 2.2 / maxDim;

          model.scale.setScalar(scale);
          model.position.set(
            -center.x * scale,
            -center.y * scale,
            -center.z * scale
          );

          pivot.add(model);
          hitTargets = [model];
          loaded = true;
        },
        undefined,
        (err) => {
          console.error("RobotEye: failed to load model", err);
        }
      );

      let mouseNdcX = 0;
      let mouseNdcY = 0;
      function handleMouseMove(e: MouseEvent) {
        mouseNdcX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseNdcY = -((e.clientY / window.innerHeight) * 2 - 1);
      }
      window.addEventListener("mousemove", handleMouseMove);

      let targetYaw = 0;
      let targetPitch = 0;
      let currentYaw = 0;
      let currentPitch = 0;
      let clickAnimStart: number | null = null;

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      function handleClick(e: MouseEvent) {
        if (!loaded) return;
        const rect = renderer.domElement.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          return;
        }
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersections = raycaster.intersectObjects(hitTargets, true);
        if (intersections.length > 0) {
          clickAnimStart = performance.now();
        }
      }
      window.addEventListener("click", handleClick);

      let frameId = 0;
      function animate() {
        targetYaw = mouseNdcX * MAX_YAW;
        targetPitch = mouseNdcY * MAX_PITCH;

        currentYaw += (targetYaw - currentYaw) * TRACK_LERP;
        currentPitch += (targetPitch - currentPitch) * TRACK_LERP;

        let yawOffset = 0;
        if (clickAnimStart !== null) {
          const elapsed = performance.now() - clickAnimStart;
          if (elapsed < SHAKE_DURATION) {
            const t = elapsed / SHAKE_DURATION;
            const decay = 1 - t;
            yawOffset =
              Math.sin(t * Math.PI * 2 * SHAKE_CYCLES) *
              SHAKE_AMPLITUDE *
              decay;
          } else if (elapsed < CLICK_ANIM_DURATION) {
            const t = (elapsed - SHAKE_DURATION) / SPIN_DURATION;
            const eased = t * t * (3 - 2 * t);
            yawOffset = eased * Math.PI * 2;
          } else {
            clickAnimStart = null;
          }
        }

        pivot.rotation.y = currentYaw + yawOffset;
        pivot.rotation.x = -currentPitch;
        pivot.rotation.z = 0;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      }

      if (reducedMotion) {
        renderer.render(scene, camera);
      } else {
        animate();
      }

      function handleResize() {
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      window.addEventListener("resize", handleResize);

      cleanup = () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
        pivot.traverse((obj) => {
          const mesh = obj as Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const material = mesh.material as Material | Material[] | undefined;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else if (material) {
            material.dispose();
          }
        });
        scene.environment?.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto h-full w-full cursor-pointer"
    />
  );
}
