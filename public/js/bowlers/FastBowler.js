import "./Bowler.js";
import { Bowler } from "./Bowler.js";
import { battingBackZ } from "../pitch.js";
import { getRandomKey } from "../Constants.js";
import { Line } from "../Constants.js";
import { Length } from "../Constants.js";

export class FastBowler extends Bowler {
  static #key = Symbol();
  static #instance = new FastBowler(FastBowler.#key);

  #line;
  #length;

  constructor(key) {
    super(key);
    if (key != FastBowler.#key) {
      throw new Error("Use FastBowler.getInstance()!");
    }
    //setup the bowler
  }

  get speed() {
    return 90;
  }
  get line() {
    return this.#line;
  }

  get length() {
    return this.#length;
  }

  #setLine() {
    let line = getRandomKey(Line);
    this.#line = Line[line].getLine();
  }

  #setLength() {
    let length = getRandomKey(Length);
    this.#length = Length[length].getZ();
  }
  setupBowler(ball) {
    //line
    this.#setLine();
    //length
    this.#setLength();

    //Balls horizontal velocity (too acheive the line)
    //v = d/t

    const distZ = Math.abs(this.length - ball.releaseZ);
    const timeToTarget = distZ / ball.speed; //time

    const distX = this.line - ball.releaseX; //distance

    ball.vx = distX / timeToTarget;
  }

  get bouncePoint() {
    return battingBackZ - this.length;
  }
  updateBall(ball, deltaTime) {
    let prevBallZ = ball.z;

    ball.zPos = prevBallZ + ball.speed * deltaTime;

    ball.xPos = ball.x + ball.vx * deltaTime;

    if (ball.z < this.bouncePoint) {
      this.setBallFallingPos(ball, deltaTime, prevBallZ - ball.z);
    } else {
      this.setBallRisingPos(ball, deltaTime, prevBallZ - ball.z);
    }
  }

  setBallFallingPos(ball, deltaTime, z) {
    //return negative vector
    ball.yPos =
      (ball.releaseY * (this.bouncePoint - ball.z)) /
      (this.bouncePoint - ball.releaseZ);
  }
  setBallRisingPos(ball, deltaTime, z) {
    ball.yPos =
      -(
        (ball.releaseY * (this.bouncePoint - ball.z)) /
        (this.bouncePoint - ball.releaseZ)
      ) * this.bounceHeight;
  }

  get bounceHeight() {
    return 0.8;
  }

  static get instance() {
    return FastBowler.#instance;
  }
}
