"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Eye, RotateCcw, Flame, Droplets, ZoomIn, ZoomOut, Sun, Moon, Info, Sparkle } from "lucide-react";

export interface ThreeProductViewerProps {
  initialModel?: "elixir" | "soap" | "candle";
  variant?: "hero" | "studio" | "detail";
  className?: string;
  autoRotate?: boolean;
}

export function ThreeProductViewer({
  initialModel = "elixir",
  variant = "hero",
  className = "",
  autoRotate = true,
}: ThreeProductViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelType, setModelType] = useState<"elixir" | "soap" | "candle">(initialModel);
  const [lightingMode, setLightingMode] = useState<"golden" | "twilight" | "studio">("golden");
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Mouse & Camera state
  const mouseState = useRef({
    isDown: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.12,
    rotY: 0.45,
    targetRotX: 0.12,
    targetRotY: 0.45,
    zoom: 3.8,
    targetZoom: 3.8,
  });

  // Hotspots definitions
  const hotspots = modelType === "elixir" ? [
    { id: "dropper", title: "Gold Glass Pipette", desc: "Precision apothecary dropper dispensing exact micro-doses directly to scalp part lines." },
    { id: "oil", title: "Cold-Pressed Rosemary & Amla", desc: "Micro-filtered cold-pressed plant extracts rich in antioxidants, squalene, and fatty acids." },
    { id: "glass", title: "UV-Shielded Amber Bottle", desc: "Protects delicate phytochemicals from light degradation for maximum freshness." }
  ] : modelType === "soap" ? [
    { id: "cure", title: "6-Week Cold-Process Cure", desc: "Slow traditional saponification preserving active natural plant glycerin and skin barrier lipids." },
    { id: "clay", title: "French Green Clay & Tea Tree", desc: "Mineral-rich clay drawing deep pore impurities while Australian tea tree calms irritation." },
    { id: "paper", title: "Compostable Kraft Belly Band", desc: "100% plastic-free packaging printed with vegetable inks and tied with jute twine." }
  ] : [
    { id: "flame", title: "Lead-Free Cotton Wick", desc: "Unbleached organic cotton wick centered by hand for a soot-free 55-hour burn." },
    { id: "wax", title: "Coconut & Soy Wax Blend", desc: "Renewable non-GMO plant wax scented with pure therapeutic-grade essential oils." },
    { id: "glass", title: "Amber Keepsake Vessel", desc: "Heavyweight apothecary glass vessel designed for eternal repurposing as a desk pot." }
  ];

  // 1. Initial Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 3.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfdfbf7, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.5);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const rimLight = new THREE.DirectionalLight(0x82947b, 1.4);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const fillLight = new THREE.DirectionalLight(0xe8ede4, 0.9);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    const flameLight = new THREE.PointLight(0xff9933, 2.8, 5.0);
    flameLight.position.set(0, 0.72, 0);
    scene.add(flameLight);
    flameLightRef.current = flameLight;

    // --- Model Group ---
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Build the initial model
    buildProductModel(modelGroup, modelType);

    // --- Floating Golden Botanical Pollen ---
    const particleCount = 75;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 4.4;
      positions[i + 1] = (Math.random() - 0.5) * 3.8 + 0.2;
      positions[i + 2] = (Math.random() - 0.5) * 3.4;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd7c8b2,
      size: 0.05,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // --- Shadow Pedestal ---
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.22 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.92;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // --- Mouse & Touch Controls ---
    const handleMouseDown = (e: MouseEvent) => {
      mouseState.current.isDown = true;
      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;
      setIsDragging(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseState.current.isDown) {
        // Parallax hover when idle
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        camera.position.x = normX * 0.3;
        camera.position.y = 0.5 + normY * 0.15;
        camera.lookAt(0, 0, 0);
        return;
      }

      const deltaX = e.clientX - mouseState.current.prevX;
      const deltaY = e.clientY - mouseState.current.prevY;
      mouseState.current.prevX = e.clientX;
      mouseState.current.prevY = e.clientY;

      mouseState.current.targetRotY += deltaX * 0.012;
      mouseState.current.targetRotX += deltaY * 0.012;
      mouseState.current.targetRotX = Math.max(-0.4, Math.min(0.5, mouseState.current.targetRotX));
    };

    const handleMouseUp = () => {
      mouseState.current.isDown = false;
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      mouseState.current.targetZoom += e.deltaY * 0.002;
      mouseState.current.targetZoom = Math.max(2.5, Math.min(5.2, mouseState.current.targetZoom));
    };

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseState.current.isDown = true;
        mouseState.current.prevX = e.touches[0].clientX;
        mouseState.current.prevY = e.touches[0].clientY;
        setIsDragging(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (mouseState.current.isDown && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - mouseState.current.prevX;
        const deltaY = e.touches[0].clientY - mouseState.current.prevY;
        mouseState.current.prevX = e.touches[0].clientX;
        mouseState.current.prevY = e.touches[0].clientY;

        mouseState.current.targetRotY += deltaX * 0.014;
        mouseState.current.targetRotX += deltaY * 0.014;
        mouseState.current.targetRotX = Math.max(-0.4, Math.min(0.5, mouseState.current.targetRotX));
      }
    };

    const handleTouchEnd = () => {
      mouseState.current.isDown = false;
      setIsDragging(false);
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (isRotating && !mouseState.current.isDown) {
        mouseState.current.targetRotY += 0.005;
      }

      // Smooth interpolation
      mouseState.current.rotX += (mouseState.current.targetRotX - mouseState.current.rotX) * 0.08;
      mouseState.current.rotY += (mouseState.current.targetRotY - mouseState.current.rotY) * 0.08;
      mouseState.current.zoom += (mouseState.current.targetZoom - mouseState.current.zoom) * 0.1;

      camera.position.z = mouseState.current.zoom;

      if (modelGroupRef.current) {
        modelGroupRef.current.rotation.x = mouseState.current.rotX;
        modelGroupRef.current.rotation.y = mouseState.current.rotY;
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.6) * 0.035;
      }

      // Flame flicker (only for candle)
      if (flameLightRef.current && modelType === "candle") {
        flameLightRef.current.intensity = 2.4 + Math.sin(elapsedTime * 15) * 0.4 + Math.cos(elapsedTime * 24) * 0.25;
      } else if (flameLightRef.current) {
        flameLightRef.current.intensity = 0;
      }

      // Drift pollen particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
        const posArray = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < posArray.length; i += 3) {
          posArray[i] += Math.sin(elapsedTime + i) * 0.001;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating]);

  // 2. Dynamic Model Switching
  useEffect(() => {
    if (modelGroupRef.current) {
      buildProductModel(modelGroupRef.current, modelType);
    }
  }, [modelType]);

  // 3. Dynamic Lighting Presets
  useEffect(() => {
    if (!keyLightRef.current || !ambientLightRef.current || !rimLightRef.current) return;

    if (lightingMode === "golden") {
      keyLightRef.current.color.setHex(0xfff1dc);
      keyLightRef.current.intensity = 2.5;
      ambientLightRef.current.color.setHex(0xfdfbf7);
      ambientLightRef.current.intensity = 0.9;
      rimLightRef.current.color.setHex(0xd7c8b2);
    } else if (lightingMode === "twilight") {
      keyLightRef.current.color.setHex(0x8faec7);
      keyLightRef.current.intensity = 1.7;
      ambientLightRef.current.color.setHex(0x313d44);
      ambientLightRef.current.intensity = 0.6;
      rimLightRef.current.color.setHex(0x567366);
    } else if (lightingMode === "studio") {
      keyLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 2.6;
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.0;
      rimLightRef.current.color.setHex(0x82947b);
    }
  }, [lightingMode]);

  const handleZoom = (direction: "in" | "out") => {
    const delta = direction === "in" ? -0.4 : 0.4;
    mouseState.current.targetZoom = Math.max(2.5, Math.min(5.2, mouseState.current.targetZoom + delta));
  };

  const resetOrientation = () => {
    mouseState.current.targetRotX = 0.12;
    mouseState.current.targetRotY = 0.45;
    mouseState.current.targetZoom = 3.8;
  };

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      
      {/* 3D Canvas Viewport */}
      <div
        ref={containerRef}
        className={`w-full relative overflow-hidden rounded-[4px] border border-[#E2DDD2] shadow-inner transition-all duration-300 cursor-grab active:cursor-grabbing ${
          variant === "hero"
            ? "h-[450px] sm:h-[510px] lg:h-[550px] bg-gradient-to-b from-[#FAF7F0] via-[#F3EFE6] to-[#E9E1D2]"
            : variant === "studio"
            ? "h-[500px] sm:h-[580px] lg:h-[620px] bg-gradient-to-b from-[#14211A] via-[#1B2B23] to-[#121C16]"
            : "h-[400px] sm:h-[460px] bg-gradient-to-b from-[#FAF7F0] to-[#EFE8DC]"
        }`}
      />

      {/* Top Floating Utility Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E231C] text-[#FBF9F3] text-[11px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-xs border border-forest-800">
          <Sparkles className="w-3.5 h-3.5 text-sand-300" />
          <span>Live 3D Atelier</span>
        </span>

        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`px-3 py-1 rounded-full text-[11px] font-medium border backdrop-blur-xs transition-all cursor-pointer ${
            isRotating
              ? "bg-[#0E231C] text-white border-[#0E231C]"
              : "bg-white/90 text-[#4A514B] border-[#E2DDD2] hover:bg-white"
          }`}
          title="Toggle 360° Auto Rotation"
        >
          {isRotating ? "Auto-Spin: ON" : "Auto-Spin: PAUSED"}
        </button>
      </div>

      {/* Lighting Mode Selector (Studio & Hero) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md border border-[#E2DDD2] rounded-full shadow-xs">
        <button
          onClick={() => setLightingMode("golden")}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            lightingMode === "golden" ? "bg-[#0E231C] text-amber-300 shadow-xs" : "text-[#4A514B] hover:text-[#0E231C]"
          }`}
          title="Golden Hour Light"
        >
          <Sun className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setLightingMode("twilight")}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            lightingMode === "twilight" ? "bg-[#0E231C] text-indigo-300 shadow-xs" : "text-[#4A514B] hover:text-[#0E231C]"
          }`}
          title="Serene Twilight Mood"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setLightingMode("studio")}
          className={`p-1.5 rounded-full transition-all cursor-pointer ${
            lightingMode === "studio" ? "bg-[#0E231C] text-white shadow-xs" : "text-[#4A514B] hover:text-[#0E231C]"
          }`}
          title="Clean Botanical Daylight"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Model Controls Bar */}
      <div className="absolute bottom-4 inset-x-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Model Switcher: Hair Oil (Default), Soap Bar (Primary), Candle (Option) */}
        <div className="flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md border border-[#E2DDD2] rounded-full shadow-sm pointer-events-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setModelType("elixir")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex-shrink-0 ${
              modelType === "elixir"
                ? "bg-[#0E231C] text-white shadow-xs"
                : "text-[#4A514B] hover:text-[#0E231C]"
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sand-300" />
            <span>Hair Scalp Oil</span>
          </button>

          <button
            onClick={() => setModelType("soap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex-shrink-0 ${
              modelType === "soap"
                ? "bg-[#0E231C] text-white shadow-xs"
                : "text-[#4A514B] hover:text-[#0E231C]"
            }`}
          >
            <Sparkle className="w-3.5 h-3.5 text-sage-500" />
            <span>Artisan Soap Bar</span>
          </button>

          <button
            onClick={() => setModelType("candle")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer flex-shrink-0 ${
              modelType === "candle"
                ? "bg-[#0E231C] text-white shadow-xs"
                : "text-[#4A514B] hover:text-[#0E231C]"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Candle (Option)</span>
          </button>
        </div>

        {/* Viewport Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => handleZoom("in")}
            className="p-2 rounded-full bg-white/90 text-[#4A514B] hover:text-[#0E231C] border border-[#E2DDD2] shadow-xs backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom("out")}
            className="p-2 rounded-full bg-white/90 text-[#4A514B] hover:text-[#0E231C] border border-[#E2DDD2] shadow-xs backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetOrientation}
            className="p-2 rounded-full bg-white/90 text-[#4A514B] hover:text-[#0E231C] border border-[#E2DDD2] shadow-xs backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            title="Reset 3D camera angle"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hotspots Info Callouts (If active or in studio mode) */}
      {variant === "studio" && (
        <div className="w-full mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          {hotspots.map((h) => (
            <div
              key={h.id}
              onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
              className={`p-4 rounded-[3px] border transition-all cursor-pointer ${
                activeHotspot === h.id
                  ? "bg-[#0E231C] text-white border-forest-700 shadow-md ring-1 ring-forest-600"
                  : "bg-white text-[#1B1C19] border-[#E2DDD2] hover:border-sand-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-3.5 h-3.5 text-sage-500" />
                <h4 className="font-display font-medium text-sm">{h.title}</h4>
              </div>
              <p className={`text-xs leading-relaxed font-light ${activeHotspot === h.id ? "text-ivory-100/90" : "text-[#4A514B]"}`}>
                {h.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tactile interaction prompt */}
      <div className="mt-2.5 text-center">
        <p className="text-[11px] text-[#4A514B] tracking-wide font-light flex items-center justify-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-forest-700" />
          <span>Click & drag to inspect botanical materials in 360° • Select hair oil, soap, or candle above</span>
        </p>
      </div>

    </div>
  );
}

