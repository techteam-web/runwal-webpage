// ScreenEffect.jsx
import { useFrame } from "@react-three/fiber";
import React, { useRef, forwardRef, useImperativeHandle, memo } from "react";
import { EffectComposer } from "@react-three/postprocessing";
import NoiseFade from "./NoiseFade";
import gsap from "gsap";

const ScreenEffect = forwardRef((props, ref) => {
  const effectRef = useRef(null);

  useFrame((state, delta) => {
    if (effectRef.current) effectRef.current.update(state.gl, null, delta);
  });

  useImperativeHandle(ref, () => ({
    playTransition: ({
      fadeInDur = 1.2,
      holdDur = 0.2,
      fadeOutDur = 1.2,
      onMidway,
    }) => {
      if (!effectRef.current) return;
      const uniforms = effectRef.current.uniforms;
      const tl = gsap.timeline();

      // Fade in to fully cover
      tl.to(uniforms.get("progress"), {
        value: 1,
        duration: fadeInDur,
        ease: "power4.in",
        onStart: () => {
          onMidway && onMidway();
          console.log(uniforms.get("progress"));
        },
        onComplete: () => {
          console.log(uniforms.get("progress"));
        },
      });
      // tl.to({}, { duration: holdDur });
      tl.to(uniforms.get("progress"), {
        value: 0,
        duration: fadeOutDur,
        ease: "power3.out",
        onComplete: () => {
          console.log(uniforms.get("progress"));
        },
      });

      return tl;
    },
    get uniforms() {
      return effectRef.current?.uniforms ?? null;
    },
  }));

  return (
    <EffectComposer>
      <primitive ref={effectRef} object={new NoiseFade()} />
    </EffectComposer>
  );
});

export default memo(ScreenEffect);
