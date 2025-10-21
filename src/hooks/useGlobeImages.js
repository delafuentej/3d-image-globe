import {
  TextureLoader,
  LinearFilter,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  DoubleSide,
  Color,
} from "three";
import { useEffect, useRef } from "react";

export const useGlobeImages = ({
  scene,
  sphereRadius,
  totalImages = 30,
  totalItems = 100,
  baseWidth = 1,
  baseHeight = 1,
  camera,
  renderer,
  controls,
}) => {
  const needsRender = useRef(true);
  const geometry = new PlaneGeometry(baseWidth, baseHeight);

  // Tamaño adaptativo según pantalla
  //   const getResponsiveSize = () => {
  // const width = window.innerWidth;
  // if (width <= 720) return 720;
  // if (width <= 1080) return 1080;
  // return 1920;
  //   };

  // Precarga de texturas
  const preloadTextures = async () => {
    const loader = new TextureLoader();
    const textures = [];

    for (let i = 1; i <= totalImages; i++) {
      // const size = getResponsiveSize();
      const path = `/images-optimized/img${i}-1080.webp`;

      const texture = await new Promise((resolve, reject) => {
        loader.load(path, resolve, undefined, reject);
      });

      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      texture.magFilter = LinearFilter;

      textures.push(texture);
    }

    return textures;
  };

  // Crear un mesh para cada imagen
  const createImageMesh = (x, y, z, texture) => {
    const aspect = texture.image
      ? texture.image.width / texture.image.height
      : 1;
    let width = baseWidth;
    let height = baseHeight;

    if (aspect > 1) height = width / aspect;
    else width = height * aspect;

    // const geometry = new PlaneGeometry(width, height);
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    scene.add(mesh);
  };

  // Crear esfera con todos los meshes
  const createSphere = async () => {
    try {
      const textures = await preloadTextures();

      const offset = 2 / totalItems;
      const increment = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < totalItems; i++) {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r * sphereRadius;
        const z = Math.sin(phi) * r * sphereRadius;
        const posY = y * sphereRadius;

        const textureIndex = i % textures.length;

        const texture = textures[textureIndex];
        createImageMesh(x, posY, z, texture);
      }

      needsRender.current = true;
    } catch (err) {
      console.error("Error cargando texturas:", err);
    }
  };

  // Loop de animación optimizado
  useEffect(() => {
    if (!controls) return;

    let animationId;
    let resizeTimeout;

    const markRender = () => {
      needsRender.current = true;
    };

    controls.addEventListener("change", markRender);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (controls.enabled) controls.update();

      if (needsRender.current) {
        renderer.render(scene, camera);
        needsRender.current = false;
      }
    };

    animate();

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        needsRender.current = true;
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      controls.removeEventListener("change", markRender);
      clearTimeout(resizeTimeout);
    };
  }, [renderer, scene, camera, controls]);

  return { createSphere };
};
