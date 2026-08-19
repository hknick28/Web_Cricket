// main.js
import { animate } from "./scene.js"; // runs the file AND gives you animateimport "./stump.js"; // defines Stump class
import { Ball } from "./Ball.js"; // defines Ball class
import { Bat } from "./Bat.js";
import { currentGameState, game_state, setGameState } from "./appState.js";
import "./scene.js";
import { Player } from "./Player.js";
import { startNewCapture, proccessDataSample } from "./calibrationManager.js";

//socket stuff
export const socket = io();

// Handle menu buttons
document.getElementById("startBtn")?.addEventListener("click", () => {
  setGameState(game_state.PLAYING);
  console.log("Game state set to PLAYING");
  document.getElementById("menuContainer").style.display = "none";
  document.getElementById("hudStatus").style.display = "none";
  document.getElementById("hudContainer").style.display = "flex";
  Ball.instance.draw(); // create ball
  animate();
});

// handle calibration button
document.getElementById("calibrateBtn")?.addEventListener("click", () => {
  setGameState(game_state.CALIBRATING);
  document.getElementById("menuContainer").style.display = "none";
  document.getElementById("hudContainer").style.display = "none";

  // 2. Display calibration HUD message (optional but helpful)
  const hudElement = document.getElementById("hudStatus");
  if (hudElement) {
    hudElement.innerText = "Calibrating Shot 1/5: Perform 5 Cover Drives";
  }
});

// handle game over button
document.getElementById("restartBtn")?.addEventListener("click", () => {
  console.log("Game restarted");
  resetGame();
  setGameState(game_state.PLAYING);
  document.getElementById("gameOverModal").style.display = "none";
});

// handle exit button
document.getElementById("exitBtn")?.addEventListener("click", () => {
  console.log("Game exited");
  resetGame();
  setGameState(game_state.MENU);
  document.getElementById("gameOverModal").style.display = "none";
  document.getElementById("menuContainer").style.display = "flex";
});

export const phoneRotationData = {
  beta: 0,
  gamma: 0,
  gammaOffset: 0,
  betaOffset: 0,
};

let gammaOffset = 0;
let betaOffset = 0;
let latestGamma = 0;
let latestBeta = 0;

function calibrate() {
  gammaOffset = latestGamma;
  betaOffset = latestBeta;
}
socket.on("calibrate", () => {
  calibrate();
});

socket.on("orientation", (data) => {
  const { alpha, beta, gamma } = data;

  // Store offsets for main rotation display
  latestGamma = gamma;
  latestBeta = beta;
  phoneRotationData.beta = beta - betaOffset;
  phoneRotationData.gamma = gamma - gammaOffset;

  // IF WE ARE IN CALIBRATING STATE: Feed orientation directly into calibration manager
  if (currentGameState === game_state.CALIBRATING) {
    console.log("Swing detected for calibration");
    proccessDataSample(alpha, beta, gamma);
  }
});

// start loop here, after everything is loaded

// Swing for game
socket.on("swing", (data) => {
  const { alpha, beta, gamma } = data;

  // Store offsets for main rotation display
  latestGamma = gamma;
  latestBeta = beta;
  phoneRotationData.beta = beta - betaOffset;
  phoneRotationData.gamma = gamma - gammaOffset;

  // IF WE ARE IN CALIBRATING STATE: Feed orientation directly into calibration manager
  if (currentGameState === game_state.CALIBRATING) {
    console.log("Swing detected for calibration");
    startNewCapture();
  }

  if (currentGameState === game_state.PLAYING) {
    let acceleration = data.batAcceleration;
    Bat.instance.checkSwing(Ball.instance, acceleration);
  }
});

function resetGame() {
  Ball.instance.reset();
  Bat.instance.reset();
  Player.instance.reset();
}
