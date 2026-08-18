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

  // Create a large dome surrounding the entire pitch area (radius 200m)
  // SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)
  const skyGeometry = new THREE.SphereGeometry(
    200,
    32,
    16,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.65,
  );

  const skyMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true,
    side: THREE.BackSide, // Render inside of the sphere
  });

  const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);

  const topColor = new THREE.Color(0x2b4c7e); // Dusk blue
  const bottomColor = new THREE.Color(0xef8c68); // Sunset orange

  const positionAttribute = skyGeometry.getAttribute("position");
  const colors = [];

  // Gradient based on vertex height (Y position)
  for (let i = 0; i < positionAttribute.count; i++) {
    const y = positionAttribute.getY(i);
    // Normalize Y height from 0 (horizon) to 200 (zenith)
    const factor = Math.min(Math.max(y / 150, 0), 1);

    const vertexColor = bottomColor.clone().lerp(topColor, factor);
    colors.push(vertexColor.r, vertexColor.g, vertexColor.b);
  }

  skyGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );

  skyGroup.add(skyMesh);

  // Scattered clouds around the dome
  const cloudMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
  });

  function addCloudRing(radius, height, angle, wd, ht) {
    const cloudGeo = new THREE.PlaneGeometry(wd, ht);
    const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);

    cloud.position.set(x, height, z);
    cloud.lookAt(0, height, 0); // Face center of ground
    skyGroup.add(cloud);
  }

  // Scatter clouds in a 360-degree circle around the stadium
  const cloudCount = 12;
  for (let i = 0; i < cloudCount; i++) {
    const angle = (i / cloudCount) * Math.PI * 2;
    const distance = 140 + Math.random() * 30;
    const cloudY = 30 + Math.random() * 20;
    addCloudRing(
      distance,
      cloudY,
      angle,
      40 + Math.random() * 20,
      8 + Math.random() * 4,
    );
  }

  skyGroup.position.set(0, -10, 0);

  scene.add(skyGroup);
}