/**
 * Procedural 3D Geometry Builder with High-Res Canvas Textures
 */
function buildProductModel(group: THREE.Group, type: "elixir" | "soap" | "candle") {
  // Dispose and clear existing children
  while (group.children.length > 0) {
    const obj = group.children[0];
    group.remove(obj);
    if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
  }

  if (type === "elixir") {
    // ----------------------------------------------------
    // BOTANICAL DROPPER ELIXIR BOTTLE MODEL (HAIR OIL)
    // ----------------------------------------------------

    // 1. Amber Glass Bottle Body
    const bottleGeo = new THREE.CylinderGeometry(0.58, 0.56, 1.35, 48);
    const bottleMat = new THREE.MeshPhysicalMaterial({
      color: 0x3d200a, // Rich dark amber apothecary glass
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.75,
      thickness: 0.35,
      transparent: true,
      opacity: 0.95,
    });
    const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
    bottleMesh.castShadow = true;
    group.add(bottleMesh);

    // 2. Liquid Interior (Golden Herbal Rosemary Infusion)
    const liquidGeo = new THREE.CylinderGeometry(0.53, 0.51, 1.15, 48);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0xb5822e,
      roughness: 0.25,
      metalness: 0.1,
    });
    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = -0.06;
    group.add(liquidMesh);

    // 3. Tapered Bottle Neck
    const neckGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.42, 32);
    const neckMesh = new THREE.Mesh(neckGeo, bottleMat);
    neckMesh.position.y = 0.85;
    group.add(neckMesh);

    // 4. Polished Gold Collar Ring
    const collarGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.18, 32);
    const collarMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // 18k polished gold
      metalness: 0.9,
      roughness: 0.18,
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.position.y = 1.05;
    group.add(collarMesh);

    // 5. Charcoal Matte Dropper Bulb
    const bulbGeo = new THREE.SphereGeometry(0.24, 32, 24);
    bulbGeo.scale(1, 1.45, 1);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0x1f221f,
      roughness: 0.6,
      metalness: 0.05,
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
    bulbMesh.position.y = 1.35;
    bulbMesh.castShadow = true;
    group.add(bulbMesh);

    // 6. Textured Linen Label with Canvas Texture
    const elixirTexture = createElixirLabelTexture();
    const elixirLabelGeo = new THREE.CylinderGeometry(0.585, 0.565, 0.88, 48, 1, true, 0, Math.PI * 1.55);
    const elixirLabelMat = new THREE.MeshStandardMaterial({
      map: elixirTexture,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const elixirLabel = new THREE.Mesh(elixirLabelGeo, elixirLabelMat);
    elixirLabel.position.y = -0.08;
    elixirLabel.rotation.y = Math.PI * 0.25;
    group.add(elixirLabel);

  } else if (type === "soap") {
    // ----------------------------------------------------
    // COLD-PROCESS ARTISANAL SOAP BAR MODEL
    // ----------------------------------------------------

    // 1. Handcrafted Soap Bar Block (French Green Clay & Olive Butter)
    const soapGeo = new THREE.BoxGeometry(1.65, 0.76, 1.15, 16, 8, 16);
    const soapTexture = createSoapSurfaceTexture();
    const soapMat = new THREE.MeshStandardMaterial({
      color: 0x566953, // French green clay mottled sage tone
      map: soapTexture,
      roughness: 0.78,
      metalness: 0.02,
    });
    const soapMesh = new THREE.Mesh(soapGeo, soapMat);
    soapMesh.castShadow = true;
    soapMesh.receiveShadow = true;
    soapMesh.position.y = -0.15;
    group.add(soapMesh);

    // 2. Kraft Paper Belly Band Wrap around Soap
    const bandTexture = createSoapBandTexture();
    const bandGeo = new THREE.BoxGeometry(1.67, 0.46, 1.17);
    const bandMat = new THREE.MeshStandardMaterial({
      map: bandTexture,
      roughness: 0.82,
      metalness: 0.04,
    });
    const bandMesh = new THREE.Mesh(bandGeo, bandMat);
    bandMesh.position.y = -0.15;
    bandMesh.castShadow = true;
    group.add(bandMesh);

    // 3. Natural Jute Twine Accent
    const twineGeo = new THREE.TorusGeometry(0.85, 0.025, 8, 48);
    const twineMat = new THREE.MeshStandardMaterial({
      color: 0xbfa480,
      roughness: 0.95,
    });
    const twineMesh = new THREE.Mesh(twineGeo, twineMat);
    twineMesh.rotation.x = Math.PI / 2;
    twineMesh.position.y = -0.15;
    group.add(twineMesh);

  } else {
    // ----------------------------------------------------
    // ARTISAN AMBER CANDLE MODEL (OPTION)
    // ----------------------------------------------------

    // 1. Amber Glass Vessel Outer Body
    const glassGeo = new THREE.CylinderGeometry(0.86, 0.82, 1.45, 48, 1, false);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x4a2a12, // Rich dark amber apothecary glass
      metalness: 0.12,
      roughness: 0.14,
      transmission: 0.76,
      thickness: 0.4,
      ior: 1.54,
      transparent: true,
      opacity: 0.94,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.castShadow = true;
    glassMesh.receiveShadow = true;
    group.add(glassMesh);

    // 2. Interior Coconut & Soy Wax Fill
    const waxGeo = new THREE.CylinderGeometry(0.81, 0.77, 1.25, 48);
    const waxMat = new THREE.MeshStandardMaterial({
      color: 0xfbf8f0, // Creamy soy ivory wax
      roughness: 0.88,
      metalness: 0.04,
    });
    const waxMesh = new THREE.Mesh(waxGeo, waxMat);
    waxMesh.position.y = -0.05;
    group.add(waxMesh);

    // 3. Melt Pool Liquid Ring (Simulates hot wax sheen)
    const meltGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.03, 48);
    const meltMat = new THREE.MeshStandardMaterial({
      color: 0xf6ebd1,
      roughness: 0.18,
      metalness: 0.08,
    });
    const meltMesh = new THREE.Mesh(meltGeo, meltMat);
    meltMesh.position.y = 0.58;
    group.add(meltMesh);

    // 4. Cotton Wick
    const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.22, 16);
    const wickMat = new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.9 });
    const wickMesh = new THREE.Mesh(wickGeo, wickMat);
    wickMesh.position.y = 0.68;
    group.add(wickMesh);

    // 5. Stylized Candle Flame (Glowing tear cone)
    const flameGeo = new THREE.ConeGeometry(0.065, 0.22, 16);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffe899,
      transparent: true,
      opacity: 0.96,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 0.86;
    group.add(flameMesh);

    // Flame Core Glow
    const flameCoreGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xff7300 });
    const flameCore = new THREE.Mesh(flameCoreGeo, flameCoreMat);
    flameCore.position.y = 0.78;
    group.add(flameCore);

    // 6. Paper Botanical Label Wrap with Canvas Texture
    const labelTexture = createCandleLabelTexture();
    const labelGeo = new THREE.CylinderGeometry(0.865, 0.825, 0.84, 48, 1, true, 0, Math.PI * 1.6);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.8,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -0.05;
    labelMesh.rotation.y = Math.PI * 0.2;
    group.add(labelMesh);

    // 7. Brushed Solid Brass Lid Resting Beside Vessel
    const lidGeo = new THREE.CylinderGeometry(0.89, 0.89, 0.12, 48);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xc8ad8d,
      metalness: 0.85,
      roughness: 0.24,
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.set(0.98, -0.66, 0.45);
    lidMesh.rotation.z = Math.PI * 0.12;
    lidMesh.castShadow = true;
    group.add(lidMesh);
  }
}

