import { useEffect, useRef, useState } from "react";
import { useSceneSetup } from "../hooks/useSceneSetup";
import { useOrbitControls } from "../hooks/useOrbitControls";
import { useGlobeImages } from "../hooks/useGlobeImages";
import { useAnimationLoop } from "../hooks/useAnimationLoop";

const Globe = ({
  totalImages = 30,
  totalItems = 120,
  baseWidth = 1,
  baseHeight = 0.6,
  sphereRadius = 5,
  backgroundColor = "#1d1d1d",
}) => {
  const globeRef = useRef(null);
  const { scene, camera, renderer } = useSceneSetup(backgroundColor);
  const controls = useOrbitControls(camera, renderer);
  const { createSphere } = useGlobeImages({
    scene,
    sphereRadius,
    totalImages,
    totalItems,
    baseWidth,
    baseHeight,
  });

  // Estado para activar la animación solo cuando las imágenes hayan cargado
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Hook que maneja el loop de animación
  useAnimationLoop(renderer, scene, camera, controls, imagesLoaded);

  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.appendChild(renderer.domElement);
    camera.position.z = 10;

    createSphere(() => {
      // activa el hook de animación
      setImagesLoaded(true);
    });

    return () => {
      if (globeRef.current?.contains(renderer.domElement)) {
        globeRef.current.removeChild(renderer.domElement);
      }
    };
  }, [createSphere, renderer, scene, camera, controls]);

  return <div ref={globeRef} className="globe" />;
};

export default Globe;
