let bullets = [];

const ships = [
  {
    index: 0,
    x: 0,
    y: 0,
    rotation: 0,
    speedX: 0,
    speedY: 0,
    hit: false,
    hitTimer: 0,
    type: "ship",
  },
  {
    index: 1,
    x: 0,
    y: 0,
    rotation: Math.PI,
    speedX: 0,
    speedY: 0,
    hit: false,
    hitTimer: 0,
    type: "ship",
  },
];

const rotationInc = 0.04;
const speedInc = 0.1;
const maxSpeed = 40;
const shipWidth = 40;
const shipHeight = 35;
const bulletWidth = 40;
const bulletSpeed = 6;
const xOffset = -shipWidth / 2.4;
const yOffset = -shipHeight / 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  init();
}

function init() {
  ships.forEach((ship, i) => {
    ship.x = width / 3 + (i * width) / 3;
    ship.y = height / 2;
  });
}

function draw() {
  background(0, 0, 255);
  stroke(255);
  strokeWeight(2);
  noFill();
  ships.forEach((ship, i) => {
    drawShip(ship, i);
    updateLocation(ship, i);
    // Check for hits
    bullets.forEach((bullet) => {
      if (hitDetection(bullet, ship)) {
        console.log("Hit!");
        bullets.splice(bullets.indexOf(bullet), 1);
        ship.hit = true;
        ship.hitTimer = 100; // Set hit timer for 60 frames
      }
    });
  });
  bullets.forEach((bullet, i) => {
    d(bullet);
    updateLocation(bullet, i);
  });
  checkKey();
}

function checkKey() {
  if (keyIsDown(UP_ARROW)) {
    updateSpeed(ships[1], speedInc);
    ships[1].thrustRotation = ships[1].rotation;
  }
  if (keyIsDown(DOWN_ARROW)) {
    addBullet(ships[1]);
  }
  if (keyIsDown(LEFT_ARROW)) {
    updateRotation(ships[1], -rotationInc);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    updateRotation(ships[1], rotationInc);
  }

  if (keyIsDown(87)) {
    updateSpeed(ships[0], speedInc);
    ships[0].thrustRotation = ships[0].rotation;
  }
  if (keyIsDown(65)) {
    updateRotation(ships[0], -rotationInc);
  }
  if (keyIsDown(68)) {
    updateRotation(ships[0], rotationInc);
  }
  if (keyIsDown(83)) {
    addBullet(ships[0]);
  }
}

function updateLocation(object, i) {
  object.x += object.speedX;
  object.y += object.speedY;

  checkOffCanvas(object);
}

function updateSpeed(ship, amount) {
  let angle = ship.rotation;
  let xInc = cos(angle) * amount;
  let yInc = sin(angle) * amount;

  incSpeed(xInc, yInc, ship);
}
function updateRotation(ship, amount) {
  ship.rotation += amount;
}

function drawbullet(bullet) {
  stroke(255);
  push();
  translate(bullet.x, bullet.y);
  rotate(bullet.rotation);
  line(0, 0, bulletWidth, 0);
  pop();
}

function addBullet(ship) {
  let angle = ship.rotation;
  let xInc = cos(angle) * bulletSpeed;
  let yInc = sin(angle) * bulletSpeed;
  bullets.push({
    index: ship.index,
    x: ship.x,
    y: ship.y,
    rotation: ship.rotation,
    speedX: ship.speedX + xInc,
    speedY: ship.speedY + yInc,
    loops: 0,
    type: "bullet",
  });
}

function drawShip(ship, i) {
  if (ship.hit) {
    stroke(random(255), 0, 0);
  } else {
    stroke(255);
  }
  push();
  translate(ship.x, ship.y);
  rotate(ship.rotation);
  beginShape();
  vertex(xOffset + 0, yOffset + 0);
  vertex(xOffset + shipWidth, yOffset + shipHeight / 2);
  vertex(xOffset + 0, yOffset + shipHeight);
  vertex(xOffset + shipWidth / 5, yOffset + shipHeight / 2);
  endShape(CLOSE);
  pop();

  if (ship.hit) {
    ship.hitTimer--;
    if (ship.hitTimer <= 0) {
      ship.hit = false;
    }
  }
}

function hitDetection(bullet, ship) {
  if (bullet.index === ship.index) return false;
  let distance = dist(bullet.x, bullet.y, ship.x, ship.y);
  if (distance < shipWidth / 2) {
    return true;
  }
  return false;
}

function checkOffCanvas(object) {
  if (object.x > width + shipWidth) {
    object.x = -shipWidth;
    checkLoops(object);
  }
  if (object.x < -shipWidth) {
    object.x = width + shipWidth;
    checkLoops(object);
  }
  if (object.y > height + shipHeight) {
    object.y = -shipHeight;
    checkLoops(object);
  }
  if (object.y < -shipHeight) {
    object.y = height + shipHeight;
    checkLoops(object);
  }
}

function checkLoops(object) {
  if (object.type !== "bullet") return;
  object.loops++;
  if (object.loops > 2) {
    bullets.splice(bullets.indexOf(object), 1);
  }
}

function incSpeed(xInc, yInc, ship) {
  ship.speedX += checkSpeed(xInc, ship.speedX);
  ship.speedY += checkSpeed(yInc, ship.speedY);
}

function checkSpeed(amount, speed) {
  let speedInc = amount;
  if (amount < 0 && speed < -maxSpeed) {
    speedInc = 0;
  }
  if (amount > 0 && speed > maxSpeed) {
    speedInc = 0;
  }
  return speedInc;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init();
}