/**
 * Procedural Texture for Scalp Elixir Label
 */
function createElixirLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#F8F5EC";
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = "#82947B";
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 952, 440);
    ctx.lineWidth = 1;
    ctx.strokeRect(46, 46, 932, 420);

    ctx.fillStyle = "#476653";
    ctx.textAlign = "center";
    ctx.font = "italic 26px Georgia, serif";
    ctx.fillText("Cold-Pressed Ayurvedic Nectar", 512, 105);

    ctx.fillStyle = "#0E231C";
    ctx.font = "bold 52px Georgia, serif";
    ctx.fillText("EARTH & ESSENCE", 512, 185);

    ctx.fillStyle = "#536345";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("ROSEMARY & BHRINGRAJ", 512, 255);

    ctx.fillStyle = "#4A514B";
    ctx.font = "20px sans-serif";
    ctx.fillText("HAIR DENSITY & ROOT NOURISHMENT • 100 ML", 512, 325);

    ctx.font = "italic 19px Georgia, serif";
    ctx.fillText("Pure Plant Extract • 100% Organic • Zero Silicones", 512, 395);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Texture for Soap Bar Marbling
 */
function createSoapSurfaceTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#566953";
    ctx.fillRect(0, 0, 512, 512);

    // Marble swirls
    ctx.fillStyle = "#6B7E67";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 80 + 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Specks of dried calendula/herb flakes
    ctx.fillStyle = "#C49A45";
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Texture for Kraft Soap Belly Band
 */
function createSoapBandTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Unbleached Kraft paper background
    ctx.fillStyle = "#E4D5BA";
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = "#536345";
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 964, 452);

    ctx.fillStyle = "#0E231C";
    ctx.textAlign = "center";
    ctx.font = "bold 44px Georgia, serif";
    ctx.fillText("EARTH & ESSENCE", 512, 160);

    ctx.fillStyle = "#536345";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("FRENCH GREEN CLAY & TEA TREE", 512, 235);

    ctx.fillStyle = "#4A514B";
    ctx.font = "20px sans-serif";
    ctx.fillText("COLD-PROCESS SAPONIFIED BAR • 140G / 5 OZ", 512, 310);

    ctx.font = "italic 19px Georgia, serif";
    ctx.fillText("Cured for 6 Weeks • Extra Virgin Olive Oil & Shea Butter", 512, 385);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedural Texture for Candle Label (Option)
 */
function createCandleLabelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#FAF6EE";
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = "#C4B59D";
    ctx.lineWidth = 4;
    ctx.strokeRect(32, 32, 960, 448);
    ctx.lineWidth = 1;
    ctx.strokeRect(42, 42, 940, 428);

    ctx.fillStyle = "#476653";
    ctx.textAlign = "center";
    ctx.font = "italic 26px Georgia, serif";
    ctx.fillText("Artisanal Botanical Candle (Option)", 512, 105);

    ctx.fillStyle = "#0E231C";
    ctx.font = "bold 52px Georgia, serif";
    ctx.fillText("EARTH & ESSENCE", 512, 185);

    ctx.fillStyle = "#82947B";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText("WILD JASMINE & CEDAR", 512, 255);

    ctx.fillStyle = "#4A514B";
    ctx.font = "20px sans-serif";
    ctx.fillText("100% PURE SOY & COCONUT WAX • 55 HR BURN", 512, 325);

    ctx.font = "italic 19px Georgia, serif";
    ctx.fillText("Hand-Poured in Kerala • Plastic-Free • Batch 04", 512, 395);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
