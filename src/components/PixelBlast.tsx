"use client";

import { CSSProperties, useEffect, useRef } from "react";
import styles from "./PixelBlast.module.css";

type ShapeVariant = "square" | "circle" | "triangle" | "diamond";

type PixelBlastProps = {
  variant?: ShapeVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleIntensityScale?: number;
  rippleThickness?: number;
  rippleSpeed?: number;
  edgeFade?: number;
  speed?: number;
};

type Ripple = {
  x: number;
  y: number;
  born: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const parseHexColor = (hex: string) => {
  const fallback = { r: 128, g: 0, b: 0 };
  if (!hex) {
    return fallback;
  }

  let normalized = hex.trim();
  if (normalized.startsWith("#")) {
    normalized = normalized.slice(1);
  }

  if (![3, 6].includes(normalized.length)) {
    return fallback;
  }

  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((segment) => segment + segment)
      .join("");
  }

  const parsed = Number.parseInt(normalized, 16);
  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
};

const drawShape = (
  ctx: CanvasRenderingContext2D,
  variant: ShapeVariant,
  centerX: number,
  centerY: number,
  size: number,
) => {
  const half = size / 2;

  switch (variant) {
    case "circle": {
      ctx.beginPath();
      ctx.arc(centerX, centerY, half, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    case "triangle": {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - half);
      ctx.lineTo(centerX + half, centerY + half);
      ctx.lineTo(centerX - half, centerY + half);
      ctx.closePath();
      ctx.fill();
      return;
    }
    case "diamond": {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - half);
      ctx.lineTo(centerX + half, centerY);
      ctx.lineTo(centerX, centerY + half);
      ctx.lineTo(centerX - half, centerY);
      ctx.closePath();
      ctx.fill();
      return;
    }
    default: {
      ctx.fillRect(centerX - half, centerY - half, size, size);
    }
  }
};

const MAX_RIPPLES = 12;

const PixelBlast = ({
  variant = "circle",
  pixelSize = 6,
  color = "#800000",
  className,
  style,
  patternScale = 3,
  patternDensity = 1.2,
  pixelSizeJitter = 0.5,
  enableRipples = true,
  rippleIntensityScale = 1.5,
  rippleThickness = 0.12,
  rippleSpeed = 0.4,
  edgeFade = 0.25,
  speed = 0.6,
}: PixelBlastProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const colorRGB = parseHexColor(color);
    const basePixel = Math.max(2, pixelSize);
    const baseScale = Math.max(patternScale, 0.1);
    const density = Math.max(patternDensity, 0.05);
    const rippleThicknessSafe = Math.max(rippleThickness, 0.01);
    const rippleSpeedSafe = Math.max(rippleSpeed, 0.05);
    const jitterAmount = Math.max(0, pixelSizeJitter);
    const edgeFadeSafe = Math.max(edgeFade, 0);

    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.max(1, Math.floor(width * devicePixelRatio));
      canvas.height = Math.max(1, Math.floor(height * devicePixelRatio));
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    updateSize();

    const noise = (x: number, y: number) => {
      return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    };

    const pruneRipples = (nowSeconds: number) => {
      if (!ripplesRef.current.length) {
        return;
      }

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const life = nowSeconds - ripple.born;
        return life < 6 / rippleSpeedSafe;
      });
    };

    const drawFrame = (time: number) => {
      const nowSeconds = time * 0.001;
      pruneRipples(nowSeconds);

      ctx.clearRect(0, 0, width, height);

      const horizontalSteps = Math.ceil(width / basePixel);
      const verticalSteps = Math.ceil(height / basePixel);
      const timeFactor = nowSeconds * speed;

      for (let gy = 0; gy <= verticalSteps; gy += 1) {
        const y = gy * basePixel;
        const normY = height > 0 ? y / height : 0;

        for (let gx = 0; gx <= horizontalSteps; gx += 1) {
          const x = gx * basePixel;
          const normX = width > 0 ? x / width : 0;

          const jitterSeed = noise(gx, gy);
          const jitter = (jitterSeed - Math.floor(jitterSeed)) - 0.5;
          const pixelSide = basePixel * (1 + jitterAmount * jitter);
          const centerX = x + basePixel / 2;
          const centerY = y + basePixel / 2;

          const waveA = Math.sin((normX * baseScale + timeFactor) * Math.PI * 2);
          const waveB = Math.cos((normY * baseScale - timeFactor) * Math.PI * 2);
          const swirl = Math.sin((normX + normY + timeFactor) * baseScale * 1.5);

          let intensity = 0.5 + 0.4 * waveA + 0.35 * waveB + 0.25 * swirl;
          intensity *= density;

          if (enableRipples && ripplesRef.current.length > 0) {
            for (const ripple of ripplesRef.current) {
              const dx = normX - ripple.x;
              const dy = normY - ripple.y;
              const dist = Math.hypot(dx, dy);
              const age = nowSeconds - ripple.born;
              const waveFront = age * rippleSpeedSafe;
              const gaussian = Math.exp(-Math.pow((dist - waveFront) / rippleThicknessSafe, 2));
              const decay = Math.exp(-age * 1.5);
              intensity += gaussian * decay * rippleIntensityScale;
            }
          }

          intensity = clamp(intensity, 0, 1.25);

          if (edgeFadeSafe > 0) {
            const edgeX = Math.min(normX, 1 - normX);
            const edgeY = Math.min(normY, 1 - normY);
            const fade = clamp(Math.min(edgeX, edgeY) / edgeFadeSafe, 0, 1);
            intensity *= fade;
          }

          if (intensity <= 0.03) {
            continue;
          }

          const alpha = clamp(intensity, 0, 1);
          ctx.fillStyle = `rgba(${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}, ${alpha})`;
          drawShape(ctx, variant, centerX, centerY, pixelSide);
        }
      }
    };

    const handlePointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return;
      }

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const born = performance.now() * 0.001;

      ripplesRef.current = [
        ...ripplesRef.current.slice(-MAX_RIPPLES + 1),
        { x: clamp(x, 0, 1), y: clamp(y, 0, 1), born },
      ];
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!enableRipples) {
        return;
      }

      if (event.buttons & 1) {
        handlePointer(event);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!enableRipples) {
        return;
      }

      handlePointer(event);
    };

    canvas.addEventListener("pointerdown", handlePointerDown, { passive: true });
    canvas.addEventListener("pointermove", handlePointerMove, { passive: true });

    const animate = (time: number) => {
      drawFrame(time);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    let resizeObserver: ResizeObserver | undefined;

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);
    } else {
      window.addEventListener("resize", updateSize);
    }

    return () => {
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }

      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", updateSize);
      }
    };
  }, [
    color,
    enableRipples,
    edgeFade,
    patternDensity,
    patternScale,
    pixelSize,
    pixelSizeJitter,
    rippleIntensityScale,
    rippleSpeed,
    rippleThickness,
    speed,
    variant,
  ]);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className ?? ""}`.trim()}
      style={style}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default PixelBlast;
