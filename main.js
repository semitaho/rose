import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  KeyboardEventTypes,
  Scalar,
  FollowCamera,
  Quaternion,
  Mesh,
  ShadowGenerator,
  DirectionalLight,
  VertexData,
  BackgroundMaterial,
  Texture,
  ImportMeshAsync,
  PointLight,
} from "@babylonjs/core";

import { registerBuiltInLoaders } from "@babylonjs/loaders/dynamic";
registerBuiltInLoaders();

import { Inspector } from "@babylonjs/inspector";
import { createCat, createPlayer } from "./characters.ts";
import { createEnvironmentObjects, createSky } from "./environment.ts";
;
import {
  createDefaultCamera,
  createDefaultLight,
  createEngine,
  createScene,
  createShadowGenerator,
} from "./core.ts";
import { _updateFromKeyboard, checkJump, checkRotation, move, updatePlayerKeyboard } from "./player.ts";
import { createSunLight } from "./lightning.ts";
import { createEnvTexture } from "./textures.ts";

const engine = createEngine();
const scene = createScene(engine);
const envTexture = createEnvTexture(scene);
scene.environmentTexture = envTexture;
scene.environmentIntensity =0.4;
scene.imageProcessingConfiguration.exposure = 1.5
// Light
const sun = createSunLight(scene);
// Shadow generator with map size (e.g. 1024)
const shadowGenerator = createShadowGenerator(sun);
const quizmallows = createPlayer(scene);
//new GUIDialog().showMessageBox("Hi! I'm Cat!");
shadowGenerator.addShadowCaster(quizmallows, true);
createSky(scene);
createEnvironmentObjects(scene);
// Camera
createDefaultCamera(scene, quizmallows);

scene.onKeyboardObservable.add((kbInfo) => {
  updatePlayerKeyboard(quizmallows, kbInfo);
});

scene.onBeforeRenderObservable.add(() => {
  _updateFromKeyboard();
  const deltaTimeInSeconds = engine.getDeltaTime() / 1000;
  move(quizmallows, deltaTimeInSeconds);
  checkJump(quizmallows, deltaTimeInSeconds);
  checkRotation(quizmallows, deltaTimeInSeconds);
});



engine.runRenderLoop(() => {
  scene.render();
});
Inspector.Show(scene, {});

window.addEventListener("resize", () => {
  engine.resize();
});
