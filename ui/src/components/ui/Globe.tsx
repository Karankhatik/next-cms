"use client";
import React, { useEffect, useRef } from "react";
import createGlobe from "cobe";
import {
  FaLocationDot
} from "react-icons/fa6";
const GlobeComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let phi = 0;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: canvas.offsetWidth * 2,
      height: canvas.offsetHeight * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      scale: 1,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: [0.0, 0.0, 0.5],
      markerColor: [1, 0.5, 1],
      glowColor: [0.0, 0.0, 0.2],
      offset: [0, 0],
      markers: [
      { location: [20.5937, 78.9629], size: 0.1 }, // India
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005; // Reduce the speed
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <div className="w-full h-full justify-center items-center relative top-19 border-2 border-[#12375c]">
      <div className="flex items-center pl-2  gap-1  mt-2">
          <FaLocationDot />
          <h1 className="text-lg">
            Navigating the world of tech
          </h1>
        </div>
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[320px] max-h-[320px]"
        width="1000"
        height="1000"
      ></canvas>
    </div>
  );
};

export default GlobeComponent;
