import { battingPopping } from "./pitch.js";
import { Timing } from "./Constants.js";

export class Bat {
  static #key = "bat";

  static #instance = new Bat(Bat.#key);

  #canSwing;
  #hitZone;

  #MAX_SPEED = 165;
  #MIN_SPEED = 25;

  constructor(key) {
    if (key != Bat.#key) {
      throw new Error("Use Bat.getInstance()!");
    }
    this.reset();
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

    const rad = this.#hitZone.launchAngle * (Math.PI / 180);

    // 4. Assign vectors (Assuming your bowler drives down negative Z, hit must be positive Z)
    ball.vx = 0;
    ball.vy = totalForwardSpeed * Math.sin(rad); // Scale height purely on how hard the phone is swung
    ball.vz = -totalForwardSpeed * Math.cos(rad); // Sells the distance down the ground
  }
}
