import "./scene.js";

import { scene } from "./scene.js";
import { Stump } from "./stump.js";

// Scale: 1 unit = 1 meter
let width = 3.05;
let height = 20.12;
//let zOffset = -10;

let rotate = -Math.PI / 2;

let lineWidth = 0.05;
let creaseLineDepth = 0.2;

let poppingCreaseOffset = 1.22;

let wideLineLen = poppingCreaseOffset;
let wideLineWidth = creaseLineDepth;

export let bowlingBackZ = -height / 2;
export let battingBackZ = height / 2;

export let wideLineOffset = 1.2;

// near end (batter's end)
let bowlingPopping = bowlingBackZ + poppingCreaseOffset;
export let battingPopping = battingBackZ - poppingCreaseOffset;

let battingWideX = battingPopping + wideLineOffset / 2;

export function initPitch() {
  const pitch = new THREE.PlaneGeometry(width, height);
  const surface = new THREE.MeshLambertMaterial({ color: 0xc8a96e });
  const mesh = new THREE.Mesh(pitch, surface);

  mesh.rotation.x = rotate;
  mesh.position.y = 0.01; // Slightly above ground to avoid z-fighting

  scene.add(mesh);

  setupCrease();
  setupStumps();
  setupOutfield();
}

function createLine(lineWidth, depth, z, x) {
  const line = new THREE.PlaneGeometry(lineWidth, depth);
  const surface = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const lineMesh = new THREE.Mesh(line, surface);
  lineMesh.position.set(x, 0.01, z);
  lineMesh.rotation.x = rotate;

  scene.add(lineMesh);
  return lineMesh;
}

function setupCrease() {
  // Creases
  createLine(width, creaseLineDepth, battingPopping, 0); //batting popin
  createLine(width, creaseLineDepth, battingBackZ, 0); // batter stump

  createLine(width, creaseLineDepth + 0.2, bowlingPopping, 0);
  createLine(width, creaseLineDepth + 0.2, bowlingBackZ, 0);

  // Wide lines
  createLine(wideLineWidth, wideLineLen, battingWideX, -wideLineOffset); //Batter-left
  createLine(wideLineWidth, wideLineLen, battingWideX, wideLineOffset); //Batter-right

  createLine(wideLineWidth, wideLineLen, -battingWideX, -wideLineOffset); //Batter-left
  createLine(wideLineWidth, wideLineLen, -battingWideX, wideLineOffset); //Batter-right
}

export let battersEndStumps;

function setupStumps() {
  battersEndStumps = new Stump(battingBackZ);
  battersEndStumps.drawStumps();
  const bowlingEndStumps = new Stump(bowlingBackZ);
  bowlingEndStumps.drawStumps();
}

function setupOutfield() {
  const groundGeometry = new THREE.PlaneGeometry(100, 100);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x228b22,
    roughness: 0.8,
    metalness: 0.1,
  });

  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

  groundMesh.rotation.x = -Math.PI / 2; //lay flat horizontally
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
}
