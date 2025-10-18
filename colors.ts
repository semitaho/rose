import { Color3 } from "@babylonjs/core";

export const LIGHT_BLUE = new Color3(0.4, 0.7, 1.0);
export const DEEPER_BLUE = new Color3(0.0, 0.5, 1.0); 
console.log('kekkonen:'+ (139/255))
export const DARK_BLUE = new Color3(0, rgbToDec(139), 0.5451);
export const BLACK = new Color3(0, 0, 0);
export const PINK = new Color3(210 / 255, 151 / 255, 161 / 255);
export const WING_COLOR =  new Color3(95 / 255, 234 / 255, 249 / 255);
export const YELLOW = new Color3(1, 1, 0)

function rgbToDec(value: number): number {
  const val = Math.round(value * 100 / 255) / 100;
  console.log('val', val);
  return val;
}