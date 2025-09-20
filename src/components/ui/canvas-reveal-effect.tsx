// components/ui/canvas-reveal-effect.tsx
"use client";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
// Rationale: Import React hooks directly since we removed the React import
import { useMemo, useRef } from "react";
import * as THREE from "three";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  // cyan/blue palette by default
  colors = [
    [56, 189, 248], // cyan-400
    [59, 130, 246], // blue-500
    [99, 102, 241], // indigo-500
  ],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn("h-full relative bg-background w-full", containerClassName)}
    >
      <div className="h-full w-full">
        <DotMatrix
          colors={colors}
          dotSize={dotSize ?? 3}
          opacities={opacities}
          shader={`
            float animation_speed_factor = ${animationSpeed.toFixed(1)};
            float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
            opacity *= step(intro_offset, u_time * animation_speed_factor);
            opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        // soft primary wash that adapts to light/dark tokens
        <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent pointer-events-none" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.08, 0.08, 0.1, 0.12, 0.14, 0.16, 0.2, 0.25, 0.3, 0.35],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length >= 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }

    return {
      u_colors: {
        value: colorsArray.map((c) => [c[0] / 255, c[1] / 255, c[2] / 255]),
        type: "uniform3fv",
      },
      u_opacities: { value: opacities, type: "uniform1fv" },
      u_total_size: { value: totalSize, type: "uniform1f" },
      u_dot_size: { value: dotSize, type: "uniform1f" },
    };
  }, [colors, opacities, totalSize, dotSize]);

  return (
    <Shader
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
          return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }

        void main() {
          vec2 st = fragCoord.xy;
          st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));
          st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));

          float opacity = step(0.0, st.x);
          opacity *= step(0.0, st.y);

          vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

          float frequency = 5.0;
          float show_offset = random(st2);
          float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
          opacity *= u_opacities[int(rand * 10.0)];
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
          opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

          vec3 color = u_colors[int(show_offset * 6.0)];
          ${shader}
          fragColor = vec4(color, opacity);
          fragColor.rgb *= fragColor.a;
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};

type Uniforms = {
  [key: string]: { value: number[] | number[][] | number; type: string };
};

const ShaderMaterial = ({
  source,
  uniforms,
  maxFps = 60,
}: {
  source: string;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size, gl } = useThree();
  const ref = useRef<THREE.Mesh | null>(null);

  let lastFrameTime = 0;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    if (t - lastFrameTime < 1 / maxFps) return;
    lastFrameTime = t;
    (ref.current.material as any).uniforms.u_time.value = t;
  });

  const getUniforms = () => {
    // Rationale: Improve type safety by replacing 'any' with proper types
    const prepared: Record<string, { value: unknown; type: string }> = {};
    for (const name in uniforms) {
      const u = uniforms[name] as { value?: unknown; type?: string };
      if (u.type === "uniform1f")
        prepared[name] = { value: u.value, type: "1f" };
      if (u.type === "uniform3f")
        prepared[name] = {
          value: new THREE.Vector3().fromArray(u.value as number[]),
          type: "3f",
        };
      if (u.type === "uniform1fv")
        prepared[name] = { value: u.value, type: "1fv" };
      if (u.type === "uniform3fv")
        prepared[name] = {
          value: (u.value as unknown as number[][]).map((v) =>
            new THREE.Vector3().fromArray(v)
          ),
          type: "3fv",
        };
      if (u.type === "uniform2f")
        prepared[name] = {
          value: new THREE.Vector2().fromArray(u.value as number[]),
          type: "2f",
        };
    }

    const dpr = gl.getPixelRatio
      ? gl.getPixelRatio()
      : typeof window !== "undefined"
      ? window.devicePixelRatio
      : 1;
    prepared["u_time"] = { value: 0, type: "1f" };
    prepared["u_resolution"] = {
      value: new THREE.Vector2(size.width * dpr, size.height * dpr),
      type: "2f",
    };
    return prepared;
  };

  const material = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader: `
        precision mediump float;
        in vec2 coordinates;
        uniform vec2 u_resolution;
        out vec2 fragCoord;
        void main(){
          gl_Position = vec4(position.xy, 0.0, 1.0);
          fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
          fragCoord.y = u_resolution.y - fragCoord.y;
        }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      transparent: true,
    });
    return m;
  }, [size.width, size.height, source, gl]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0 h-full w-full" dpr={[1, 2]}>
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

interface ShaderProps {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}
