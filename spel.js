function changeBackground() {
  var selectElement = document.getElementById("imageSelector");
  var selectedValue = selectElement.value;
  if (selectedValue === "white") {
    document.body.style.backgroundColor = "white";
    document.body.style.backgroundImage = "none";
  } else {
    document.body.style.backgroundImage = "url('" + selectedValue + "')";
    document.body.style.backgroundColor = "transparent";
  }
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeSize = 20;
const gridSize = 20;
let snake = [{ x: 200, y: 200 }];

let foods = [];
let dx = 0;
let dy = 0;
let score = 0;
let isPaused = true;
let speed = 120;
let gameInterval;

function drawSnake() {
  ctx.fillStyle = "green";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  foods.forEach((food) => {
    ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
  });
}

function drawGrid() {
  ctx.beginPath();
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
  }
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
  }
  ctx.strokeStyle = "lightgray";
  ctx.stroke();
}

function randomPosition() {
  return Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
}

function spawnFood() {
  const numFoods = document.getElementById("difficulty").value;
  const numFoodsToAdd = numFoods - foods.length;
  for (let i = 0; i < numFoodsToAdd; i++) {
    let foodPosition;
    do {
      foodPosition = { x: randomPosition(), y: randomPosition() };
    } while (
      snake.some(
        (segment) =>
          segment.x === foodPosition.x && segment.y === foodPosition.y
      )
    );
    foods.push(foodPosition);
  }
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  let ateFood = false;
  foods.forEach((food, index) => {
    if (head.x === food.x && head.y === food.y) {
      score += 1;
      document.getElementById("score").innerText = score;
      foods.splice(index, 1);
      spawnFood();
      ateFood = true;
    }
  });

  
  if (!ateFood) {
    snake.pop();
  }
}

// function highScore(score) {
//   var saved = 0;
//   try { saved = parseFloat(localStorage.highScore); } catch (e) { saved = 0; }
//   if (!(typeof score === 'undefined')) {
//      saved = score;
//      localStorage.highScore = '' + score;
//   }
//   if (isNaN(saved)) {
//      saved = 0;
//      localStorage.highScore = '0';
//   }
//   return saved;
// }

function checkCollision() {
  const head = snake[0];
  return (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake
      .slice(1)
      .some((segment) => segment.x === head.x && segment.y === head.y)
  );
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  foods = [];
  dx = 0;
  dy = 0;
  score = 0;
  isPaused = true;
  clearInterval(gameInterval);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("score").innerText = score;
}

function gameLoop() {
  if (!isPaused) {
    if (checkCollision()) {
      clearInterval(gameInterval);
      alert("Game Over! Your score: " + score);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    moveSnake();
    drawFood();
    drawSnake();
  }
}

document.addEventListener("keydown", (event) => {
  const keyPressed = event.key;
  if (!isPaused) {
    if (
      (keyPressed === "ArrowUp" && dy === 0) ||
      (keyPressed === "w" && dy === 0)
    ) {
      dx = 0;
      dy = -snakeSize;
    } else if (
      (keyPressed === "ArrowDown" && dy === 0) ||
      (keyPressed === "s" && dy === 0)
    ) {
      dx = 0;
      dy = snakeSize;
    } else if (
      (keyPressed === "ArrowLeft" && dx === 0) ||
      (keyPressed === "a" && dx === 0)
    ) {
      dx = -snakeSize;
      dy = 0;
    } else if (
      (keyPressed === "ArrowRight" && dx === 0) ||
      (keyPressed === "d" && dx === 0)
    ) {
      dx = snakeSize;
      dy = 0;
    }
  }
});

function updateGameSpeed(newSpeed) {
  speed = newSpeed;
  if (!isPaused && gameInterval) {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  }
}

function restartGame() {
  resetGame();
  isPaused = false;
  gameInterval = setInterval(gameLoop, speed);
  spawnFood();
}

document.getElementById("difficulty").addEventListener("change", () => {
  const difficulty = document.getElementById("difficulty").value;
  switch (difficulty) {
    case "1":
      updateGameSpeed(80);
      break;
    case "2":
      updateGameSpeed(100);
      break;
    case "3":
      updateGameSpeed(130);
      break;
    default:
      updateGameSpeed(130);
  }
});

document.getElementById("playButton").addEventListener("click", () => {
  try {
    restartGame();
  } catch (error) {}
});
