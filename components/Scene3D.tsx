"use client";
import { useEffect, useRef } from "react";
import type { Material } from "three";

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    import("three").then((THREE) => {
      if (disposed || !container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 10;
      camera.position.y = 1;


      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const group = new THREE.Group();

      const wireframe = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2, 1),
        new THREE.MeshBasicMaterial({
          color: '#D3D3D3',
          wireframe: true,
          transparent: true,
          opacity: 0.55,
        })
      );
      group.add(wireframe);

      const particleCount = 220;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        const radius = 2.6 + Math.random() * 1.2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
      }
      const particlesGeometry = new THREE.BufferGeometry();
      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      const particles = new THREE.Points(
        particlesGeometry,
        new THREE.PointsMaterial({
          color: 0xffffff,
          size: 0.035,
          transparent: true,
          opacity: 0.6,
        })
      );
      group.add(particles);

      scene.add(group);

      let mouseX = 0;
      let mouseY = 0;
      function handlePointerMove(e: PointerEvent) {
        const rect = container!.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }
      window.addEventListener("pointermove", handlePointerMove);

      let frameId = 0;
      function animate() {
        group.rotation.y += 0.0025 + mouseX * 0.002;
        group.rotation.x += 0.0009 + mouseY * 0.0015;
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
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("resize", handleResize);
        wireframe.geometry.dispose();
        (wireframe.material as Material).dispose();
        particlesGeometry.dispose();
        (particles.material as Material).dispose();
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

  return <div ref={containerRef} className="w-full h-full" />;
}
