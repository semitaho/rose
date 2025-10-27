import {
  AbstractMesh,
  Color3,
  Curve3,
  GlowLayer,
  GroundMesh,
  ImportMeshAsync,
  Material,
  Mesh,
  MeshBuilder,
  Node,
  RandomRange,
  Scene,
  StandardMaterial,
  SubMesh,
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
import { getChildMeshByNameUnique, randomIntFromInterval } from "./util.ts";
import { flapEyes, flapMouth } from "./animations";
import { createNiceTexture, createTexture } from "./textures.ts";
import {
  createCollisionBox,
  enableCollisions,
  enableEllipsoidScale,
} from "./core.ts";

function createSurface(scene: Scene): GroundMesh {
  const ground = MeshBuilder.CreateGround("ground", { width: 70, height: 70 });
  ground.material = createGrassMaterial(scene);
  ground.receiveShadows = true;
  ground.checkCollisions = true;
  return ground;
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

async function createHountedHouse(
  scene: Scene,
  road: Mesh,
  position: Vector3
): Promise<AbstractMesh> {
  const roadBoundingBox = road.getBoundingInfo().boundingBox;
  const roadX = roadBoundingBox.minimumWorld.x - 2;
  const result = await ImportMeshAsync("/meshes/haunted_house.glb", scene);
  const house = result.meshes[0] as Mesh;

  house.scaling = new Vector3(20, 20, 20);
  house.position = position;
  house.position.x = roadX;
  createCollisionBox(house as Mesh, new Vector3(0.25, 0.5, 0.3), scene);

  return house;
}

async function createTree(
  scene: Scene,
  road: Mesh,
  zPos: number,
  yScaling: number
): Promise<AbstractMesh> {
  const result = await ImportMeshAsync("/meshes/tree.babylon", scene);

  const roadBoundingBox = road.getBoundingInfo().boundingBox;
  const roadX = roadBoundingBox.maximumWorld.x + 2;
  const tree = result.meshes[0] as Mesh;
  tree.overlayColor = new Color3(1, 0, 0); // red
  tree.scaling = new Vector3(20, yScaling, 20);
  tree.position = new Vector3(roadX, 0, zPos);
  createCollisionBox(tree, new Vector3(0.2, 0.6, 0.2), scene);
  return tree;
}

function createRoad(scene: Scene, ground: Mesh): Mesh {
  const boundingBox = ground.getBoundingInfo().boundingBox;

  const path = [
    new Vector3(0, 0, 0),
    new Vector3(0, 0, -5),
    new Vector3(0, 0, -10),
    new Vector3(0, 0, -20),
    new Vector3(0, 0, boundingBox.minimum.x * 2),
  ];

  const smoothPath = Curve3.CreateCatmullRomSpline(path, 20, false);

  const roadWidth = 10;
  const roadShape = [
    new Vector3(-roadWidth / 2, 0, 0), // left edge
    new Vector3(roadWidth / 2, 0, 0), // right edge
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

  const z = boundingBox.maximum.x;
  road.position.z = z;
  road.position.y = 0.1;
  const roadTexture = createTexture("/textures/road.jpg");
  roadTexture.uScale = 1;
  roadTexture.vScale = 3;

  road.material = createRoadMaterial(scene, roadTexture);
  road.receiveShadows = true;
  return road;
}

export async function createEnvironmentObjects(scene: Scene): Promise<Mesh[]> {
  const ground = createSurface(scene);
  const road = await createRoad(scene, ground);
  const house = await createHountedHouse(scene, road, new Vector3(-5, 0, -5));
  const house2 = await createHountedHouse(scene, road, new Vector3(10, 0, 10));

  const amountOfTrees = 10;

  const treeIndices = new Set<number>();
  // trees
  for (let num = 1; num < amountOfTrees; num++) {
    let treeAreaZ = -30 + num * 7;
    const yScaling = randomIntFromInterval(15,20);
    const tree = await createTree(scene, road, treeAreaZ, yScaling);
  }
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

  return [ground];
}
