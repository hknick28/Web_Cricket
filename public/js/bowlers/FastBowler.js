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
    return 90 / 3.6;
  }
  get line() {
    return this.#line;
  }

  #setLine() {
    let line = getRandomKey(Line);
    this.#line = Line[line].getLine();
  }

  #setLength() {
    let length = getRandomKey(Length);
    this.#length = Length[length].getZ();
  }
  setupBowler() {
    //line
    this.#setLine();
    //length
    this.#setLength();
  }

  get bouncePoint() {
    // good length (4m from batters stumps)
    return battingBackZ - this.#length;
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
    ball.yPos = -(
      (ball.releaseY * (this.bouncePoint - ball.z)) /
      (this.bouncePoint - ball.releaseZ)
    );
  }

  get bounceHeight() {
    return 1;
  }

  static get instance() {
    return FastBowler.#instance;
  }
}
