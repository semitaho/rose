import { AbstractMesh, Color3, Mesh } from "@babylonjs/core";


export function getChildMeshByNameUnique(parentMesh: Mesh, name: string): AbstractMesh {
  return parentMesh.getChildMeshes(false, mesh => mesh.name === name)[0];
}

export function toColor(r: number, g: number, b: number): Color3 {
  return new Color3(r / 255, g / 255, b / 255);
}

export function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}