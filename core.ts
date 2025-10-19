import {
  ArcRotateCamera,
  Camera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  IShadowLight,
  Light,
  Mesh,
  Scene,
  ShadowGenerator,
  Vector3,
} from "@babylonjs/core";

export function createEngine(): Engine {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  return engine;
}

export function createScene(engine: Engine): Scene {
  const scene = new Scene(engine, {});
  //scene.clearColor = new Color4(0.6, 0.8, 1.0, 1.0); // soft blue sky

  return scene;
}

export function createDefaultLight(scene: Scene): Light {
  const light = new DirectionalLight("light", new Vector3(-1, -1, -1), scene);
  light.intensity = 0.9;
  light.position = new Vector3(20, 70, 20);
  light.shadowEnabled = true;
  return light;
}

export function createShadowGenerator(light: IShadowLight): ShadowGenerator {
  const shadowGenerator = new ShadowGenerator(2048, light);
  shadowGenerator.useExponentialShadowMap = true;
  shadowGenerator.useContactHardeningShadow = true;
  shadowGenerator.usePoissonSampling = true;
  return shadowGenerator;
}

export function createDefaultCamera(scene: Scene, target: Mesh): Camera {
  // Camera
  const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3,
    20,
    target.position,
    scene
  );
  camera.lockedTarget = target;
  camera.attachControl(true);
  camera.detachControl();
  return camera;
}
