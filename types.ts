import { GroundMesh, Mesh } from "@babylonjs/core";
import type Stone from "./objects/stone.object.js";


export type Environment = {
  stones: Stone[];
  ground: GroundMesh;
  houses: Mesh[];
  trees: Mesh[];
}