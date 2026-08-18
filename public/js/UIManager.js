export class UIManager {
  static #instance = null;

  #hudRunsElement;
  #hudBallsElement;
  #overlayElement;
  #overlaytextElement;
  #gameOverModal;

  constructor() {
    if (UIManager.#instance) {
      throw new Error("Use UIManager.getInstance()!");
    }

    this.#hudRunsElement = document.getElementById("hud-runs");
    this.#hudBallsElement = document.getElementById("hud-balls");
    this.#overlayElement = document.getElementById("overlay");
    this.#overlaytextElement = document.getElementById("overlay-text");
    this.#gameOverModal = document.getElementById("gameOverModal");
  }

  static get instance() {
    if (!UIManager.#instance) {
      UIManager.#instance = new UIManager();
    }
    return UIManager.#instance;
  }

  updateHUD(runs, balls) {
    this.#hudBallsElement.textContent = balls;
    this.#hudRunsElement.textContent = runs;
  }

  showShotOverlay(runs) {
    return new Promise((resolve) => {
      let message = `${runs} RUNS!`;
      if (runs == 4) {
        message = "4! BOUNDARY!";
      }
      if (runs == 6) {
        message = "6! HUGE SIX!";
      }
      if (runs == 0) {
        message = "DOT BALL!";
      }

      this.#overlaytextElement.textContent = message;
      this.#overlayElement.classList.remove("hidden");

      // hide overlay after 2 seconds, before next ball is bowled
      setTimeout(() => {
        this.#overlayElement.classList.add("hidden");
        resolve(); //delay is done, resolve the promise
      }, 2000);
    });
  }

  showGameOver(runs, balls) {
    document.getElementById("finalScore").textContent = runs;
    document.getElementById("ballsFaced").textContent = balls;
    this.#gameOverModal.classList.remove("hidden");
    this.#gameOverModal.style.display = "flex";
  }

  hideGameOver() {
    this.#gameOverModal.classList.remove("flex");
    this.#gameOverModal.classList.add("hidden");
  }
}
