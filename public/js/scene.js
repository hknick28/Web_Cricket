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
camera.position.set(0, 2, battingPopping + 2);
camera.lookAt(0, 0, 0);

initPitch();
createSky(scene);
createStands(scene);

Ball.instance.draw();
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const floodLight = new THREE.DirectionalLight(0xffffff, 1.2);
floodLight.position.set(0, 20, 5);
scene.add(floodLight);

const clock = new THREE.Clock();
scene.add(Bat.instance.mesh);

//Loop
export function animate() {
  requestAnimationFrame(animate);

  //always drain
  const deltaTime = clock.getDelta(); // seconds since last frame

  if (getCurrentGameState() != game_state.PLAYING) {
    return;
  }

  Ball.instance.update(deltaTime); // update ball positon

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

function createStands(scene) {
  const standGroup = new THREE.Group();

  const stadiumRadius = 55;
  const segments = 32;

  // Render DoubleSide so we can see the inside of the stadium rings
  const concreteMat = new THREE.MeshBasicMaterial({
    color: 0x718096,
    side: THREE.DoubleSide,
  });
  const blueSeatsMat = new THREE.MeshBasicMaterial({
    color: 0x1d3557,
    side: THREE.DoubleSide,
  });
  const greenSeatsMat = new THREE.MeshBasicMaterial({
    color: 0x2a9d8f,
    side: THREE.DoubleSide,
  });
  const roofMat = new THREE.MeshBasicMaterial({
    color: 0xe2e8f0,
    side: THREE.DoubleSide,
  });
  const screenMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  // Helper to build solid curved rings
  function createRingTier(material, innerR, outerR, height, yPos) {
    const geo = new THREE.CylinderGeometry(
      outerR, // top radius
      innerR, // bottom radius (slightly smaller creates a stepped/sloped seating angle)
      height,
      segments,
      1,
      true, // open top/bottom
    );

    const mesh = new THREE.Mesh(geo, material);
    mesh.position.y = yPos;
    standGroup.add(mesh);
    return mesh;
  }

  // 1. Boundary Wall / Concrete Base (lowered right at ground level)
  createRingTier(concreteMat, stadiumRadius, stadiumRadius + 1, 2, 1);

  // 2. Lower Seating Tier (Blue) - sloping upward from ground level
  createRingTier(blueSeatsMat, stadiumRadius + 1, stadiumRadius + 6, 4, 3);

  // 3. Middle Concrete Walkway
  createRingTier(concreteMat, stadiumRadius + 6, stadiumRadius + 7, 2, 5);

  // 4. Upper Seating Tier (Green)
  createRingTier(greenSeatsMat, stadiumRadius + 7, stadiumRadius + 14, 6, 8);

  // 5. Roof Overhang
  createRingTier(roofMat, stadiumRadius + 14, stadiumRadius + 10, 1.5, 11.5);

  // 6. Sight Screen / Scoreboard behind bowler
  const sightScreenGeo = new THREE.PlaneGeometry(10, 5);
  const sightScreen = new THREE.Mesh(sightScreenGeo, screenMat);
  // Positioned right at boundary wall level behind bowler
  sightScreen.position.set(0, 2.5, -stadiumRadius + 1);
  standGroup.add(sightScreen);

  scene.add(standGroup);
}
