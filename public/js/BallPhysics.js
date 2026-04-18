export class BallPhysics {
  static gravity = 9.81; // m/s^2
  static air_desity = 1.225; // kg/m^3
  static drag_coeff = 0.47; //typical for a ball of any size

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
    const ay = -this.gravity - (vy / v) * (drag / mass);
    const az = -(vz / v) * (drag / mass);

    //console.log("ax: " + ax + "ay: " + ay + "az: " + az);
    //console.log("vx: " + vx + "vy: " + vy + "vz: " + vz);

    //update ball pos
    ball.xPos = ball.x + vx * dt;
    ball.yPos = ball.y + vy * dt;
    ball.zPos = ball.z + vz * dt;

    //update ball accelerations
    ball.vx = vx + ax * dt;
    ball.vy = vy + ay * dt;
    ball.vz = vz + az * dt;
  }
}
