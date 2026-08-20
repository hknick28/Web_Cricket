// main.js
import { animate } from "./scene.js"; // runs the file AND gives you animateimport "./stump.js"; // defines Stump class
import { Ball } from "./Ball.js"; // defines Ball class
import { Bat } from "./Bat.js";
import { currentGameState, game_state, setGameState } from "./appState.js";
import "./scene.js";
import { Player } from "./Player.js";
import {
  proccessDataSample,
  buildShotClusters,
  classifyShotNearestCluster,
} from "./calibrationManager.js";

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
document.getElementById("calibrateBtn")?.addEventListener("click", () => {});

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
  alpha: 0,
  gammaOffset: 0,
  betaOffset: 0,
  alphaOffset: 0,
};

let gammaOffset = 0;
let betaOffset = 0;
let latestGamma = 0;
let latestBeta = 0;
let alphaOffset = 0;
let latestAlpha = 0;

function calibrate() {
  gammaOffset = latestGamma;
  betaOffset = latestBeta;
  alphaOffset = latestAlpha;
}
socket.on("calibrate", () => {
  calibrate();
});

socket.on("orientation", (data) => {
  const { alpha, beta, gamma } = data;

  // Store offsets for main rotation display
  latestAlpha = alpha;

  latestGamma = gamma;
  latestBeta = beta;

  phoneRotationData.alpha = alpha - alphaOffset;
  phoneRotationData.beta = beta - betaOffset;
  phoneRotationData.gamma = gamma - gammaOffset;
});

// start loop here, after everything is loaded
let swingEventCount = 0;

// Swing for game
socket.on("swing", (data) => {
  swingEventCount++;
  console.log(`🏏 Swing Event #${swingEventCount}:`, data);
  console.log(
    "impactOrientation → alpha:",
    data.impactOrientation?.alpha,
    "beta:",
    data.impactOrientation?.beta,
    "gamma:",
    data.impactOrientation?.gamma,
  );

  // Ignore swings if not in active gameplay mode
  if (currentGameState !== game_state.PLAYING) {
    return;
  }

  const { batAcceleration, impactOrientation } = data;

  // Optional: Update the 3D Bat instance's rotation to match the exact impact snapshot
  // before checking collision physics
  if (impactOrientation) {
    Bat.instance.updateRotationData(impactOrientation);
  }

  // Trigger physics collision check using peak acceleration & 3D bat face normal
  Bat.instance.checkSwing(Ball.instance, batAcceleration);
});

function resetGame() {
  Ball.instance.reset();
  Bat.instance.reset();
  Player.instance.reset();
}

let activeClusters = null;

async function loadCalibrationProfiles() {
  try {
    const response = await fetch("/calibration_profiles.json");
    if (!response.ok) throw new Error("No calibration file found");

    const rawProfiles = await response.json();
    activeClusters = buildShotClusters(rawProfiles);
    console.log("🎯 Calibration clusters loaded:", activeClusters);
  } catch (err) {
    console.warn(
      "⚠️ Calibration file not loaded or missing. Run calibration first.",
      err,
    );
  }
}

loadCalibrationProfiles();
