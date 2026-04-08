import { battingPopping } from "./pitch.js";
import { Timing } from "./Constants.js";

export class Bat {
  static #key = "bat";

  static #instance = new Bat(Bat.#key);
  #bat;

  #xRotation;
  #yRotation;
  #zRotation;

  #hitZone;

  constructor(key) {
    if (key != Bat.#key) {
      throw new Error("Use Bat.getInstance()!");
    }
    this.setAngles(0, 0, 0);
    this.reset();
  }

  createBat() {
    // Bat made from multiple shapes
    this.#bat = new THREE.Group();

    //Blade
    this.#createBlade(this.#bat);
    //Handle
    this.#createHandel(this.#bat);

    this.#bat.position.set(0, 1, battingPopping); // Place at the batter's end
    return this.#bat;
  }

  #createBlade(bat) {
    const bladeGeo = new THREE.BoxGeometry(0.12, 0.9, 0.05);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const mesh = new THREE.Mesh(bladeGeo, material);
    mesh.position.y = -0.45; // Shift up

    bat.add(mesh);
  }

  #createHandel(bat) {
    const handelGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.4);
    const material = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const mesh = new THREE.Mesh(handelGeo, material);
    mesh.position.y = 0.1; // ontop of blade

    bat.add(mesh);
  }

  setAngles(x, y, z) {
    let xOffset = Math.PI / 2;
    let toRad = Math.PI / 180;
    this.#xRotation = x * toRad + xOffset;
    this.#yRotation = y * toRad;
    this.#zRotation = z * toRad;
    if (this.#bat == null) {
      return;
    }
  }

  update() {
    this.#bat.rotation.set(this.#xRotation, this.#yRotation, this.#zRotation);
  }

  static get instance() {
    return this.#instance;
  }

  checkSwing(ball) {
    if (!this.#hit(ball.z)) {
      return;
    }
    ball.speed = -ball.speed;
    ball.hit = true;
  }
  #hit(ballZ) {
    // 1. Get the names of your zones
    // 2. Find the zone where the checkBounds returns true
    const hitZone = Object.values(Timing).find((zone) =>
      zone.checkBounds(ballZ),
    );

    console.log("Before Hit: " + this.#hitZone.label);
    if (hitZone == null) {
      console.log("MISSED!");
      return false;
    }
    this.#hitZone = hitZone;

    console.log("HIT!: " + this.#hitZone.label);
    return true;
  }

  reset() {
    this.#hitZone = Timing.NONE;
  }
}
