const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.z = 5;

//create a cube
const box = new THREE.BoxGeometry(1, 1, 1);
const surface = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(box, surface);

scene.add(mesh);
//Loop
function animate() {
  requestAnimationFrame(animate);
  //render cube
  renderer.render(scene, camera);
}
animate();
