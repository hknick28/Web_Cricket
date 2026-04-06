import "./Bowler.js";
import { Bowler } from "./Bowler.js";
import { battingBackZ } from "../pitch.js";

export class FastBowler extends Bowler {
  static #key = Symbol();
  static #instance = new FastBowler(FastBowler.#key);
  constructor(key) {
    super(key);
    if (key != FastBowler.#key) {
      throw new Error("Use FastBowler.getInstance()!");
    }
    //setup the bowler
  }

  get speed() {
    return 90 / 3.6;
  }
  get line() {
    // middle stump
    return 0;
  }
  get bouncePoint() {
    // good length (4m from batters stumps)
    return battingBackZ - 4;
  }
  updateBall(ball, deltaTime) {
    let prevBallZ = ball.z;

    ball.zPos = prevBallZ + this.speed * deltaTime;
    //ball.xPos = ball.x + this.line;

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
    const t = (ball.z - this.bouncePoint) / (battingBackZ - this.bouncePoint);

    // sin arc
    ball.yPos = this.bounceHeight * Math.sin(Math.PI * t);
  }

  get bounceHeight() {
    return 0.8;
  }

  static get instance() {
    return FastBowler.#instance;
  }
}
