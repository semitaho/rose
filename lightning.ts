import {
  Color3,
  DirectionalLight,
  DynamicTexture,
  Light,
  Scene,
  Vector3,
} from "@babylonjs/core";

export function createSunLight(scene: Scene): DirectionalLight {
  const sun = new DirectionalLight(
    "sunLight",
    new Vector3(-1, -2, -1),
    scene
  );
  sun.position = new Vector3(100, 200, 100); // must be above/behind scene

  sun.intensity = 1.1;
  
 // sun.diffuse = new Color3(1, 0.95, 0.8); // warm sunlight
 // sun.specular = new Color3(1, 1, 1);
  return sun;
}
