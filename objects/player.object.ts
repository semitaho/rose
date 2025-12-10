import {
  Color3,
  KeyboardEventTypes,
  KeyboardInfo,
  Mesh,
  MeshBuilder,
  Scalar,
  Scene,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import {
  createBody,
  createEye,
  createSarvi,
  createWing,
  createMouth,
  createPoski,
  EYE_RIGHT_VECTOR,
  EYE_LEFT_VECTOR,
} from "../characters.js";
import { RoseObject } from "./rose.object.js";
import { createMaterial } from "../materials.js";
import { BLACK, PINK, WING_COLOR } from "../colors.js";

// Key state tracking
const keys: { [key: string]: boolean } = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

export default class PlayerMesh extends RoseObject {
  readonly hidastuvuusNopeus = 0.5;
  readonly epsilon = 0.01; // threshold
  readonly jumpForce = 13;
  readonly speed = 7;
  readonly gravity = -30.8;
  readonly rotationSpeed = 15;

  private _moveDirection: Vector3 = Vector3.Zero(); // vector that holds movement information

  private _vertical = 0;
  private _horizontal = 0;
  private _verticalAxis = 0;
  private _horizontalAxis = 0;
  private _verticalSpeed = 0;
  private _jumpPositionY = 0;

  private _jumping = false;

  constructor(scene: Scene) {
    super("player", scene);
  }

  createBody(): Mesh {
    return createBody(this._scene, "player");
  }

  public move(deltaTimeInSeconds: number): void {
    this.mesh.moveWithCollisions(
      this._moveDirection.scale(deltaTimeInSeconds * this.speed),
      false
    );
  }

  updateFromKeyboard() {
    if (keys["ArrowUp"]) {
      this._vertical = Scalar.Lerp(this._vertical, -1, 0.2);
      this._verticalAxis = -1;
    } else if (keys["ArrowDown"]) {
      this._vertical = Scalar.Lerp(this._vertical, 1, 0.2);
      this._verticalAxis = 1;
    } else {
      this._vertical = Scalar.Lerp(this._vertical, 0, this.hidastuvuusNopeus);
      if (Math.abs(this._vertical) < this.epsilon) {
        this._vertical = 0;
      }
      this._verticalAxis = 0;
    }

    if (keys["ArrowLeft"]) {
      this._horizontal = Scalar.Lerp(this._horizontal, 1, 0.2);
      this._horizontalAxis = 1;
    } else if (keys["ArrowRight"]) {
      this._horizontal = Scalar.Lerp(this._horizontal, -1, 0.2);
      this._horizontalAxis = -1;
    } else {
      this._horizontal = Scalar.Lerp(
        this._horizontal,
        0,
        this.hidastuvuusNopeus
      );
      this._horizontalAxis = 0;
      if (Math.abs(this._horizontal) < this.epsilon) {
        this._horizontal = 0;
      }
    }
    this._moveDirection = new Vector3(
      this._horizontal,
      0,
      this._vertical
    ).normalize();
  }

  updatePlayerKeyboard(kbInfo: KeyboardInfo): void {
    if (kbInfo.event.code === "Space" && !this._jumping) {
      this._jumping = true;
      this._jumpPositionY = this.position.y;
      this._verticalSpeed = this.jumpForce;
      return;
    }

    switch (kbInfo.type) {
      case KeyboardEventTypes.KEYDOWN:
        keys[kbInfo.event.code] = true;
        break;
      case KeyboardEventTypes.KEYUP:
        keys[kbInfo.event.code] = false;
        break;
      default:
        console.log("default");
    }
  }

  checkJump(deltaTimeInSeconds: number): void {
    const wing1 = this.mesh.getChildMeshes(false, (m) => m.name === "wing")[0];
    const wing2 = this.mesh.getChildMeshes(false, (m) => m.name === "wing")[1];
    if (this._jumping) {
      // flapWings(wing1, wing2);
      this._verticalSpeed += this.gravity * deltaTimeInSeconds;
      this.position.y += this._verticalSpeed * deltaTimeInSeconds;
      if (this.position.y <= this._jumpPositionY) {
        this.position.y = this._jumpPositionY;
        this._verticalSpeed = 0;
        this._jumping = false;
      }
    }
  }

  checkRotation(deltaTimeInSeconds: number): void {
    // rotation
    let input = new Vector3(this._horizontalAxis, 0, this._verticalAxis); //along which axis is the direction

    if (input.length() == 0) {
      //if there's no input detected, prevent rotation and keep player in same rotation
      return;
    }
    let angle = Math.atan2(this._horizontalAxis, this._verticalAxis);
    let angleDiff = angle - this.rotation.y;
    angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
    this.rotation.y +=
      angleDiff * Math.min(1, this.rotationSpeed * deltaTimeInSeconds);
  }

  createChildren(): void {
    const blackMat = createMaterial("blackMat", this._scene, BLACK);
    const pinkMat = createMaterial("pinkMat", this._scene, PINK);
    const positionX = 0.6;
    this.addChild(createSarvi(this._scene, blackMat, positionX, -1));
    this.addChild(createSarvi(this._scene, blackMat, -positionX));
    this.addChild(createEye(this._scene, blackMat, EYE_LEFT_VECTOR));
    this.addChild(createEye(this._scene, blackMat, EYE_RIGHT_VECTOR));
    // quizmallows.addChild(createEye(scene, blackMat, -0.25));
    this.addChild(createMouth(this._scene, blackMat));
    this.addChild(createPoski(this._scene, 0.5, pinkMat));
    this.addChild(createPoski(this._scene, -0.5, pinkMat));

    const wingMat = createMaterial("wingMat", this._scene, WING_COLOR);
    const wing1 = createWing(this._scene, wingMat);
    const wing2 = createWing(this._scene, wingMat, -1);
    this.addChild(wing1);
    this.addChild(wing2);

    const playerMat = createMaterial("playerMat", this._scene, Color3.Yellow()); // pure yellow (R=1, G=1, B=0)
    playerMat.baseWeight = 0.1;
    this.material = playerMat;
  }
}
