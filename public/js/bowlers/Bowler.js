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

  static getInstance() {
    throw new Error("Not implemented");
  }
}
