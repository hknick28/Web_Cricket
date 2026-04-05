// main.js
import { animate } from "./scene.js"; // runs the file AND gives you animateimport "./stump.js"; // defines Stump class
import { Ball } from "./Ball.js"; // defines Ball class
import "./scene.js";

//socket stuff
const socket = io();

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
//check phone orientation and update cube pos in camera
/* socket.on("orientation", (data) => {
        latestGamma = data.gamma;
        latestBeta = data.beta;
        mesh.position.x = Math.max(
          -3,
          Math.min(3, (data.gamma - gammaOffset) / 10),
        );
        mesh.position.y = Math.max(
          -3,
          Math.min(3, -(data.beta - betaOffset) / 10),
        ); // up/dow (phone tilt)
      });*/

Ball.instance; // create ball
animate(); // start loop
