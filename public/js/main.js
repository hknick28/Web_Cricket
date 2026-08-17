// main.js
import { animate } from "./scene.js"; // runs the file AND gives you animateimport "./stump.js"; // defines Stump class
import { Ball } from "./Ball.js"; // defines Ball class
import { Bat } from "./Bat.js";
import { currentGameState, game_state, setGameState } from "./appState.js";
import "./scene.js";
//import { startNewCapture, proccessDataSample } from "./capture.js";

//socket stuff
const socket = io();

// Handle menu buttons
document.getElementById("startBtn")?.addEventListener("click", () => {
  setGameState(game_state.PLAYING);
  console.log("Game state set to PLAYING");
  document.getElementById("menuContainer").style.display = "none";
  Ball.instance.draw(); // create ball
  animate();
});

// handle calibration button
document.getElementById("calibrateBtn")?.addEventListener("click", () => {
  setGameState(game_state.CALIBRATING);
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

// start loop here, after everything is loaded
//Ball.instance; // create ball
//animate(); // start loop

// Log orientation data
socket.on("orientation", (data) => {
  proccessDataSample(data.alpha, data.beta, data.gamma);
});

// Swing for game
socket.on("swing", (data) => {
  if (currentGameState === game_state.PLAYING) {
    let acceleration = data.batAcceleration;
    Bat.instance.checkSwing(Ball.instance, acceleration);
  } else if (currentGameState === game_state.CALIBRATING) {
    startNewCapture();
  }
});
