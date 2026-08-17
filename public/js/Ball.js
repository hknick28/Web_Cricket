import "./scene.js";
import "./bowlers/Bowler.js";
import "./pitch.js";

import { bowlingBackZ } from "./pitch.js";
import { FastBowler } from "./bowlers/FastBowler.js";
import { scene } from "./scene.js";
import { Bat } from "./Bat.js";
import { BallPhysics } from "./BallPhysics.js";

import { battersEndStumps } from "./pitch.js";

export class Ball {
  static #internalKey = "single ball";
  static #instance = new Ball(Ball.#internalKey);

  #mesh;
  #xPos;
  #yPos;
  #zPos;
  #vx;
  #vy;
  #vz;
  #ax;
  #ay;
  #az;
  #bowler;
  #speed;
  #beenHit;
  #ballBoundingBox;

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

  set vy(v) {
    this.#vy = v;
  }

  set vz(v) {
    this.#vz = v;
  }

  set ax(v) {
    this.#ax = v;
  }

  set ay(v) {
    this.#ay = v;
  }

  set az(v) {
    this.#az = v;
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

  get vy() {
    return this.#vy;
  }

  get vz() {
    return this.#vz;
  }

  get ax() {
    return this.#ax;
  }

  get ay() {
    return this.#ay;
  }

  get az() {
    return this.#az;
  }

  // Add these getters inside your Ball class
  get radius() {
    return 0.036;
  }

  get mass() {
    return 0.16;
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
    this.#vy = 0;
    this.#vz = 0;

    this.#ax = 0;
    this.#ay = 0;
    this.#az = 0;

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

      if (this.#checkCollisionWithStumps()) {
        console.log("Ball has hit the stumps!");
        //stop game and display popup message
      }

      if (this.z > -bowlingBackZ * 2) {
        this.reset();
        Bat.instance.reset();
      }
    }
    this.#mesh.position.set(this.#xPos, this.#yPos, this.#zPos);
  }

  #hitUpdate(deltaTime) {
    //reverse the speed
    BallPhysics.update(this, deltaTime);

    if (this.y < 0) {
      this.reset();
      Bat.instance.reset();
    }
  }

  static get instance() {
    return Ball.#instance;
  }

  // Check for collision with stumps, only if ball has not been hit by the bat
  #checkCollisionWithStumps() {
    this.#ballBoundingBox = new THREE.Box3().setFromObject(this.#mesh);
    const stumpsBoundingBox = new THREE.Box3().setFromObject(
      battersEndStumps.group,
    );

    if (!this.#ballBoundingBox.intersectsBox(stumpsBoundingBox)) {
      return false;
    }
    return true; // ball has hit the stumps
  }
}
