export class RunCalculator {
  static pitchLength = 20.12; // crease to crease, meters
  static sprintSpeed = 7.0; // batsmen running speed, m/s
  static turnPenalty = 0.7; // added per run after the first (turning at the crease)

  static runningTime(n) {
    const base = this.pitchLength / this.sprintSpeed;
    return n * base + Math.max(0, n - 1) * this.turnPenalty;
  }

  // Given how long the fielding side took to get the ball back, how many runs fit?
  static runsFor(retrievalTime) {
    for (let n = 3; n >= 1; n--) {
      if (retrievalTime >= this.runningTime(n)) return n;
    }
    return 0;
  }
}
