import { AbstractMesh, Mesh } from "@babylonjs/core";


export function getChildMeshByNameUnique(parentMesh: Mesh, name: string): AbstractMesh {
  return parentMesh.getChildMeshes(false, mesh => mesh.name === name)[0];
}