import { Effect } from "postprocessing";
import * as THREE from "three";

const fragmentShader = /* glsl */ `
uniform sampler2D tDiffuse;
uniform sampler2D inkTexture;
uniform float time;
uniform float progress;
uniform vec3 dissolveColor; // <-- your custom dissolve color



void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // If progress is 0 → no effect
    if (progress <= 0.0) {
        outputColor = inputColor;
        return;
    }

//     if (progress >= 0.999) {
//     outputColor = vec4(dissolveColor, 1.0);
//     return;
// }
        vec2 vUv = uv;
        vec4 sceneColor = texture2D(tDiffuse, vUv);
      // Sample ink texture (make sure it tiles/fits your needs)
      float inkMask = texture2D(inkTexture, vUv).r;

    // Shifted progress so effect starts earlier
    float offset = 0.3; // try 0.05 to 0.2
    float shiftedProgress = clamp(progress + offset, 0.0, 1.0);

    float minEdge = 0.0;
    float maxEdge = 0.03;
    float edge = mix(minEdge, maxEdge, shiftedProgress);

    float x = (inkMask - shiftedProgress) / edge;
    float mask = edge > 0.0 
        ? clamp(0.5 + 0.5 * tanh(x), 0.0, 1.0) 
        : step(shiftedProgress, inkMask);

      // Blend scene with ink (black ink here, can also tint)
      vec3 finalColor = mix(dissolveColor,inputColor.rgb, mask);

      outputColor = vec4(finalColor, 1.0);
}

`;

const textureLoader = new THREE.TextureLoader();
// const inkTexture = textureLoader.load('/ink3.png');
const inkTexture = textureLoader.load('/texture.png');


export default class NoiseFade extends Effect {
    constructor() {
        super("NoiseFade", fragmentShader, {
            uniforms: new Map([
                ["time", new THREE.Uniform(0)],
                ["progress", new THREE.Uniform(0)],
                ["dissolveColor", new THREE.Uniform(new THREE.Color("#adaaaa"))],  //#adaaaa
                ['inkTexture', new THREE.Uniform(inkTexture)],
                ['tDiffuse', new THREE.Uniform(null)] // This will be set automatically
            ])
        });
    }

    update(renderer, inputBuffer, deltaTime) {
        this.uniforms.get("time").value += deltaTime;
    }

    // setProgress(value) {
    //     this.uniforms.get("progress").value = value;
    // }
}