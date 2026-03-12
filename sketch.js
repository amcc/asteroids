let shipDefault = {
  x: 0,
  y: 0,
  rotation: 0,
  speedX: 0,
  speedY: 0,
};

const ships = [
  {
    x: 0,
    y: 0,
    rotation: 0,
    speedX: 0,
    speedY: 0,
  },
  {
    x: 0,
    y: 0,
    rotation: Math.PI,
    speedX: 0,
    speedY: 0,
  },
];

const rotationInc = 0.04;
const speedInc = 0.1;
const maxSpeed = 40;
const shipWidth = 40;
const shipHeight = 35;
const xOffset = -shipWidth / 2.4;
const yOffset = -shipHeight / 2;

function setup() {
  createCanvas(windowWidth, windowHeight);
  ships.forEach((ship, i) => {
    ship.x = width/3 + i*width/3;
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
  });
  checkKey();
}

function checkKey() {
  if (keyIsDown(UP_ARROW)) {
    updateSpeed(ships[1], speedInc);
    ships[1].thrustRotation = ships[1].rotation;
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
}

function updateLocation(ship, i) {
  ship.x += ship.speedX;
  ship.y += ship.speedY;

  checkOffCanvas(ship);
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

function drawShip(ship, i) {
  // if(i == 0) {
  //   fill(255,0,0)
  // } else if (i === 1) {
  //   fill(0,255,0)
  // }
  
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
}

function checkOffCanvas(ship) {
  if (ship.x > width + shipWidth) {
    ship.x = -shipWidth;
  }
  if (ship.x < -shipWidth) {
    ship.x = width + shipWidth;
  }
  if (ship.y > height + shipHeight) {
    ship.y = -shipHeight;
  }
  if (ship.y < -shipHeight) {
    ship.y = height + shipHeight;
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
