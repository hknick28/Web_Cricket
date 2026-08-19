import { battingPopping } from "./pitch.js";
import { Timing, windowLength } from "./Constants.js";

export class Bat {
  static #key = "bat";

  static #instance = new Bat(Bat.#key);

  #canSwing;
  #hitZone;

  #MAX_SPEED = 100;
  #MIN_SPEED = 25;

  #batMesh;

  constructor(key) {
    if (key != Bat.#key) {
      throw new Error("Use Bat.getInstance()!");
    }
    const geometry = new THREE.BoxGeometry(2.5, 1.8, windowLength + 1);
    const material = new THREE.MeshBasicMaterial({
      visible: true, // Keep invisible (or set wireframe: true while debugging)
      wireframe: true,
    });

    this.#batMesh = new THREE.Mesh(geometry, material);
    this.#batMesh.position.set(0, 0.9, battingPopping - 1.2);

    // Inside Bat constructor / initialization method:
    const dir = new THREE.Vector3(0, 0, -1); // Default pointing down pitch toward bowler
    const origin = new THREE.Vector3(0, 0, 0); // Center of bat mesh
    const length = 2; // Length of arrow in meters
    const hex = 0xffff00; // Bright yellow

    this.arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
    this.#batMesh.add(this.arrowHelper); // Attach to bat mesh so it transforms together

    this.reset();
  }

  get mesh() {
    return this.#batMesh;
  }

  updateRotationData(phoneData) {
    //tilt the collision plane to match the phone angle
    let x = phoneData.beta - 90;
    let y = phoneData.gamma * 0.5;

    const maxTiltDeg = 40; // realistic bat-face open/close range
    x = THREE.MathUtils.clamp(x, -maxTiltDeg, maxTiltDeg);
    y = THREE.MathUtils.clamp(y, -maxTiltDeg, maxTiltDeg);

    //invert angles before applying
    this.#batMesh.rotation.x = THREE.MathUtils.degToRad(x);
    this.#batMesh.rotation.y = THREE.MathUtils.degToRad(-y);
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
    if (!this.#hit(ball)) {
      return;
    }
    // Determine timing zone based on ball's z at contact
    this.#hitZone = Timing.PERFECT.checkBounds(ball.z)
      ? Timing.PERFECT
      : Timing.EARLY.checkBounds(ball.z)
        ? Timing.EARLY
        : Timing.NONE;

    ball.hit = true;

    this.changeVelocity(ball, speed);
  }

  #hit(ball) {
    // 1. Create a 3D bounding box around your wide collision mesh
    const batBox = new THREE.Box3().setFromObject(this.#batMesh);

    const ballBox = new THREE.Box3().setFromObject(ball.mesh);

    // 3. Check for 3D spatial overlap
    const isContact = batBox.intersectsBox(ballBox);

    if (!isContact) {
      console.log("MISSED!");
      return false;
    }

    console.log("HIT!");
    return true;
  }

  reset() {
    this.#hitZone = Timing.NONE;
    this.#canSwing = true;
  }

  changeVelocity(ball, speed) {
    //batface normal
    const normal = new THREE.Vector3(0, 0, 1);

    normal.applyEuler(this.#batMesh.rotation).normalize(); //rotate bat
    console.log(
      "bat rotation.x (deg):",
      THREE.MathUtils.radToDeg(this.#batMesh.rotation.x),
    );
    console.log("bat normal at contact:", normal);
    console.log("incoming ball.vz at contact:", ball.vz);
    //get incoming velocity of ball
    const incomingV = new THREE.Vector3(
      ball.vx || 0,
      (ball.vy || 0) * 0.25,
      ball.vz || ball.speed || 0,
    );

    //refect incoming velocity
    const reflectedV = incomingV.reflect(normal);

    const swingPower = Math.min(speed / this.#MAX_SPEED, 1.0);

    // 2. Calculate the base forward power.
    // We absorb 35% of the incoming bowler's speed, and add the bat's forward muscle.
    const incomingPaceAbsorbed = Math.abs(ball.speed) * 0.35;
    const forwardMuscle = swingPower * 17 * this.#hitZone.timingMultiplier; // Max forward contribution from swing
    const exitMagnitude = incomingPaceAbsorbed + forwardMuscle;

    // Keep the reflected 3D direction, but scale its magnitude by our power
    reflectedV.normalize().multiplyScalar(exitMagnitude);

    // 4. Assign vectors (Assuming your bowler drives down negative Z, hit must be positive Z)
    ball.vx = reflectedV.x;
    ball.vy = reflectedV.y; // Scale height purely on how hard the phone is swung
    ball.vz = reflectedV.z; // Sells the distance down the ground
  }
}
