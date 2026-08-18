import { Ball } from "./Ball.js";
import { battingBackZ, battingPopping, initPitch } from "./pitch.js";
import { Bat } from "./Bat.js";
import { phoneRotationData } from "./main.js";
import { game_state, getCurrentGameState, setGameState } from "./appState.js";

export const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

//was 0, 2, 16
camera.position.set(0, 2, battingPopping);
camera.lookAt(0, 0, 0);

initPitch();
createSky(scene);

Ball.instance.draw();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const floodLight = new THREE.DirectionalLight(0xffffff, 1.2);
floodLight.position.set(0, 20, 5);
scene.add(floodLight);

const clock = new THREE.Clock();
scene.add(Bat.instance.createBat());

//Loop
export function animate() {
  requestAnimationFrame(animate);

  //always drain
  const deltaTime = clock.getDelta(); // seconds since last frame

  if (getCurrentGameState() != game_state.PLAYING) {
    return;
  }

  Ball.instance.update(deltaTime); // update ball positon

  Bat.instance.update();
  //render ground
  renderer.render(scene, camera);
}

function createSky(scene) {
  const skyGroup = new THREE.Group();

  //create lare plane behind pitch for the sky
  const skyGeometry = new THREE.PlaneGeometry(300, 150);

  //using vertex colors for gradient effect
  const skyMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
  });

  const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);

  // Set vertex colors for gradient effect
  const topColor = new THREE.Color(0x2b4c7e); //dusk blue
  const bottomColor = new THREE.Color(0xef8c68); //sunset orange

  //apply the colors to the 4 corners of the plane
  const colors = [
    topColor.r,
    topColor.g,
    topColor.b, //top left
    topColor.r,
    topColor.g,
    topColor.b, //top right
    bottomColor.r,
    bottomColor.g,
    bottomColor.b, //bottom left
    bottomColor.r,
    bottomColor.g,
    bottomColor.b, //bottom right
  ];

  skyGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );

  skyGroup.add(skyMesh);

  // add clouds
  const cloudMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
  });

  //helper to add clouds
  function addCloud(wd, ht, x, y) {
    const cloudGeometry = new THREE.PlaneGeometry(wd, ht);
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.position.set(x, y, 1); //place little infront of sky plane
    skyGroup.add(cloud);
  }

  //add clouds
  addCloud(40, 8, -60, 25);
  addCloud(55, 10, 10, 35);
  addCloud(35, 7, 70, 20);
  addCloud(25, 6, -20, 15);

  //move whole skygroup behind the pitch
  skyGroup.position.set(0, 40, -120);

  scene.add(skyGroup);
}
