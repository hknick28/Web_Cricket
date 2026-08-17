import { battingPopping } from "./pitch.js";
import { Timing } from "./Constants.js";

export class Bat {
  static #key = "bat";

  static #instance = new Bat(Bat.#key);
  #bat;

  #xRotation;
  #yRotation;
  #zRotation;

  #canSwing;
  #hitZone;

  #MAX_SPEED = 165;
  #MIN_SPEED = 25;

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

  checkSwing(ball, speed) {
    console.log("Bat speed: " + speed);

    if (!this.#canSwing) {
      console.log("Cannot swing again!");
      return;
    }
    this.#canSwing = false;
    if (!this.#hit(ball.z, speed)) {
      return;
    }
    //ball.speed = ball.speed;
    ball.hit = true;

    this.changeVelocity(ball, speed);
  }
  #hit(ballZ, speed) {
    let tollerence = 1;
    if (speed < 55) {
      tollerence = 1.8;
    } else {
      tollerence = 1.2;
    }

    const hitZone = Object.values(Timing).find((zone) =>
      zone.checkBounds(ballZ, tollerence),
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
    this.#canSwing = true;
  }

  changeVelocity(ball, speed) {
    const swingPower = Math.min(speed / this.#MAX_SPEED, 1.0);

    // 2. Calculate the base forward power.
    // We absorb 35% of the incoming bowler's speed, and add the bat's forward muscle.
    const incomingPaceAbsorbed = Math.abs(ball.speed) * 0.35;
    const forwardMuscle = swingPower * 17; // Max forward contribution from swing

    // Total forward velocity magnitude
    const totalForwardSpeed =
      (incomingPaceAbsorbed + forwardMuscle) * this.#hitZone.timingMultiplier;

    // 3. THE LIFT FIX: Make vy directly proportional to swing power *and* forward speed!
    // Instead of a flat hardcoded cap, we base lift on how hard they swung relative to the forward punch.
    // An aggressive lift multiplier (e.g., 0.6) means vy will scale beautifully.

    const rad = this.#hitZone.launchAngle * (Math.PI / 180);

    // 4. Assign vectors (Assuming your bowler drives down negative Z, hit must be positive Z)
    ball.vx = 0;
    ball.vy = totalForwardSpeed * Math.sin(rad); // Scale height purely on how hard the phone is swung
    ball.vz = -totalForwardSpeed * Math.cos(rad); // Sells the distance down the ground
  }
}
