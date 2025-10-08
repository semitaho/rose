import {
  AbstractMesh,
  ImportMeshAsync,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { DEEPER_BLUE, LIGHT_BLUE } from "./colors";
import { createGrassMaterial } from "./materials";
import { SkyMaterial } from "@babylonjs/materials";
import { createCat } from "./characters";
import { getChildMeshByNameUnique } from "./util.ts";
import { flapEyes, flapMouth } from "./animations";

export function createSurface(scene: Scene) {
  const ground = MeshBuilder.CreateGround("ground", { width: 40, height: 40 });

  ground.material = createGrassMaterial(scene);
  ground.receiveShadows = true;

  const skybox = MeshBuilder.CreateSphere(
    "skyBox",
    { segments: 32, diameter: 1000 },
    scene
  );
  skybox.isPickable = false;
  skybox.infiniteDistance = true;
  // Material
  const skyMaterial = new SkyMaterial("skyMaterial", scene);

  skyMaterial.backFaceCulling = false;
  // Gradient colors
  skybox.material = skyMaterial;
}

async function createHountedHouse(scene: Scene): Promise<AbstractMesh> {
  const result = await ImportMeshAsync("/meshes/haunted_house.glb", scene);
  const house = result.meshes[1];
  return house;
}

export async function createEnvironmentObjects(scene: Scene) {
  const house = await createHountedHouse(scene);
  house.position = new Vector3(-5, 0, -5);
  house.scaling = new Vector3(20, 20, 20);
  house.checkCollisions = true;

  // cat
  const cat = createCat(scene);
  cat.position.y = 0.6;
  cat.position.z = -1.0;
  cat.position.x = -4.0;

  const catMouth = getChildMeshByNameUnique(cat, "catMouth");
  const flatMouthAnim = flapMouth();
  catMouth.animations = [flatMouthAnim];

  scene.beginAnimation(catMouth, 0, 60, true, 0.8);
  console.log("catMouth", catMouth);
  const eye1 = cat.getChildMeshes(false, (m) => m.name === "catEye")[0];
  eye1.animations = [flapEyes()];
  scene.beginAnimation(eye1, 0, 60, true, 0.7);
  const eye2 = cat.getChildMeshes(false, (m) => m.name === "catEye")[1];
  eye2.animations = [flapEyes()];
  scene.beginAnimation(eye2, 0, 60, true, 0.7);
}
