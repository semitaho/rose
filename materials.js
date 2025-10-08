import { StandardMaterial, Texture } from "@babylonjs/core";
import { BLACK } from "./colors";

export function createMaterial(materialName, scene, color) {
  const yellowMat = new StandardMaterial(materialName, scene);
  yellowMat.diffuseColor = color;
  return yellowMat;
}

export function createGrassMaterial(scene) {
  const grassMat = new StandardMaterial("grassMat", scene);
  grassMat.diffuseTexture = new Texture("/textures/grass.png", scene);
  grassMat.diffuseTexture.level = 1.8;
  return grassMat
}

