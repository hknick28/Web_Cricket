import { setGameState, game_state } from "./appState.js";
import { saveCalibrationToFile } from "./saveCalibration.js";
import { socket } from "./main.js";

let isCollecting = false;

let alphaBuffer = []; // buffer to hold last 100 samples
let betaBuffer = []; // buffer to hold last 100 samples
let gammaBuffer = []; // buffer to hold last 100 samples

const SHOT_TYPES = [
  "Cover Drive",
  "Pull Shot",
  "Straight Drive",
  "Cut Shot",
  "Defensive Shot",
];
let currentShotIndex = 0; // Tracks which shot type we are calibrating
let sampleCount = 0; // Tracks how many swings (0-5) we have for this shot

// The master profile storage matrix
let calibrationProfiles = {
  "Cover Drive": [],
  "Pull Shot": [],
  "Straight Drive": [],
  "Cut Shot": [],
  "Defensive Shot": [],
};

function isCollectingData() {
  return isCollecting;
}

function setCollectingData(value) {
  isCollecting = value;
}

export function proccessDataSample(alpha, beta, gamma) {
  // Ignore continuous orientation stream unless a swing event just armed collection
  if (!isCollectingData()) return;

  let activeShotName = SHOT_TYPES[currentShotIndex];

  alphaBuffer.push(alpha);
  betaBuffer.push(beta);
  gammaBuffer.push(gamma);

  // Once 50 orientation frames are captured for THIS swing:
  if (betaBuffer.length === 50) {
    setCollectingData(false); // STOP collecting until the NEXT physical swing
    sampleCount++;

    // Find peak angular velocity snapshot
    let velocities = [];
    for (let i = 1; i < betaBuffer.length; i++) {
      velocities.push(Math.abs(betaBuffer[i] - betaBuffer[i - 1]));
    }
    let peakIndex = velocities.indexOf(Math.max(...velocities)) + 1;

    // Store orientation at frame 0 (start of swing)
    let alpha0 = alphaBuffer[0];
    let beta0 = betaBuffer[0];
    let gamma0 = gammaBuffer[0];

    // Store orientation snapshot at peak impact frame
    let sampleProfile = {
      pitchDelta: betaBuffer[peakIndex] - beta0, // Relative tilt change during swing
      rollDelta: gammaBuffer[peakIndex] - gamma0, // Relative wrist twist during swing
      yawDelta: alphaBuffer[peakIndex] - alpha0, // Relative horizontal rotation during swing
      peakSpeed: Math.max(...velocities),
    };

    calibrationProfiles[activeShotName].push(sampleProfile);
    clearBuffers();

    // Progress shot index or complete calibration
    checkShots(socket);

    // Update HUD display
    updateCalibrationHUD();
  }
}

function checkShots(socket) {
  if (sampleCount >= 5) {
    currentShotIndex++;
    sampleCount = 0;
  }

  if (currentShotIndex >= SHOT_TYPES.length) {
    currentShotIndex = 0;
    setCollectingData(false);
    setGameState(game_state.MENU);

    // Save profile JSON automatically
    saveCalibrationToFile(calibrationProfiles, socket);

    // Show menu UI again
    const menu = document.getElementById("menuContainer");
    if (menu) menu.style.display = "flex";
  }
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

export function updateCalibrationHUD() {
  const hudElement = document.getElementById("hudStatus");
  if (!hudElement) return;

  const activeShotName = SHOT_TYPES[currentShotIndex];
  hudElement.innerText = `Calibrating: ${activeShotName} (Swing ${sampleCount + 1} / 5)`;
}

// Function to compute average feature vector per shot cluster
export function buildShotClusters(rawProfiles) {
  const clusters = {};

  Object.keys(rawProfiles).forEach((shotName) => {
    const samples = rawProfiles[shotName];
    if (!samples || samples.length === 0) return;

    // Sum up features across all 5 calibration swings
    const totals = samples.reduce(
      (acc, s) => {
        acc.pitch += s.pitch;
        acc.roll += s.roll;
        acc.yaw += s.yaw;
        acc.speed += s.peakSpeed;
        return acc;
      },
      { pitch: 0, roll: 0, yaw: 0, speed: 0 },
    );

    const count = samples.length;

    // Store cluster centroid
    clusters[shotName] = {
      centerPitch: totals.pitch / count,
      centerRoll: totals.roll / count,
      centerYaw: totals.yaw / count,
      avgSpeed: totals.speed / count,
    };
  });

  return clusters; // Save or pass directly to live game engine
}

/**
 * Compares live swing snapshot to pre-calculated shot cluster centers
 */
export function classifyShotNearestCluster(liveSample, shotClusters) {
  let closestShot = null;
  let minDistance = Infinity;

  Object.keys(shotClusters).forEach((shotName) => {
    const cluster = shotClusters[shotName];

    // Euclidean distance in 3D orientation space
    const dPitch = liveSample.pitch - cluster.centerPitch;
    const dRoll = liveSample.roll - cluster.centerRoll;
    const dYaw = liveSample.yaw - cluster.centerYaw;

    const distance = Math.sqrt(dPitch * dPitch + dRoll * dRoll + dYaw * dYaw);

    if (distance < minDistance) {
      minDistance = distance;
      closestShot = shotName;
    }
  });

  return { matchedShot: closestShot, distanceError: minDistance };
}
