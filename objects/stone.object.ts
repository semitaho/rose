import { Mesh, MeshBuilder, Vector3, type Scene } from "@babylonjs/core";
import { RoseObject } from "./rose.object.js";
import { createMaterial } from "../materials.js";
import { createTexture } from "../textures.js";

export default class Stone extends RoseObject {
  readonly _speed = 10;
  readonly _radius = 0.4;

  constructor(name: string, scene: Scene) {
    super(name, scene);
    this.checkCollisions = false;
  }

  move(deltaTimeInSeconds: number) {
    this.mesh.moveWithCollisions(
      Vector3.Forward().scale(deltaTimeInSeconds * this._speed),
      false
    );
    this.rotation.x -= this._speed / this._radius;
  }

  createBody(): Mesh {
    return MeshBuilder.CreateSphere("stone", { diameter: 1 }, this._scene);
  }

  createChildren(): void {
    const material = createMaterial("stoneMat", this._scene);
    const texture = createTexture("/textures/rock.png");
    texture.uScale = 2;
    material.albedoTexture = texture;
    material.metallic = 0;
    material.baseWeight = 1;
    //material.bumpTexture.invertZ = true;
    //material.bumpTexture= texture;
    //material.roughness = 1.0;

    this.material = material;
  }
}
