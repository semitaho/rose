import {
  Color3,
  Material,
  Mesh,
  MeshBuilder,
  Scene,
  StandardMaterial,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { createMaterial } from "./materials";
import { BLACK, DARK_BLUE, DEEPER_BLUE, LIGHT_BLUE, PINK, WING_COLOR, YELLOW } from "./colors";
import { createNiceTexture } from "./textures";
import { toColor } from "./util";

const EYE_LEFT_VECTOR = new Vector3(-0.25, 0.25, 0.8);
const EYE_RIGHT_VECTOR = new Vector3(0.25, 0.25, 0.8);
const MOUTH_VECTOR = new Vector3(0, 0.1, 1);
const SARVI_LEFT_VECTOR = new Vector3(0.6, 0.6, 0);
const SARVI_RIGHT_VECTOR = new Vector3(-0.6, 0.6, 0);
const POSKI_LEFT_VECTOR = new Vector3(0.5, 0.1, 0.8);
const POSKI_RIGHT_VECTOR = new Vector3(-0.5, 0.1, 0.8);
const MOUTH_POSITION = new Vector3(0, 0.1, 0.65);

export function createPlayer(scene: Scene) {
  // Mesh
  const quizmallows = createBody(scene, "quizmallows");
  const blackMat = createMaterial("blackMat", scene, BLACK);
  const pinkMat = createMaterial("pinkMat", scene, PINK);
  const positionX = 0.6;
  quizmallows.addChild(createSarvi(scene, blackMat, positionX, -1));
  quizmallows.addChild(createSarvi(scene, blackMat, -positionX));
  quizmallows.addChild(createEye(scene, blackMat, EYE_LEFT_VECTOR));
  quizmallows.addChild(createEye(scene, blackMat, EYE_RIGHT_VECTOR));
  // quizmallows.addChild(createEye(scene, blackMat, -0.25));
  quizmallows.addChild(createMouth(scene, blackMat));
  quizmallows.addChild(createPoski(scene, 0.5, pinkMat));
  quizmallows.addChild(createPoski(scene, -0.5, pinkMat));

  const wingMat = createMaterial("wingMat", scene, WING_COLOR);
  const wing1 = createWing(scene, wingMat);
  const wing2 = createWing(
    scene,
    wingMat,
    -1
  );
  quizmallows.addChild(wing1);
  quizmallows.addChild(wing2);

  const playerMat = createMaterial("playerMat", scene, Color3.Yellow()); // pure yellow (R=1, G=1, B=0)
  playerMat.baseWeight = 0.1;
  quizmallows.material = playerMat;
  
  quizmallows.position.y = 0.6;
  quizmallows.position.z = 1.0;
  quizmallows.position.x = 5.0;
  return quizmallows;
}

export function createCat(scene: Scene) {
  const quizmallows = createBody(scene, "cat");

  const mat = new StandardMaterial("catMat", scene);
  mat.diffuseTexture = createNiceTexture(scene);
  mat.diffuseColor = Color3.White(); // light blue

  quizmallows.material = mat;
  const catEyeMat = createMaterial("catEyeMat", scene, BLACK);
  quizmallows.addChild(
    createCatEye(
      scene,
      catEyeMat,
      EYE_LEFT_VECTOR,
      1
    )
  );
  quizmallows.addChild(
    createCatEye(
      scene,
      catEyeMat,
      EYE_RIGHT_VECTOR
    )
  );
  quizmallows.addChild(
    createNouseMouth(scene, createMaterial("catEyeMat", scene, LIGHT_BLUE))
  );

  const poskiPunastusMat = createMaterial("poskiPunastusMat", scene, BLACK);
  quizmallows.addChild(createPoskiPunastus(scene, poskiPunastusMat, 1));
  quizmallows.addChild(createPoskiPunastus(scene, poskiPunastusMat, -1));
  quizmallows.addChild(createEar(scene, 1, DARK_BLUE));
  quizmallows.addChild(createEar(scene, -1 ));
  quizmallows.addChild(
    createCatMouth(scene, createMaterial("catMouthMat", scene, BLACK))
  );
  return quizmallows;
}

function createWing(scene: Scene, material: Material, direction = 1) {
  const wing1 = MeshBuilder.CreatePlane(
    "wing",
    { width: 0.35, height: 0.7, sideOrientation: Mesh.DOUBLESIDE },
    scene
  );
  wing1.rotation.z = (direction * Math.PI) / 3;
  wing1.position.y = 0.4;
  wing1.position.x = -0.5 * direction;

  wing1.position.z = -0.5;
  wing1.material = material;
  return wing1;
}

function createMouth(scene: Scene, material: Material) {
  const path = [];
  const radius = 0.2;
  const deltaTheta = 0.5;
  for (let theta = 0; theta < Math.PI; theta += deltaTheta) {
    path.push(
      new Vector3(1.5 * radius * Math.cos(theta), -radius * Math.sin(theta), 0)
    );
  }
  const arcTube = MeshBuilder.CreateTube(
    "eye",
    {
      path,
      radius: 0.02,
    },
    scene
  );

  arcTube.position = MOUTH_POSITION;
  arcTube.material = material;
  return arcTube;
}

function createPoski(scene: Scene, positionX: number, pinkMat: Material) {
  const sphere = MeshBuilder.CreateSphere(
    "poski",
    {
      diameterX: 0.3,
      diameterZ: 0.05,
      diameterY: 0.1,
    },
    scene
  );
  sphere.position.z = 0.5;
  sphere.position.x = positionX;
  sphere.position.y = 0.1;

  sphere.material = pinkMat;
  return sphere;
}

function createEye(scene: Scene, material: Material, locationVector: Vector3) {
  const path = [];
  const radius = 0.2;
  const deltaTheta = 0.1;
  for (let theta = 0; theta < 2 * Math.PI; theta += deltaTheta) {
    path.push(
      new Vector3(radius * Math.cos(theta), radius * Math.sin(theta), 0)
    );
  }
  const arcTube = MeshBuilder.CreateTube(
    "eye",
    {
      path,
      radius: 0.02,
    },
    scene
  );

  arcTube.locallyTranslate(locationVector);
  arcTube.material = material;
  arcTube.position.z = 0.5;
  return arcTube;
}

function createSarvi(
  scene: Scene,
  material: Material,
  positionX: number,
  direction = 1
) {
  const deltaTheta = 0.5;
  const radius = 0.2;
  const path = [];
  for (let theta = 0; theta < Math.PI / 2; theta += deltaTheta) {
    path.push(
      new Vector3(
        direction * radius * Math.cos(theta),
        radius * Math.sin(theta),
        0
      )
    );
  }
  const ripsiTube = MeshBuilder.CreateTube(
    "ripsi",
    {
      path,
      cap:Mesh.CAP_ALL,
      radius: 0.05,
      
    },
    scene
  );
  ripsiTube.position.x = positionX;
  ripsiTube.position.y = 0.6;
  ripsiTube.material = material;
  return ripsiTube;
}

function createNouseKaari(scene: Scene, material: Material) {
  const path = [];
  const radius = 0.06;
  const deltaTheta = 0.1;
  for (let theta = 0; theta < Math.PI; theta += deltaTheta) {
    path.push(
      new Vector3(1.5 * radius * Math.cos(theta), -radius * Math.sin(theta), 0)
    );
  }
  const arcTube = MeshBuilder.CreateTube(
    "eye",
    {
      path,
      radius: 0.02,
    },
    scene
  );
  arcTube.material = material;
  arcTube.position.y = 0.5;
  arcTube.position.z = 1;
  return arcTube;
}

function createNouseMouth(scene: Scene, material: Material) {
  const nousekaari1 = createNouseKaari(scene, material);
  const nousekaari2 = createNouseKaari(scene, material);

  const vali = 0.08;
  nousekaari1.position.x = vali;
  nousekaari2.position.x = -vali;

  // nousekaari2.position.x = -0.5;
  const node = new TransformNode("nosemouth", scene);
  const nose = MeshBuilder.CreateTube(
    "nose",
    {
      path: [new Vector3(0, 0, 1), new Vector3(0, 0.15, 1)],
      radius: 0.02,
    },
    scene
  );
  nose.position.y = 0.5;
  node.addChild(nose);
  node.addChild(nousekaari1);
  node.addChild(nousekaari2);
  nose.position.x = 0;
  nose.position.y = -0;

  node.position.z = -0.4;
  node.position.y = -0.1;
  
  return node;
}

function createBody(scene: Scene, name: string) {
  // Mesh
  const quizmallows = MeshBuilder.CreateSphere(
    name,
    {
      arc: 2,
      diameterX: 1.8,
      diameterY: 1.5,
      diameterZ: 1.3,
    },
    scene
  );
  return quizmallows;
}

function createEar(scene: Scene, direction: number, earColor = LIGHT_BLUE) {
  const earMat = createMaterial("earMat", scene, earColor);

  const ear1 = MeshBuilder.CreateSphere(
    "ear1",
    {
      segments: 32,
      slice: 1,
      diameterZ: 1,
      sideOrientation: Mesh.DOUBLESIDE,
      diameterX: 0.5,
      diameterY: 0.4,
    },
    scene
  );

  ear1.position.x = -0.5 * direction;
  ear1.position.y = 0.7;
  ear1.rotation.y = Math.PI;

  ear1.material = earMat;

  // älä koske!!
  ear1.rotation.x = Math.PI / 2;
  const node = new TransformNode("ear1node", scene).addChild(ear1);
  node.rotation.z = 0.3 * direction;
  return node;
}

function createPoskiPunastus(scene: Scene, material: Material, direction = 1) {
  const poskipunastusNode = new TransformNode("poskipunastusNode", scene);
  const path = [new Vector3(0, 0, 0), new Vector3(0.3 * direction, 0.1, 0)];
  const sphere = MeshBuilder.CreateTube(
    "poskipunastus",
    {
      path,
      sideOrientation: Mesh.DOUBLESIDE,
      radius: 0.02,
      updatable: false,
      tessellation: 10,
      cap: Mesh.CAP_ALL,
    },
    scene
  );
  sphere.position.z = 0.8;
  sphere.position.x = 0.3 * direction;
  sphere.position.y = 0.2;

  sphere.material = material;
  const sphere2 = sphere.clone();
  sphere2.position.y -= 0.05;
  sphere2.rotation.x = Math.PI / 2;

  poskipunastusNode.addChild(sphere);
  poskipunastusNode.addChild(sphere2);
  poskipunastusNode.position.z = -0.3;
  return poskipunastusNode;
}

function createCatEye(
  scene: Scene,
  material: Material,
  locationVector: Vector3,
  ripsiDirection = -1
) {
  const catEye = MeshBuilder.CreateSphere(
    "catEye",
    {
      diameterX: 0.2,
      diameterZ: 0.2,
      diameterY: 0.2,
    },
    scene
  );

  const ripsi = MeshBuilder.CreateSphere(
    "catEyeBox",
    { diameterX: 0.05, diameterY: 0.1, diameterZ: 0.05 },
    scene
  );
  ripsi.material = material;
  ripsi.position.y = 0.1;
  ripsi.position.x = -ripsiDirection * 0.1;
  ripsi.rotation.z = (ripsiDirection * Math.PI) / 4;

  const ripsi2 = MeshBuilder.CreateSphere(
    "catEyeBox",
    { diameterX: 0.05, diameterY: 0.1, diameterZ: 0.05 },
    scene
  );
  ripsi2.material = material;
  ripsi2.position.y = 0.07;
  ripsi2.position.x = -ripsiDirection * 0.1;
  ripsi2.rotation.z = (ripsiDirection * Math.PI) / 2.5;

  catEye.addChild(ripsi);
  catEye.addChild(ripsi2);

  catEye.locallyTranslate(locationVector);
  catEye.position.z -= 0.35;
  catEye.position.x += -ripsiDirection * 0.1;

  catEye.position.y += 0.2;

  catEye.material = material;
  return catEye;
}

function createCatMouth(scene: Scene, material: Material) {
  const catMouth = MeshBuilder.CreateSphere(
    "catMouth",
    {
      diameterX: 0.5,
      diameterZ: 0.05,
      diameterY: 0.1,
    },
    scene
  );
  catMouth.material = material;
  catMouth.position = MOUTH_POSITION;
  return catMouth;
}
