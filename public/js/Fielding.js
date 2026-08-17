// STAND-IN until fielders
export class Fielding {
  static reactionTime = 0.3;
  static chaseSpeed = 7.5; // "invisible fielder" sprint speed, m/s
  static gatherTime = 0.4;
  static throwSpeed = 28.0; // return throw speed, m/s

  static estimateRetrievalTime(ballX, ballZ) {
    // NAIVE: no fielders yet, so just use raw distance from the bat as
    // a proxy for "how far someone has to go get it and throw it back."
    //
    // TODO when fielders exist, replace this whole body with something like:
    //   const fielder = Fielders.nearestTo(ballX, ballZ);
    //   return fielder.reactionTime
    //        + fielder.timeToReach(ballX, ballZ)
    //        + this.gatherTime
    //        + fielder.throwTimeTo(keeperPosition);

    const distance = Math.sqrt(ballX * ballX + ballZ * ballZ);
    return (
      this.reactionTime +
      distance / this.chaseSpeed +
      this.gatherTime +
      distance / this.throwSpeed
    );
  }
}
