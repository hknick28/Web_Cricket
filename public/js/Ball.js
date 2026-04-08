import "./scene.js";
import "./bowlers/Bowler.js";
import "./pitch.js";

import { bowlingBackZ } from "./pitch.js";
import { FastBowler } from "./bowlers/FastBowler.js";
import { scene } from "./scene.js";
import { Bat } from "./Bat.js";

export class Ball {
  static #internalKey = "single ball";
  static #instance = new Ball(Ball.#internalKey);

  #mesh;
  #xPos;
  #yPos;
  #zPos;
  #vx;
  #bowler;
  #speed;
  #beenHit;

  constructor(key) {
    if (key !== Ball.#internalKey) {
      throw new Error("Use Ball.getInstance()!");
    }
    //setup ball
    this.reset();
  }

  // speed (kph)
  get speed() {
    return this.#speed;
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
  set speed(speed) {
    this.#speed = speed / 3.6;
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

  set vx(v) {
    this.#vx = v;
  }

  set hit(hit) {
    this.#beenHit = hit;
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

  get vx() {
    return this.#vx;
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
    this.#vx = 0;
    this.#beenHit = false;
    this.#bowler = FastBowler.instance;
    this.#bowler.setupBowler(this);
    this.speed = this.#bowler.speed;
  }

  //Move ball each frame
  update(deltaTime) {
    if (this.#beenHit) {
      this.#hitUpdate(deltaTime);
    } else {
      this.#bowler.updateBall(this, deltaTime);
      if (this.z > -bowlingBackZ * 2) {
        this.reset();
        Bat.instance.reset();
      }
    }
    this.#mesh.position.set(this.#xPos, this.#yPos, this.#zPos);
  }

  #hitUpdate(deltaTime) {
    //reverse the speed
    let prevBallZ = this.z;
    //Basic hit simulation
    this.zPos = prevBallZ + this.speed * deltaTime;

    if (this.z < bowlingBackZ - 10) {
      this.reset();
      Bat.instance.reset();
    }
  }

  static get instance() {
    return Ball.#instance;
  }
}
