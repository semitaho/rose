import {
  ArcRotateCamera,
  Camera,
  Color3,
  Color4,
  DirectionalLight,
  Engine,
  type IShadowLight,
  Light,
  Mesh,
  MeshBuilder,
  Node,
  Scene,
  ShadowGenerator,
  Vector3,
} from "@babylonjs/core";

export function createEngine(): Engine {
  const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
  const engine = new Engine(canvas, true);
  return engine;
}

export function createScene(engine: Engine): Scene {
  const scene = new Scene(engine, {});
  scene.collisionsEnabled = true;
  //scene.clearColor = new Color4(0.6, 0.8, 1.0, 1.0); // soft blue sky

  return scene;
}

export function createCollisionBox(
  mesh: Mesh,
  sizeVector: Vector3,
  scene: Scene
): Mesh {
  const sizeX = sizeVector.x * mesh.scaling.x;
  const sizeY = sizeVector.y * mesh.scaling.y;
  const sizeZ = sizeVector.z * mesh.scaling.z;
  const collisionBox = MeshBuilder.CreateBox(
    mesh.name + "Collision",
    { width: sizeX, height: sizeY, depth: sizeZ },
    scene
  );
  collisionBox.position = mesh.position.clone();
  collisionBox.checkCollisions = true;
  collisionBox.isVisible = false;
  return collisionBox;
}

export function enableEllipsoidScale(node: Node, scaleFactor: number) {
  if (node instanceof Mesh) {
    node.ellipsoid = node.ellipsoid.scale(scaleFactor);
  }
  if (node.getChildren().length > 0) {
    node.getChildren().forEach((childMesh: Node) => {
      enableEllipsoidScale(childMesh, scaleFactor);
    });
  }
}

export function createDefaultLight(scene: Scene): Light {
  const light = new DirectionalLight("light", new Vector3(-1, -1, -1), scene);
  light.intensity = 0.9;
  light.position = new Vector3(20, 70, 20);
  light.shadowEnabled = true;
  return light;
}

export function createShadowGenerator(light: IShadowLight): ShadowGenerator {
  const shadowGenerator = new ShadowGenerator(2048, light);
  shadowGenerator.useExponentialShadowMap = true;
  shadowGenerator.useContactHardeningShadow = true;
  shadowGenerator.usePoissonSampling = true;
  return shadowGenerator;
}

export function createDefaultCamera(scene: Scene, target: Mesh): Camera {
  // Camera
  const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2.5,
    20,
    target.position,
    scene
  );
  camera.lockedTarget = target;
  camera.attachControl(true);
  camera.detachControl();
  return camera;
}
