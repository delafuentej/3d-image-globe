import * as THREE from "three";

export const useGlobeImages = ({
  scene,
  sphereRadius,
  totalImages = 30,
  totalItems,
  baseWidth,
  baseHeight,
}) => {
  const textureLoader = new THREE.TextureLoader();

  //   const getRandomImagePath = () =>
  // `/images/webp/img${Math.floor(Math.random() * totalImages) + 1}.webp`;

  const preloadTextures = () => {
    const promises = [];

    for (let i = 1; i <= totalImages; i++) {
      const path = `/images/webp/img${i}.webp`;

      promises.push(
        new Promise((resolve, reject) => {
          textureLoader.load(
            path,
            (texture) => {
              // Configuración básica
              texture.generateMipmaps = false;
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;
              resolve(texture);
            },
            undefined,
            (err) => reject(err)
          );
        })
      );
    }

    return Promise.all(promises); // Devuelve un array de texturas
  };

  const createImagePlane = (texture) => {
    const imageAspect = texture.image.width / texture.image.height;
    let width = baseWidth;
    let height = baseHeight;

    if (imageAspect > 1) height = width / imageAspect;
    else width = height * imageAspect;

    return new THREE.PlaneGeometry(width, height);
  };

  const createImageMesh = (x, y, z, texture) => {
    const geometry = createImagePlane(texture);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -0.1,
      polygonOffsetUnits: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
    mesh.rotateY(Math.PI);
    scene.add(mesh);
  };
  const createSphere = async (onAllLoaded) => {
    try {
      const textures = await preloadTextures(); // ⬅️ precarga las 30 imágenes

      const offset = 2 / totalItems;
      const increment = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < totalItems; i++) {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;

        const x = Math.cos(phi) * r * sphereRadius;
        const z = Math.sin(phi) * r * sphereRadius;
        const posY = y * sphereRadius;

        // Seleccionamos una textura aleatoria de las precargadas
        const texture = textures[Math.floor(Math.random() * textures.length)];
        createImageMesh(x, posY, z, texture);
      }

      if (onAllLoaded) onAllLoaded(); // Llamamos callback cuando la esfera esté lista
    } catch (err) {
      console.error("Error cargando texturas:", err);
    }
  };

  return { createSphere };
};
