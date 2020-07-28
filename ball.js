/**
 * Models and logic would be separate if I didn't need to install json-server just to avoid CORS issues,
 * for this reason everything is here, but:
 */

// ************************* CONFIG *************************
const CONFIG = {
  intialSpeed: 50,
  acceleration: 7,
  updateInterval: 80,
  bounceEnergyLossPercentage: 0.3,
};

// ************************* MODELS *************************
class Ball {
  htmlRef;
  velocity = { x: 0, y: 0 }; // px per second
  position = { x: 0, y: 0 };
  screenHeight = 100;
  screenWidth = 100;

  constructor({ x, y }) {
    this.screenHeight = document.body.offsetHeight - 3;
    this.screenWidth = document.body.offsetWidth - 3;
    const velocityMagnitude = Math.random() * CONFIG.intialSpeed;
    const angleInRadians = Math.random() * Math.PI;

    this.velocity = {
      x: velocityMagnitude * Math.cos(angleInRadians),
      y: velocityMagnitude * Math.sin(angleInRadians),
    };

    this.htmlRef = document.createElement('div');
    this.htmlRef.className = 'ball';
    this.htmlRef.style.transition = `${CONFIG.updateInterval}ms linear`;
    // -10 because radius is 20
    this.position = {
      x: x - 10,
      y: y - 10,
    };
    this.calculatePosition();
    document.body.appendChild(this.htmlRef);
  }

  calculatePosition() {
    this.htmlRef.style.left = `${this.position.x}px`;
    this.htmlRef.style.top = `${this.position.y}px`;
  }

  updatePosition() {
    const { x, y } = this.position;

    let nextY = y - this.velocity.y;

    if (nextY >= this.screenHeight - 20 - CONFIG.acceleration) {
      nextY = this.screenHeight - 20;
      this.velocity.y =
        this.velocity.y * -(1 - CONFIG.bounceEnergyLossPercentage);
    } else {
      this.velocity.y = this.velocity.y - CONFIG.acceleration;
    }

    this.position = {
      x: x + this.velocity.x,
      y: nextY,
    };
    this.calculatePosition();
  }

  removeFromDom() {
    this.htmlRef.remove();
    this.updatePosition = () => {};
  }
}

// ************************* MAIN *************************
const ballList = [];

const ballGenerator = (event) => {
  const { x, y } = event;
  const ball = new Ball({ x, y });
  ballList.push(ball);
};

(function () {
  setInterval(() => {
    ballList.map((b) => {
      if (b.position.x > b.screenWidth || b.position.x < 0) b.removeFromDom();
      b.updatePosition();
    });
  }, CONFIG.updateInterval);
})();
