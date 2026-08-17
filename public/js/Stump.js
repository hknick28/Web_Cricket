import "./scene.js";
import { scene } from "./scene.js";
export class Stump {
  zPos; // pos on pitch
  #bounds; // bounding box for collision detection
  #group; // group of 3 stumps
  constructor(z) {
    this.zPos = z;
    this.#group = new THREE.Group();
  }

  // height of the stump
  static get height() {
    return 0.71;
  }

  // spacing between middle and leg/off stumps
  static get xOffset() {
    return 0.15;
  }

  // radius of a stump
  static get radius() {
    return 0.03;
  }

  // draw 3 stumps
  drawStumps() {
    this.draw(Stump.xOffset);
    this.draw(0);
    this.draw(-Stump.xOffset);

    this.#bounds = new THREE.Box3().setFromObject(this.#group);
    scene.add(this.#group);
  }

  // helper method
  draw(x) {
    const geometry = new THREE.CylinderGeometry(
      Stump.radius,
      Stump.radius,
      Stump.height,
      16,
    );
    const material = new THREE.MeshLambertMaterial({ color: 0xf5f0e0 }); // white/cream
    const stump = new THREE.Mesh(geometry, material);

    stump.position.set(x, Stump.height / 2, this.zPos);

    this.#group.add(stump);
  }

  get bounds() {
    return this.#bounds;
  }

  get group() {
    return this.#group;
  }
}
