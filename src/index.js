import powerUpSound from "url:../assets/PowerUp1.wav";

const soundEffect = new Audio(powerUpSound);

const DOWN = 0,
  UP = 1,
  LEFT = 2,
  RIGHT = 3;
let currentDirection = DOWN;
let currentFrame = 0;
const frameWidth = 16,
  frameHeight = 16;
const spriteSheetRows = 4;
const frameDelay = 10;
let frameCount = 0;

let heroX = 200,
  heroY = 200;
const moveSpeed = 2;
const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

let shrimpX, shrimpY;

function spawnShrimp() {
  shrimpX = Math.floor(Math.random() * (384 / frameWidth)) * frameWidth;
  shrimpY = Math.floor(Math.random() * (384 / frameHeight)) * frameHeight;
}

function checkCollision() {
  return (
    heroX < shrimpX + frameWidth &&
    heroX + frameWidth > shrimpX &&
    heroY < shrimpY + frameHeight &&
    heroY + frameHeight > shrimpY
  );
}

function gameLoop() {
  const img = document.getElementById("hero");
  const shrimpImg = document.getElementById("shrimp");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  const isMoving = updateHeroPosition();
  const frameX = currentDirection * frameWidth;
  const frameY = currentFrame * frameHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    img,
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    heroX,
    heroY,
    frameWidth,
    frameHeight
  );
  ctx.drawImage(shrimpImg, shrimpX, shrimpY, frameWidth, frameHeight);

  if (isMoving) {
    frameCount++;
    if (frameCount >= frameDelay) {
      currentFrame = (currentFrame + 1) % spriteSheetRows;
      frameCount = 0;
    }
  } else {
    currentFrame = 0;
  }

  if (checkCollision()) {
    soundEffect.play();
    spawnShrimp();
  }

  requestAnimationFrame(gameLoop);
}

function updateHeroPosition() {
  let isMoving = false;
  if (keysPressed.ArrowUp && heroY > 0) {
    currentDirection = UP;
    heroY -= moveSpeed;
    isMoving = true;
  }
  if (keysPressed.ArrowDown && heroY < canvas.height - frameHeight) {
    currentDirection = DOWN;
    heroY += moveSpeed;
    isMoving = true;
  }
  if (keysPressed.ArrowLeft && heroX > 0) {
    currentDirection = LEFT;
    heroX -= moveSpeed;
    isMoving = true;
  }
  if (keysPressed.ArrowRight && heroX < canvas.width - frameWidth) {
    currentDirection = RIGHT;
    heroX += moveSpeed;
    isMoving = true;
  }
  return isMoving;
}

function handleKeyDown(event) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = true;
  }
}

function handleKeyUp(event) {
  if (event.key in keysPressed) {
    keysPressed[event.key] = false;
  }
}

window.onload = function () {
  spawnShrimp();
  gameLoop();
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
};
