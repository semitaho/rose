import {
  Material,
  TransformNode,
  Vector3,
  type Mesh,
  type Scene,
  type Vector,
} from "@babylonjs/core";

export abstract class RoseObject extends TransformNode {
  private _mesh: Mesh;

  constructor(name: string, scene: Scene) {
    super(name, scene);
    this._mesh = this.createBody();
    this.createChildren();
    this._mesh.addLODLevel(50, null);
  }

  set mesh(mesh: Mesh) {
    this._mesh = mesh;
  }

  get position(): Vector3 {
    if (!this._mesh) {
      throw new Error("Mesh not set yet");
    }
    return this._mesh.position;
  }

  get rotation(): Vector3 {
    if (!this._mesh) {
      throw new Error("Mesh not set yet");
    }
    return this._mesh.rotation;
  }

  get mesh(): Mesh {
    if (!this._mesh) {
      throw new Error("Mesh not set yet");
    }
    return this._mesh;
  }

  set material(material: Material) {
    if (this._mesh) {
      this._mesh.material = material;
    }
  }

  set checkCollisions(value: boolean) {
    
    //this.checkCollisions = value;
    if (this._mesh) {
      this._mesh.checkCollisions = value;
    }
  }

  addChild(child: TransformNode, preserveScalingSign?: boolean): this {
    this._mesh!.addChild(child, preserveScalingSign);
    return this;
  }

  abstract createBody(): Mesh;

  abstract createChildren(): void;
}
