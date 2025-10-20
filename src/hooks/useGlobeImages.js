import * as THREE from "three";

export const useGlobeImages = ({
  scene,
  sphereRadius,
  totalImages,
  totalItems,
  baseWidth,
  baseHeight,
}) => {
  const textureLoader = new THREE.TextureLoader();

  const getRandomImagePath = () =>
    `/images/webp/img${Math.floor(Math.random() * totalImages) + 1}.webp`;

  const createImagePlane = (texture) => {
    const imageAspect = texture.image.width / texture.image.height;
    let width = baseWidth;
    let height = baseHeight;

    if (imageAspect > 1) height = width / imageAspect;
    else width = height * imageAspect;

    return new THREE.PlaneGeometry(width, height);
  };

  const loadImageMesh = (x, y, z, onLoad) => {
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

        if (onLoad) onLoad();
      },
      undefined,
      (error) => console.error("Error loading texture:", error)
    );
  };

  const createSphere = (onAllLoaded) => {
    const offset = 2 / totalItems;
    const increment = Math.PI * (3 - Math.sqrt(5));
    let loadedCount = 0;

    for (let i = 0; i < totalItems; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r * sphereRadius;
      const z = Math.sin(phi) * r * sphereRadius;
      const posY = y * sphereRadius;

      loadImageMesh(x, posY, z, () => {
        loadedCount++;
        if (loadedCount === totalItems && onAllLoaded) onAllLoaded();
      });
    }
  };

  return { createSphere };
};
