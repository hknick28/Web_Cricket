import { Ball } from "./Ball.js";

export class BallPhysics {
  static gravity = 9.81; // m/s^2
  static air_desity = 1.225; // kg/m^3
  static drag_coeff = 0.33; //typical for a ball of any size
  static damping = 0.4; //damping factor for energy loss when bouncing
  static friction = 0.8; //energy loss when bouncing on the ground

  static update(ball, dt) {
    const vx = ball.vx;
    const vy = ball.vy;
    const vz = ball.vz;
    const area = ball.radius * ball.radius * Math.PI;
    const mass = ball.mass;
    //msgnitude of velocity
    const v = Math.sqrt(vx * vx + vy * vy + vz * vz);

    if (v == 0) {
      return;
    }

    const drag = 0.5 * this.air_desity * v * v * this.drag_coeff * area;

    //accelerstions a = f/m
    const ax = -(vx / v) * (drag / mass); //
    const ay = -(vy / v) * (drag / mass) - this.gravity;
    const az = -(vz / v) * (drag / mass);

    //console.log("ax: " + ax + "ay: " + ay + "az: " + az);
    //console.log("vx: " + vx + "vy: " + vy + "vz: " + vz);

    // update ball position values
    let newX = ball.x + vx * dt;
    let newY = ball.y + vy * dt;
    let newZ = ball.z + vz * dt;

    //update new ball accelerations
    let newVx = vx + ax * dt;
    let newVy = vy + ay * dt;
    let newVz = vz + az * dt;

    //Apply Bounce and Friction
    if (newY <= ball.radius) {
      newY = ball.radius; //reset to ground level
      Ball.instance.bounce(); //bounce the ball
      console.log("Ball has bounced at: " + newZ);

      //apply damping
      newVy = -newVy * this.damping;

      //apply friction
      newVz = newVz * this.friction;
    }

    //update ball pos
    ball.xPos = newX;
    ball.yPos = newY;
    ball.zPos = newZ;

    //update ball accelerations
    ball.vx = newVx;
    ball.vy = newVy;
    ball.vz = newVz;
  }
}
