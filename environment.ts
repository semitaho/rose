import {
  AbstractMesh,
  Color3,
  Curve3,
  GlowLayer,
  ImportMeshAsync,
  Material,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import { DEEPER_BLUE, LIGHT_BLUE } from "./colors";
import {
  createGrassMaterial,
  createMaterial,
  createRoadMaterial,
  createSkyMaterial,
} from "./materials";
import { SkyMaterial } from "@babylonjs/materials";
import { createCat } from "./characters";
import { getChildMeshByNameUnique } from "./util.ts";
import { flapEyes, flapMouth } from "./animations";
import { createNiceTexture, createTexture } from "./textures.ts";

function createSurface(scene: Scene) {
  const ground = MeshBuilder.CreateGround("ground", { width: 70, height: 70 });
  ground.material = createGrassMaterial(scene);
  ground.receiveShadows = true;
}

export function createSky(scene: Scene): Mesh {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 1000 }, scene);
  skybox.isPickable = false;
  skybox.infiniteDistance = true;
  const skyMaterial = createSkyMaterial(scene);
  // Material
  skybox.material = skyMaterial;
  createSunMesh(skyMaterial, scene);
  return skybox;
}

function createSunMesh(skyMaterial: SkyMaterial, scene: Scene) {
  const sunMesh = MeshBuilder.CreateSphere("sun", { diameter: 10 }, scene);
  sunMesh.alwaysSelectAsActiveMesh = true;
  sunMesh.receiveShadows = false;
  const sunPosition = skyMaterial.sunPosition.clone();
  sunMesh.position = sunPosition.scale(30); // scale out to far away

  const sunMat = new StandardMaterial("sunMat", scene);
  sunMat.emissiveColor = new Color3(1, 0.95, 0.8); // bright yellow-white
  sunMat.disableLighting = true;
  sunMesh.material = sunMat;

  sunMesh.position.z *= 10;
  // 3. Optional: Glow layer
  const glowLayer = new GlowLayer("glow", scene);
  glowLayer.addIncludedOnlyMesh(sunMesh);
  glowLayer.intensity = 0.8;
}

async function createHountedHouse(scene: Scene): Promise<AbstractMesh> {
  const result = await ImportMeshAsync("/meshes/haunted_house.glb", scene);
  const house = result.meshes[0];
  house.scaling = new Vector3(20, 20, 20);
  house.checkCollisions = true;
  return house;
}

async function createTree(scene: Scene): Promise<AbstractMesh> {
  const result = await ImportMeshAsync("/meshes/tree.babylon", scene);
  const tree = result.meshes[0];
  tree.scaling = new Vector3(20, 15, 20);
  tree.checkCollisions = true;
  return tree;
}

function createRoad(scene: Scene): Mesh {
  const path = [
    new Vector3(0, 0, 0),
    new Vector3(10, 0, 5),
    new Vector3(20, 0, 0),
    new Vector3(30, 0, -10),
  ];

  const smoothPath = Curve3.CreateCatmullRomSpline(path, 20, false);

  const roadShape = [
    new Vector3(-1.5, 0, 0), // left edge
    new Vector3(1.5, 0, 0), // right edge
  ];

  const road = MeshBuilder.ExtrudeShape(
    "road",
    {
      shape: roadShape,
      path: smoothPath.getPoints(),
      sideOrientation: Mesh.DOUBLESIDE,
    },
    scene
  );

  road.position.y = 0.01;
  const roadTexture = createTexture("/textures/road.jpg");
  roadTexture.uScale = 1;
  roadTexture.vScale = 3;

  road.material = createRoadMaterial(scene, roadTexture);
  road.receiveShadows = true;
  return road;
}

export async function createEnvironmentObjects(scene: Scene) {
  createSurface(scene);
  await createRoad(scene);
  const house = await createHountedHouse(scene);
  house.position = new Vector3(-5, 0, -5);
  const house2 = await createHountedHouse(scene);

  house2.position = new Vector3(10, 0, 10);

  // trees
  const tree1 = await createTree(scene);
  const tree2 = await createTree(scene);
  tree2.position = new Vector3(10,0,0);
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
