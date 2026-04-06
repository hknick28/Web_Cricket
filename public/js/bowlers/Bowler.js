//Baseclass (interface)
export class Bowler {
  constructor(key) {}

  getSpeed() {
    throw new Error("Not implemented");
  }
  getLine() {
    throw new Error("Not implemented");
  }
  getBouncePoint() {
    throw new Error("Not implemented");
  }
  updateBall(ball, deltaTime) {
    throw new Error("Not implemented");
  }

  setBallFallingPos(ball, deltaTime, z) {
    throw new Error("Not implemented");
  }
  setBallRisingPos(ball, deltaTime, z) {
    throw new Error("Not implemented");
  }

  static get gravityConst() {
    return -9.81;
  }

  static getInstance() {
    throw new Error("Not implemented");
  }

  get bounceHeight() {
    throw new Error("Not implemented");
  }
  setupBowler(ball) {
    throw new Error("Not implemented");
  }
}
