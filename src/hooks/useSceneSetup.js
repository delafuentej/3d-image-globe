import * as THREE from "three";

export const useSceneSetup = (backgroundColor) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(parseInt(backgroundColor, 16));
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.LinearEncoding;
  renderer.gammaFactor = 2.2;

  return { scene, camera, renderer };
};
