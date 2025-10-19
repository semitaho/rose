import {
  Color3,
  PBRMaterial,
  Scene,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { SkyMaterial } from "@babylonjs/materials";
import { createTexture } from "./textures";

export function createMaterial(
  materialName: string,
  scene: Scene,
  color: Color3
) {
  const yellowMat = new PBRMaterial(materialName, scene);
  yellowMat.emissiveColor = color;
  yellowMat.roughness = 1.0;
  yellowMat.metallic = 0;
  yellowMat.baseWeight = 0.1;

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
  const texture = createTexture("/textures/grass.png");
  texture.uScale = texture.vScale = 2;
  grassMat.diffuseTexture = texture;
  grassMat.diffuseTexture.level = 1.3;
  return grassMat;
}

export function createSkyMaterial(scene: Scene): SkyMaterial {
  const skyMaterial = new SkyMaterial("skyMaterial", scene);

  skyMaterial.mieCoefficient = 0.0003; // 0 = horizon, 1 = overhead sun
  skyMaterial.turbidity = 10; // haze, 2-10
  skyMaterial.luminance = 0.3; // brightness
  skyMaterial.rayleigh = 2; // scattering
  skyMaterial.mieCoefficient = 0.005;
  skyMaterial.inclination = 0.263;
  skyMaterial.azimuth = 0,25;

  skyMaterial.backFaceCulling = false;
  // Optional: move sun position
  skyMaterial.sunPosition = new Vector3(0, 1, 0); // Gradient colors
  return skyMaterial;
}
