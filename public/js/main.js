// main.js
import { animate } from "./scene.js"; // runs the file AND gives you animateimport "./stump.js"; // defines Stump class
import { Ball } from "./Ball.js"; // defines Ball class
import { Bat } from "./Bat.js";
import "./scene.js";

//socket stuff
const socket = io();

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
Ball.instance; // create ball
animate(); // start loop

// update bat
/*socket.on("orientation", (data) => {
  latestGamma = data.gamma;
  latestBeta = data.beta;
  phoneRotationData.gamma = data.gamma; // y
  phoneRotationData.beta = data.beta; // x

  Bat.instance.setAngles(
    phoneRotationData.beta,
    phoneRotationData.alpha 0,
    phoneRotationData.gamma 0,
  );
});*/

socket.on("swing", (data) => {
  let acceleration = data;
  Bat.instance.checkSwing(Ball.instance);
});
