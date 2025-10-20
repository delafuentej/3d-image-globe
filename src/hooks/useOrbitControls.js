import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export const useOrbitControls = (camera, renderer) => {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 1.2;
  controls.enableZoom = true;
  controls.enablePan = false;
  return controls;
};
