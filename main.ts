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

import { Inspector } from "@babylonjs/inspector";
import { createCat, createPlayer } from "./characters.js";
import { createEnvironmentObjects, createSky } from "./environment.js";
import {
  createDefaultCamera,
  createDefaultLight,
  createEngine,
  createScene,
  createShadowGenerator,
  toggleVisibility,
} from "./core.js";

import { createSunLight } from "./lightning.js";
import { createEnvTexture } from "./textures.js";
import { type Environment } from "./types.js";
import PlayerMesh from "./objects/player.object.js";
import { blink } from "./animations.js";

const engine = createEngine();
const scene = createScene(engine);
const envTexture = createEnvTexture(scene);
scene.environmentTexture = envTexture;
scene.environmentIntensity = 0.4;
scene.imageProcessingConfiguration.exposure = 1.5;
// Light
const sun = createSunLight(scene);
// Shadow generator with map size (e.g. 1024)
const shadowGenerator = createShadowGenerator(sun);
createSky(scene);
const environment = await createEnvironmentObjects(scene);
const player = createPlayer(scene, environment.ground);
shadowGenerator.addShadowCaster(player.mesh, true);

// Camera
createDefaultCamera(scene, player.mesh);

scene.onKeyboardObservable.add((kbInfo) => {
  player.updatePlayerKeyboard(kbInfo);
});

scene.onBeforeRenderObservable.add(() => {
  player.updateFromKeyboard();
  const deltaTimeInSeconds = engine.getDeltaTime() / 1000;
  player.move(deltaTimeInSeconds);
  player.checkJump(deltaTimeInSeconds);
  player.checkRotation(deltaTimeInSeconds);
  moveAndAnimateRock(environment, deltaTimeInSeconds);
  checkCollisions(scene, player, environment);
  checkEnvironmentVisibility(environment, player);
});

function moveAndAnimateRock(
  environment: Environment,
  deltaTimeInSeconds: number
) {
  environment.stones.forEach((stone) => {
    stone.move(deltaTimeInSeconds);
  });
}

function checkCollisions(
  scene: Scene,
  player: PlayerMesh,
  environment: Environment
) {
  const animatables = scene.getAllAnimatablesByTarget(player);
  environment.stones.forEach((stone) => {
    if (
      animatables.length === 0 &&
      player.mesh.intersectsMesh(stone.mesh, false)
    ) {
      console.log("Collision with stone!", animatables.length);
      scene.beginAnimation(player.mesh, 0, 60, false, 1.0);

      // Handle collision (e.g., reduce health, play sound, etc.)
    }
  });
}

engine.runRenderLoop(() => {
  scene.render();
});
Inspector.Show(scene, {});

window.addEventListener("resize", () => {
  engine.resize();
});
function checkEnvironmentVisibility(
  environment: Environment,
  player: PlayerMesh
) {
  const distanceToHide = 80;
  const meshesToCheck = [...environment.houses, ...environment.trees];

  meshesToCheck.forEach((house) => {
    const distance = Vector3.Distance(player.mesh.position, house.position);
    toggleVisibility(house, distance < distanceToHide);
  });
}
