import { battingPopping } from "./pitch.js";

export class Bat {
  static #key = "bat";

  static #instance = new Bat(Bat.#key);
  #bat;

  constructor(key) {
    if (key != Bat.#key) {
      throw new Error("Use Bat.getInstance()!");
    }
  }

  createBat() {
    // Bat made from multiple shapes
    this.#bat = new THREE.Group();

    //Blade
    this.#createBlade(this.#bat);
    //Handle
    this.#createHandel(this.#bat);

    this.#bat.position.set(0, 0, battingPopping); // Place at the batter's end
    return this.#bat;
  }

  #createBlade(bat) {
    const bladeGeo = new THREE.BoxGeometry(0.12, 0.9, 0.05);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const mesh = new THREE.Mesh(bladeGeo, material);
    mesh.position.y = 0.45; // Shift up

    bat.add(mesh);
  }

  #createHandel(bat) {
    const handelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    const material = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const mesh = new THREE.Mesh(handelGeo, material);
    mesh.position.y = 1.1; // ontop of blade

    bat.add(mesh);
  }

  static get instance() {
    return this.#instance;
  }
}
