import TileMap from "./TileMap.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const tileSize = 32;

const tileMap = new TileMap(tileSize);

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let tileCount = 32;
let headX = 7;
let headY = 7;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let speed = 7;

const gulpSound = new Audio("gulp.wav");
const gameOverSound = new Audio("gameover.wav");

function gameLoop() {
  changeSnakePosition();
  let result = isGameOver();
  if (result) {
    return;
  }

  clearScreen();

  checkAppleCollision();
  drawApple();
  drawSnake();

  drawScore();

  setTimeout(gameLoop, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (yVelocity === 0 && xVelocity === 0) {
    return false;
  }

  if (headX < 1) {
    gameOver = true;
  }
  if (headX > 13) {
    gameOver = true;
  }
  if (headY < 1) {
    gameOver = true;
  }
  if (headY > 13) {
    gameOver = true;
  }
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === headX && part.y === headY) {
      gameOver = true;
      break;
    }
  }

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over!", canvas.width / 5, canvas.height / 2);
    gameOverSound.play();
  }
  return gameOver;
}

function clearScreen() {
  tileMap.draw(canvas, ctx);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "25px Verdana";
  ctx.fillText("score " + score, canvas.width - 128, 24);
}

function drawSnake() {
  ctx.fillStyle = "green";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(
      part.x * tileCount + 5,
      part.y * tileCount + 5,
      tileSize - 10,
      tileSize - 10
    );
  }

  snakeParts.push(new SnakePart(headX, headY));
  if (snakeParts.length > tailLength) {
    snakeParts.shift();
  }
  ctx.fillStyle = "orange";
  ctx.fillRect(
    headX * tileCount + 1,
    headY * tileCount + 1,
    tileSize - 2,
    tileSize - 2
  );
}

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function drawApple() {
  ctx.fillStyle = "red";
  ctx.fillRect(
    appleX * tileCount + 1,
    appleY * tileCount + 1,
    tileSize - 2,
    tileSize - 2
  );
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(1 + Math.random() * 13);
    appleY = Math.floor(1 + Math.random() * 13);
    tailLength++;
    score++;
    speed += 0.2;
    gulpSound.play();
  }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
  if (event.keyCode === 38) {
    if (yVelocity === 1) return;
    yVelocity = -1;
    xVelocity = 0;
  }
  if (event.keyCode === 37) {
    if (xVelocity === 1) return;
    xVelocity = -1;
    yVelocity = 0;
  }
  if (event.keyCode === 39) {
    if (xVelocity === -1) return;
    xVelocity = 1;
    yVelocity = 0;
  }
  if (event.keyCode === 40) {
    if (yVelocity === -1) return;
    yVelocity = 1;
    xVelocity = 0;
  }
}

gameLoop();
