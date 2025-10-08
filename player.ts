import {
  KeyboardEventTypes,
  KeyboardInfo,
  Mesh,
  Scalar,
  Vector3,
} from "@babylonjs/core";

let _moveDirection = Vector3.Zero(); // vector that holds movement information
const speed = 7;
// Key state tracking
const keys: { [key: string]: boolean } = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

let vertical = 0;
let horizontal = 0;
let verticalAxis = 0;
let horizontalAxis = 0;
let jumping = false;
let verticalSpeed = 0;
const gravity = -30.8;
const hidastuvuusNopeus = 0.5;
const epsilon = 0.01; // threshold
const jumpForce = 13;
const rotationSpeed = 15;
let jumpPositionY = 0;

export function updatePlayerKeyboard(player: Mesh, kbInfo: KeyboardInfo): void {
  if (kbInfo.event.code === "Space" && !jumping) {
    jumping = true;
    jumpPositionY = player.position.y;
    verticalSpeed = jumpForce;
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

export function _updateFromKeyboard() {
  if (keys["ArrowUp"]) {
    vertical = Scalar.Lerp(vertical, -1, 0.2);
    verticalAxis = -1;
  } else if (keys["ArrowDown"]) {
    vertical = Scalar.Lerp(vertical, 1, 0.2);
    verticalAxis = 1;
  } else {
    vertical = Scalar.Lerp(vertical, 0, hidastuvuusNopeus);
    if (Math.abs(vertical) < epsilon) {
      vertical = 0;
    }
    verticalAxis = 0;
  }

  if (keys["ArrowLeft"]) {
    horizontal = Scalar.Lerp(horizontal, 1, 0.2);
    horizontalAxis = 1;
  } else if (keys["ArrowRight"]) {
    horizontal = Scalar.Lerp(horizontal, -1, 0.2);
    horizontalAxis = -1;
  } else {
    horizontal = Scalar.Lerp(horizontal, 0, hidastuvuusNopeus);
    horizontalAxis = 0;
    if (Math.abs(horizontal) < epsilon) {
      horizontal = 0;
    }
  }
  _moveDirection = new Vector3(horizontal, 0, vertical).normalize();
}

export function move(player: Mesh, deltaTimeInSeconds: number): void {
  player.moveWithCollisions(_moveDirection.scale(deltaTimeInSeconds * speed));
}

export function checkJump(player: Mesh, deltaTimeInSeconds: number): void {
  const wing1 = player.getChildMeshes(false, (m) => m.name === "wing")[0];
  const wing2 = player.getChildMeshes(false, (m) => m.name === "wing")[1];
  if (jumping) {
    // flapWings(wing1, wing2);
    verticalSpeed += gravity * deltaTimeInSeconds;
    player.position.y += verticalSpeed * deltaTimeInSeconds;
    if (player.position.y <= jumpPositionY) {
      player.position.y = jumpPositionY;
      verticalSpeed = 0;
      jumping = false;
    }
  }
}

export function checkRotation(player: Mesh, deltaTimeInSeconds: number): void {
  // rotation
  let input = new Vector3(horizontalAxis, 0, verticalAxis); //along which axis is the direction

  if (input.length() == 0) {
    //if there's no input detected, prevent rotation and keep player in same rotation
    return;
  }
  let angle = Math.atan2(horizontalAxis, verticalAxis);
  let angleDiff = angle - player.rotation.y;
  angleDiff = Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
  player.rotation.y +=
    angleDiff * Math.min(1, rotationSpeed * deltaTimeInSeconds);
}
