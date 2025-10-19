import { CubeTexture, DynamicTexture, Scene, Texture } from "@babylonjs/core";

export function createNiceTexture(scene: Scene): DynamicTexture {
  const texture = new DynamicTexture(
    "dynamic texture",
    { width: 256, height: 256 },
    scene,
    false
  );
  const ctx = texture.getContext();
  const textureSize = 256;

  // Draw an arc at the bottom
  const centerX = textureSize / 2;
  const centerY = textureSize - textureSize / 14; // bottom of the texture
  const radius = textureSize / 4;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, textureSize, textureSize);

  // Top half red
  ctx.beginPath();
  ctx.arc(
    centerX, // x center
    centerY, // y center (bottom)
    radius, // radius
    Math.PI, // start angle (left side)
    0 // end angle (right side)
  );
  // ctx.lineTo(centerX+ radius, 0); // close the bottom edge
  // ctx.lineTo(centerX - radius, 0);
  ctx.closePath();

  // Fill with yellow
  ctx.fillStyle = "darkBlue";
  ctx.fill();
  texture.update();
  return texture;
}

export function createTexture(path: string): Texture {
  const texture = new Texture(path);
  return texture;
}

export function createEnvTexture(scene: Scene): CubeTexture {
  // Load a default environment texture
  const envTex = CubeTexture.CreateFromPrefilteredData(
    "https://assets.babylonjs.com/environments/environmentSpecular.env",
    scene
  );
  return envTex;
}
