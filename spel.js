
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const snakeSize = 20;
    const gridSize = 20;
    let snake = [{ x: 200, y: 200 }];
    let food = { x: 0, y: 0 };
    let dx = 0;
    let dy = 0;
    let score = 0;
    let isPaused = false;

    function drawSnake() {
        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, snakeSize, snakeSize);
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
        ctx.strokeStyle = 'lightgray';
        ctx.stroke();
    }

    function randomPosition() {
        return Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    }

    function spawnFood() {
        food.x = randomPosition();
        food.y = randomPosition();
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score += 1;
            document.getElementById('score').innerText = score;
            spawnFood();
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 ||
            head.x >= canvas.width ||
            head.y < 0 ||
            head.y >= canvas.height ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function gameLoop() {
        if (!isPaused) {
            if (checkCollision()) {
                alert('Game Over! Your score: ' + score);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawGrid();
            moveSnake();
            drawFood();
            drawSnake();
        }

        setTimeout(gameLoop, 120);
    }

    document.addEventListener('keydown', event => {
        const keyPressed = event.key;
        if (keyPressed === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -snakeSize;
        } else if (keyPressed === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = snakeSize;
        } else if (keyPressed === 'ArrowLeft' && dx === 0) {
            dx = -snakeSize;
            dy = 0;
        } else if (keyPressed === 'ArrowRight' && dx === 0) {
            dx = snakeSize;
            dy = 0;
        } else if (keyPressed === 'Escape') {
            isPaused = !isPaused;
        }
    });

    spawnFood();
    gameLoop();