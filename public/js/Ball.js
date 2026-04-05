import "./scene.js";
import "./bowlers/Bowler.js";
import "./pitch.js";

import { bowlingBackZ } from "./pitch.js";
import { FastBowler } from "./bowlers/FastBowler.js";
import { scene } from "./scene.js";

export class Ball {
  static #internalKey = "single ball";
  static #instance = new Ball(Ball.#internalKey);

  #mesh;
  #xPos;
  #yPos;
  #zPos;
  #bowler;

  constructor(key) {
    if (key !== Ball.#internalKey) {
      throw new Error("Use Ball.getInstance()!");
    }
    //setup ball
    this.reset();
  }

  // speed (kph)
  static get speed() {
    return 90;
  }

  // get release point
  get releaseZ() {
    return bowlingBackZ + 1.7;
  }

  get releaseX() {
    return 1 / 2;
  }

  get releaseY() {
    return 2.2;
  }
  // convert kph to ms^-1
  static setSpeed() {
    this.speed = Ball.speed / 3.6;
  }

  set xPos(x) {
    this.#xPos = x;
  }
  set yPos(y) {
    this.#yPos = y;
  }
  set zPos(z) {
    this.#zPos = z;
  }

  get x() {
    return this.#xPos;
  }
  get y() {
    return this.#yPos;
  }
  get z() {
    return this.#zPos;
  }

  draw() {
    const geometry = new THREE.SphereGeometry(0.072, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    this.#mesh = new THREE.Mesh(geometry, material);
    this.#mesh.position.set(this.#xPos, this.#yPos, this.#zPos); // 2.2m high (release height)
    scene.add(this.#mesh);
  }

  //reset ball after delivery
  reset() {
    this.#xPos = this.releaseX;
    this.#yPos = this.releaseY;
    this.#zPos = this.releaseZ;
    this.#bowler = FastBowler.instance;
  }

  //
  update(deltaTime) {
    this.#bowler.updateBall(Ball.#instance, deltaTime);
    this.#mesh.position.set(this.#xPos, this.#yPos, this.#zPos);
  }

  static get instance() {
    return Ball.#instance;
  }
}
