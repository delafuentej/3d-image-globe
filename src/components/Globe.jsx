import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useSceneSetup } from "../hooks/useSceneSetup";
import { useOrbitControls } from "../hooks/useOrbitControls";

const Globe = ({
  totalImages = 30,
  totalItems = 100,
  baseWidth = 1,
  baseHeight = 0.6,
  sphereRadius = 5,
  backgroundColor = "#1d1d1d",
}) => {
  const globeRef = useRef(null);
  const { scene, camera, renderer } = useSceneSetup(backgroundColor);
  const controls = useOrbitControls(camera, renderer);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;

    const getRandomImagePath = () =>
      `/images/img${Math.floor(Math.random() * totalImages) + 1}.jpg`;

    const createImagePlane = (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      let width = baseWidth;
      let height = baseHeight;

      if (imageAspect > 1) height = width / imageAspect;
      else width = height * imageAspect;

      return new THREE.PlaneGeometry(width, height);
    };

    const loadImageMesh = (x, y, z) => {
      textureLoader.load(
        getRandomImagePath(),
        (texture) => {
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const geometry = createImagePlane(texture);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            depthWrite: true,
            depthTest: true,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(x, y, z);
          mesh.lookAt(0, 0, 0);
          mesh.rotateY(Math.PI); // para que la imagen mire hacia afuera

          scene.add(mesh);

          loadedCount++;
          if (loadedCount === totalItems) animate();
        },
        undefined,
        (error) => console.error("Error loading texture:", error)
      );
    };

    // ✅ Distribución Fibonacci Sphere
    const createSphere = () => {
      const offset = 2 / totalItems;
      const increment = Math.PI * (3 - Math.sqrt(5)); // número áureo

      for (let i = 0; i < totalItems; i++) {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r * sphereRadius;
        const z = Math.sin(phi) * r * sphereRadius;
        const posY = y * sphereRadius;

        loadImageMesh(x, posY, z);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    camera.position.z = 10;
    createSphere();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (globeRef.current?.contains(renderer.domElement)) {
        globeRef.current.removeChild(renderer.domElement);
      }
    };
  }, [
    totalImages,
    totalItems,
    baseWidth,
    baseHeight,
    sphereRadius,
    backgroundColor,
    scene,
    camera,
    renderer,
    controls,
  ]);

  return <div ref={globeRef} className="globe"></div>;
};

export default Globe;
