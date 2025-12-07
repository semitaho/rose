import { Animation, Mesh } from "@babylonjs/core";

const DEFAUT_FRAME_RATE = 30;
export function flapEyes() {
  const animation = new Animation(
    "flapEyes",
    "scaling.y",
    DEFAUT_FRAME_RATE,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  // Define keyframes
  const keys = [];
  keys.push({ frame: 0, value: 1 }); // start at normal scale
  keys.push({ frame: 25, value: 1 }); // start at normal scale
  keys.push({ frame: 30, value: 0 }); // scale up
  keys.push({ frame: 35, value: 1 }); // scale up
  keys.push({ frame: 40, value: 0 }); // scale up
  keys.push({ frame: 45, value: 1 }); // scale up

  keys.push({ frame: 60, value: 1 }); // scale back down
  animation.setKeys(keys);
  return animation;
}

export function flapMouth() {
  const animation = new Animation(
    "flapMouth",
    "scaling.y",
    DEFAUT_FRAME_RATE,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  // Define keyframes
  const keys = [];
  keys.push({ frame: 0, value: 0 }); // start at normal scale
  keys.push({ frame: 10, value: 1 }); // start at normal scale
  keys.push({ frame: 20, value: 0 }); // scale up
  keys.push({ frame: 30, value: 1 }); // scale up
  keys.push({ frame: 40, value: 0 }); // scale up
  keys.push({ frame: 50, value: 1 }); // scale up
  keys.push({ frame: 60, value: 0 }); // scale back down
  animation.setKeys(keys);
  return animation;
}

export function flapWings(wing1: Mesh, wing2: Mesh): void {
  const t = performance.now() * 0.008;
  const flap = Math.sin(t) * 0.5;
  wing1.rotation.x = flap;
  wing2.rotation.x = flap;
}

export function blink(): Animation {
  const animation = new Animation(
    "blinkAnimation",
    "material.alpha",
    DEFAUT_FRAME_RATE * 2,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_CYCLE
  );
  const keys = [
    { frame: 0, value: 1 },
    { frame: 10, value: 0 }, // invisible
    { frame: 20, value: 1 }, // visible again
    { frame: 30, value: 0 }, // visible again
    { frame: 40, value: 1 }, // visible again
    { frame: 50, value: 0 }, // visible again
    { frame: 60, value: 1 }, // visible again
  ];
  animation.setKeys(keys);
  return animation;
}
