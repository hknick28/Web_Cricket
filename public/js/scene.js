import { Ball } from "./Ball.js";
import { initPitch } from "./pitch.js";

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
camera.position.set(0, 2, 16);
camera.lookAt(0, 0, 0);

initPitch();
Ball.instance.draw();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const floodLight = new THREE.DirectionalLight(0xffffff, 1.2);
floodLight.position.set(0, 20, 5);
scene.add(floodLight);

const clock = new THREE.Clock();

//Loop
export function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta(); // seconds since last frame
  Ball.instance.update(deltaTime); // update ball positon

  //render ground
  renderer.render(scene, camera);
}
