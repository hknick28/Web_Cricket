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

  if (getCurrentGameState() != game_state.PLAYING) {
    return;
  }

  const deltaTime = clock.getDelta(); // seconds since last frame
  Ball.instance.update(deltaTime); // update ball positon

  Bat.instance.update();
  //render ground
  renderer.render(scene, camera);
}
