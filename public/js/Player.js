export class Player {
  static #internalKey = "single ball";
  static #instance = new Player(Player.#internalKey);

  #score;
  #ballsFaced;

  constructor(key) {
    if (Player.#internalKey !== key) {
      throw new Error("Use Player.getInstance()!");
    }
    this.reset();
  }

  static get instance() {
    return Player.#instance;
  }

  reset() {
    this.#score = 0;
    this.#ballsFaced = 0;
  }

  //getters
  get score() {
    return this.#score;
  }

  get ballsFaced() {
    return this.#ballsFaced;
  }

  addSix() {
    this.#score += 6;
  }
  addFour() {
    this.#score += 4;
  }
  addRuns(runs) {
    this.#score += runs;
  }

  updateBallsFaced() {
    this.#ballsFaced += 1;
    console.log(`Balls faced: ${this.#ballsFaced}`);
    console.log(`Current score: ${this.#score}`);
  }
}
