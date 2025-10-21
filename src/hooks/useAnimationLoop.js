import { useEffect, useRef } from "react";

export const useAnimationLoop = (renderer, scene, camera, controls) => {
  const needsRender = useRef(true);

  useEffect(() => {
    let animationId;
    let resizeTimeout;

    // Marcamos que necesitamos renderizar cuando el usuario interactúa
    const markRender = () => {
      needsRender.current = true;
    };

    controls.addEventListener("change", markRender);

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Actualizamos controls solo si está habilitado
      if (controls.enabled) controls.update();

      // Renderizamos solo si hay cambios
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
        needsRender.current = true; // renderizamos tras el resize
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
};
