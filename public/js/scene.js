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
camera.position.set(0, 5, 16);
camera.lookAt(0, 0, 0);
//Loop
function animate() {
  requestAnimationFrame(animate);
  //render cube
  renderer.render(scene, camera);
}
animate();
