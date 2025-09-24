// shaders/slideNoiseCrossfade.js
export const fragmentShader = `
  uniform sampler2D uTextureA;
  uniform sampler2D uTextureB;
  uniform float uMix;
  varying vec2 vUv;

  // simple hash noise
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // Slide UVs
    vec2 uvA = vUv + vec2(-uMix, 0.0);          // current floor slides left
    vec2 uvB = vUv + vec2(1.0 - uMix, 0.0);     // next floor slides in from right

    vec4 texA = texture2D(uTextureA, uvA);
    vec4 texB = texture2D(uTextureB, uvB);

    // Noise dissolve mask
    float n = random(vUv * 50.0);  // adjust multiplier for noise density
    float mask = smoothstep(uMix - 0.1, uMix + 0.1, n);

    gl_FragColor = mix(texA, texB, mask);
  }
`;