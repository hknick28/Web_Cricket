import { setGameState, game_state } from "./appState.js";
import { saveCalibrationToFile } from "./saveCalibration.js";

let isCollecting = false;

let alphaBuffer = []; // buffer to hold last 100 samples
let betaBuffer = []; // buffer to hold last 100 samples
let gammaBuffer = []; // buffer to hold last 100 samples

const SHOT_TYPES = ["Cover Drive", "Pull Shot", "Straight Drive"];
let currentShotIndex = 0; // Tracks which shot type we are calibrating
let sampleCount = 0; // Tracks how many swings (0-5) we have for this shot

// The master profile storage matrix
let calibrationProfiles = {
  "Cover Drive": [],
  "Pull Shot": [],
  "Straight Drive": [],
};

function isCollectingData() {
  return isCollecting;
}

function setCollectingData(value) {
  isCollecting = value;
}

export function proccessDataSample(alpha, beta, gamma) {
  if (!isCollectingData()) {
    return;
  }

  let activeShotName = SHOT_TYPES[currentShotIndex];

  alphaBuffer.push(alpha);
  betaBuffer.push(beta);
  gammaBuffer.push(gamma);

  // if we have 50 samples, save data, stop collecting
  if (
    alphaBuffer.length === 50 &&
    betaBuffer.length === 50 &&
    gammaBuffer.length === 50
  ) {
    setCollectingData(false);
    sampleCount++;
    let alphaRange = Math.max(...alphaBuffer) - Math.min(...alphaBuffer);
    let betaRange = Math.max(...betaBuffer) - Math.min(...betaBuffer);
    let gammaRange = Math.max(...gammaBuffer) - Math.min(...gammaBuffer);

    let sampleProfile = {
      alphaRange,
      betaRange,
      gammaRange,
    };

    calibrationProfiles[activeShotName].push(sampleProfile);
    clearBuffers();
  }

  // change shot type after every 5 swings
  checkShots();
}

function clearBuffers() {
  alphaBuffer = [];
  betaBuffer = [];
  gammaBuffer = [];
}

export function startNewCapture() {
  clearBuffers();
  setCollectingData(true);
}

function checkShots() {
  // change shot type after every 5 swing
  if (sampleCount === 5) {
    currentShotIndex++;
    sampleCount = 0;
  }

  if (currentShotIndex >= SHOT_TYPES.length) {
    currentShotIndex = 0;
    setGameState(game_state.MENU);
    // save the data
    saveCalibrationToFile(calibrationProfiles);
  }
}
