import {
  Color3,
  PBRMaterial,
  Scene,
  StandardMaterial,
  Texture,
} from "@babylonjs/core";

export function createMaterial(
  materialName: string,
  scene: Scene,
  color: Color3
) {
  const yellowMat = new PBRMaterial(materialName, scene);
  //yellowMat.albedoColor = color;
  yellowMat.emissiveColor = color;
  //yellowMat.ambientColor = color;
  yellowMat.roughness = 0.5;
  yellowMat.metallic = 0.5;

  return yellowMat;
}

export function createRoadMaterial(scene: Scene, texture: Texture) {
  const roadMat = new StandardMaterial("roadMat", scene);
  roadMat.diffuseTexture = texture;
  // Slightly brighten without changing the image
  roadMat.emissiveColor = new Color3(0.2, 0.2, 0.2); // adds light
  roadMat.alpha = 1.0; // ensure opacity is full
  return roadMat;
}

export function createGrassMaterial(scene: Scene) {
  const grassMat = new StandardMaterial("grassMat", scene);
  grassMat.diffuseTexture = new Texture("/textures/grass.png", scene);
  grassMat.diffuseTexture.level = 1.8;
  return grassMat;
}
