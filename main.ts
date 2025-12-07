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
} from "./core.js";
import {
  _updateFromKeyboard,
  checkJump,
  checkRotation,
  move,
  updatePlayerKeyboard,
} from "./player.js";
import { createSunLight } from "./lightning.js";
import { createEnvTexture } from "./textures.js";
import { type Environment } from "./types.js";
import PlayerMesh from "./player.mesh.js";
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
player.animations = [blink()];
shadowGenerator.addShadowCaster(player, true);

// Camera
createDefaultCamera(scene, player);

scene.onKeyboardObservable.add((kbInfo) => {
  updatePlayerKeyboard(player, kbInfo);
});

scene.onBeforeRenderObservable.add(() => {
  _updateFromKeyboard();
  const deltaTimeInSeconds = engine.getDeltaTime() / 1000;
  move(player, deltaTimeInSeconds);
  checkJump(player, deltaTimeInSeconds);
  checkRotation(player, deltaTimeInSeconds);
  moveAndAnimateRock(environment, deltaTimeInSeconds);
  checkCollisions(scene, player, environment);
});

function moveAndAnimateRock(
  environment: Environment,
  deltaTimeInSeconds: number
) {
  const speed = 10;
  const radius = 0.4;
  environment.stones.forEach((stone) => {
    stone.moveWithCollisions(
      Vector3.Forward().scale(deltaTimeInSeconds * speed),
      false
    );
    stone.rotation.x -= speed / radius;
  });
}

function checkCollisions(scene: Scene, player: PlayerMesh, environment: Environment) {
  const animatables = scene.getAllAnimatablesByTarget(player);
  environment.stones.forEach((stone) => {
    if (animatables.length === 0 && player.intersectsMesh(stone, false)) {
      console.log("Collision with stone!", animatables.length);
      scene.beginAnimation(player, 0, 60, false, 1.0);
    
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
