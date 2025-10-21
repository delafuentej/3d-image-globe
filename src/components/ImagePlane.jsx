// components/three/ImagePlane.js
import { PlaneGeometry, MeshBasicMaterial, Mesh, DoubleSide } from "three";

export const createImagePlane = (texture, baseWidth, baseHeight) => {
  const imageAspect = texture.image.width / texture.image.height;
  let width = baseWidth;
  let height = baseHeight;

  if (imageAspect > 1) {
    height = width / imageAspect;
  } else {
    width = height * imageAspect;
  }

  const geometry = new PlaneGeometry(width, height);
  const material = new MeshBasicMaterial({
    map: texture,
    side: DoubleSide,
  });

  return new Mesh(geometry, material);
};
