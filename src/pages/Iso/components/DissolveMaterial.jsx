import * as THREE from "three";
import { useMemo, useEffect, useRef } from "react";
import CustomShaderMaterial from "three-custom-shader-material";
import gsap from "gsap";
import { useFrame } from "@react-three/fiber";

export function DissolveMaterial({ map, mask, active }) {
  const matRef = useRef();

  map.colorSpace = THREE.SRGBColorSpace;

  const MemoizedDissolveMaterial = useMemo(
    () => (
      <CustomShaderMaterial
        ref={matRef}
        baseMaterial={THREE.MeshBasicMaterial}
        uniforms={{
          baseTexture: { value: map },
          mask: { value: mask },
          progress: { value: 0 },
          dissolveColor: { value: new THREE.Color("#B9B0A3") },
        }}
        vertexShader={`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`}
        fragmentShader={`
        
          uniform sampler2D baseTexture;  // iChannel0
uniform sampler2D mask;         // iChannel1
uniform vec2 resolution;        // iResolution
uniform float time;             // iTime
uniform float progress;         // custom dissolve control
uniform vec3 dissolveColor; // 🔥 your custom dissolve color
varying vec2 vUv;

float sinNoise(vec2 uv) {
    return fract(abs(sin(uv.x * 180.0 + uv.y * 3077.0) * 53703.27));
}

float valueNoise(vec2 uv, float scale) {
    vec2 luv = fract(uv * scale);
    vec2 luvs = smoothstep(0.0, 1.0, fract(uv * scale));
    vec2 id = floor(uv * scale);

    float tl = sinNoise(id + vec2(0.0, 1.0));
    float tr = sinNoise(id + vec2(1.0, 1.0));
    float t = mix(tl, tr, luvs.x);

    float bl = sinNoise(id + vec2(0.0, 0.0));
    float br = sinNoise(id + vec2(1.0, 0.0));
    float b = mix(bl, br, luvs.x);

    return mix(b, t, luvs.y) * 2.0 - 1.0;
}

void main() {
    // Normalized pixel coordinates
    vec2 uv = vUv;

    float scale = 4.0;
    float fractValue = 0.0;
    float amp = 1.0;

    for(int i = 0; i < 8; i++) { // reduced iterations for perf
        fractValue += valueNoise(uv, float(i + 1) * scale) * amp;
        amp *= 0.5;
    }

    fractValue = fractValue * 0.5 + 0.5;

    // animated threshold
    float cutoff = smoothstep(progress - 0.1, progress + 0.1, fractValue);
    cutoff = clamp(cutoff, 0.0, 1.0);
      // if(progress==0.0) cutoff=1.0;
    vec4 tex0 = texture2D(baseTexture, uv);

    // 🔥 Blend with dissolveColor instead of another texture
    vec3 blended = mix(tex0.rgb, dissolveColor, 1.0 - cutoff);

    // vec4 col = mix(tex0, tex1, cutoff);

    csm_DiffuseColor = vec4(blended, 1.0);
}
`}
        transparent
      />
    ),
    []
  );

  // Animate dissolve when "active" changes
  // console.log(active);
  useEffect(() => {
    if (!matRef.current) return;
    gsap.to(matRef.current.uniforms.progress,
      {
      value: active ? 0 : 1,
      duration: active? 2 : 1.5,
      delay: active ? 1 : 0,
      ease: active? "power2.inOut": 'power3.out',
    });
  }, [active]);
  // console.log(matRef.current.opacity)
  useFrame(() => {
    // console.log(matRef.current.uniforms.progress)
  });

  return MemoizedDissolveMaterial;
}
