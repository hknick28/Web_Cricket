class Ball {
  static #internalKey = "single ball";
  static #instance = new Ball(Ball.#internalKey);

  #mesh;

  speed;
  line;
  length;
  constructor(key) {
    if (key !== Ball.#internalKey) {
      throw new Error("Use Ball.getInstance()!");
    }
    //setup ball
    this.draw();
  }

  // speed (kph)
  static get speed() {
    return 90;
  }

  // get release point
  get releaseZ() {
    return bowlingBackZ + 1.7;
  }

  get releaseX() {
    return 1 / 2;
  }

  get releaseY() {
    return 2.2;
  }
  // convert kph to ms^-1
  static setSpeed() {
    this.speed = Ball.speed / 3.6;
  }

  draw() {
    const geometry = new THREE.SphereGeometry(0.072, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    this.#mesh = new THREE.Mesh(geometry, material);
    this.#mesh.position.set(this.releaseX, this.releaseY, this.releaseZ); // 2.2m high (release height)
    scene.add(this.#mesh);
  }

  //reset ball after delivery
  reset() {}

  //
  update() {}

  static get instance() {
    return Ball.#instance;
  }
}
