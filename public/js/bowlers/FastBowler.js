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
    ball.zPos = ball.z + this.speed * deltaTime;
    //ball.xPos = ball.x + this.line;

    // fall linearly from release height to 0
    /*ball.yPos =
      (ball.releaseY * (this.bouncePoint - ball.z)) /
      (this.BouncePoint - ball.release);*/
  }

  static get instance() {
    return FastBowler.#instance;
  }
}
