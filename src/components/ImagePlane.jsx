// components/three/ImagePlane.js
import * as THREE from "three";

export const createImagePlane = (texture, baseWidth, baseHeight) => {
  const imageAspect = texture.image.width / texture.image.height;
  let width = baseWidth;
  let height = baseHeight;

  if (imageAspect > 1) {
    height = width / imageAspect;
  } else {
    width = height * imageAspect;
  }

  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geometry, material);
};
