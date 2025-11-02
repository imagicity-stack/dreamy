"use client";

import { CSSProperties, useEffect, useRef } from "react";
import styles from "./PixelBlast.module.css";

type ShapeVariant = keyof typeof SHAPE_MAP;

type PixelBlastProps = {
  variant?: ShapeVariant;
  pixelSize?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
  antialias?: boolean;
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

const SHAPE_MAP = {
  square: 0,
  circle: 1,
  triangle: 2,
  diamond: 3,
} as const;

const MAX_CLICKS = 10;

const VERTEX_SRC = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
` as const;

const FRAGMENT_SRC = `#version 300 es
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int   uShapeType;

const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.08);
  float feed = mix(0.25, 0.85, base);
  feed = clamp(feed * uDensity, 0.0, 1.0);

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float signal = feed + bayer;
  float bw = smoothstep(0.3, 0.7, signal);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = clamp(bw * jitterScale, 0.0, 1.0);
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  fragColor = vec4(color, M);
}
` as const;

const POSITIONS = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  -1, 1,
  1, -1,
  1, 1,
]);

const hexToRgb = (value: string): [number, number, number] => {
  let hex = value.trim();
  if (hex.startsWith("#")) {
    hex = hex.slice(1);
  }

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  const intValue = Number.parseInt(hex, 16);
  const r = (intValue >> 16) & 0xff;
  const g = (intValue >> 8) & 0xff;
  const b = intValue & 0xff;

  return [r / 255, g / 255, b / 255];
};

const createShader = (gl: WebGL2RenderingContext, type: GLenum, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Unable to create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "Unknown error";
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${info}`);
  }

  return shader;
};

const createProgram = (
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
) => {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();

  if (!program) {
    throw new Error("Unable to create shader program");
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? "Unknown error";
    gl.deleteProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    throw new Error(`Program link error: ${info}`);
  }

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return program;
};

const PixelBlast = ({
  variant = "square",
  pixelSize = 3,
  color = "#800000",
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  pixelSizeJitter = 0.5,
  enableRipples = true,
  rippleIntensityScale = 1.5,
  rippleThickness = 0.12,
  rippleSpeed = 0.4,
  edgeFade = 0.25,
  speed = 0.6,
}: PixelBlastProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const visibilityRef = useRef({ visible: true });
  const speedRef = useRef(speed);

  useEffect(() => {
    const handleVisibility = () => {
      if (typeof document === "undefined") {
        return;
      }

      visibilityRef.current.visible = document.visibilityState !== "hidden";
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibility);
      handleVisibility();
    }

    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibility);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    speedRef.current = speed;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    const gl = canvas.getContext("webgl2", {
      antialias,
      alpha: true,
    });

    if (!gl) {
      container.removeChild(canvas);
      return undefined;
    }

    gl.getExtension("OES_standard_derivatives");

    const program = createProgram(gl, VERTEX_SRC, FRAGMENT_SRC);
    gl.useProgram(program);
    gl.clearColor(0, 0, 0, 0);

    const vao = gl.createVertexArray();
    const buffer = gl.createBuffer();

    if (!vao || !buffer) {
      throw new Error("Failed to create WebGL buffers");
    }

    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, POSITIONS, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniformLocations = {
      uResolution: gl.getUniformLocation(program, "uResolution"),
      uTime: gl.getUniformLocation(program, "uTime"),
      uColor: gl.getUniformLocation(program, "uColor"),
      uPixelSize: gl.getUniformLocation(program, "uPixelSize"),
      uScale: gl.getUniformLocation(program, "uScale"),
      uDensity: gl.getUniformLocation(program, "uDensity"),
      uPixelJitter: gl.getUniformLocation(program, "uPixelJitter"),
      uEnableRipples: gl.getUniformLocation(program, "uEnableRipples"),
      uRippleSpeed: gl.getUniformLocation(program, "uRippleSpeed"),
      uRippleThickness: gl.getUniformLocation(program, "uRippleThickness"),
      uRippleIntensity: gl.getUniformLocation(program, "uRippleIntensity"),
      uEdgeFade: gl.getUniformLocation(program, "uEdgeFade"),
      uShapeType: gl.getUniformLocation(program, "uShapeType"),
      uClickPos: Array.from({ length: MAX_CLICKS }, (_, index) =>
        gl.getUniformLocation(program, `uClickPos[${index}]`),
      ),
      uClickTimes: Array.from({ length: MAX_CLICKS }, (_, index) =>
        gl.getUniformLocation(program, `uClickTimes[${index}]`),
      ),
    };

    const clickPositions = new Float32Array(MAX_CLICKS * 2).fill(-1);
    const clickTimes = new Float32Array(MAX_CLICKS);
    let clickIndex = 0;

    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uniformLocations.uColor!, r, g, b);
    gl.uniform1f(uniformLocations.uScale!, patternScale);
    gl.uniform1f(uniformLocations.uDensity!, patternDensity);
    gl.uniform1f(uniformLocations.uPixelJitter!, pixelSizeJitter);
    gl.uniform1i(uniformLocations.uEnableRipples!, enableRipples ? 1 : 0);
    gl.uniform1f(uniformLocations.uRippleSpeed!, rippleSpeed);
    gl.uniform1f(uniformLocations.uRippleThickness!, rippleThickness);
    gl.uniform1f(uniformLocations.uRippleIntensity!, rippleIntensityScale);
    gl.uniform1f(uniformLocations.uEdgeFade!, edgeFade);
    gl.uniform1i(uniformLocations.uShapeType!, SHAPE_MAP[variant] ?? 0);

    const resize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.uniform2f(uniformLocations.uResolution!, canvas.width, canvas.height);
      gl.uniform1f(uniformLocations.uPixelSize!, pixelSize * ratio);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const start = performance.now();
    const randomOffset = Math.random() * 1000;
    let raf = 0;

    const draw = () => {
      if (!visibilityRef.current.visible) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (performance.now() - start) / 1000;
      const timeValue = randomOffset + elapsed * speedRef.current;

      gl.uniform1f(uniformLocations.uTime!, timeValue);

      for (let i = 0; i < MAX_CLICKS; i += 1) {
        const posLocation = uniformLocations.uClickPos[i];
        const timeLocation = uniformLocations.uClickTimes[i];

        if (posLocation) {
          gl.uniform2f(
            posLocation,
            clickPositions[i * 2],
            clickPositions[i * 2 + 1],
          );
        }

        if (timeLocation) {
          gl.uniform1f(timeLocation, clickTimes[i]);
        }
      }

      gl.bindVertexArray(vao);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const pointerHandler = (event: PointerEvent) => {
      if (!enableRipples) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const fx = (event.clientX - rect.left) * scaleX;
      const fy = (rect.height - (event.clientY - rect.top)) * scaleY;

      clickPositions[clickIndex * 2] = fx;
      clickPositions[clickIndex * 2 + 1] = fy;
      clickTimes[clickIndex] = randomOffset + ((performance.now() - start) / 1000) * speedRef.current;
      clickIndex = (clickIndex + 1) % MAX_CLICKS;
    };

    canvas.addEventListener("pointerdown", pointerHandler, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", pointerHandler);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }
    };
  }, [
    antialias,
    color,
    edgeFade,
    enableRipples,
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
      aria-label="PixelBlast interactive background"
    />
  );
};

export default PixelBlast;
