const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

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
            ctx.fillStyle = 'green';
            snake.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
            });
        }

        function drawFood() {
            ctx.fillStyle = 'red';
            foods.forEach(food => {
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
            ctx.strokeStyle = 'lightgray';
            ctx.stroke();
        }

        function randomPosition() {
            return Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
        }

        function spawnFood() {
            const numFoods = document.getElementById('difficulty').value / 3;
            foods = [];
            for (let i = 0; i < numFoods; i++) {
                foods.push({ x: randomPosition(), y: randomPosition() });
            }
        }

        function moveSnake() {
            const head = { x: snake[0].x + dx, y: snake[0].y + dy };
            snake.unshift(head);
            let ateFood = false;
            foods.forEach((food, index) => {
                if (head.x === food.x && head.y === food.y) {
                    score += 1;
                    document.getElementById('score').innerText = score;
                    foods.splice(index, 1);
                    spawnFood();
                    ateFood = true;
                }
            });
            if (!ateFood) {
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
                    clearInterval(gameInterval);
                    alert('Game Over! Your score: ' + score);
                    return;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                drawGrid();
                moveSnake();
                drawFood();
                drawSnake();
            }
        }

        document.addEventListener('keydown', event => {
            const keyPressed = event.key;
            if (!isPaused) {
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
                }
            }
        });

        document.getElementById('playButton').addEventListener('click', () => {
            isPaused = false;
            gameInterval = setInterval(gameLoop, speed);
            spawnFood();
        });

        document.getElementById('difficulty').addEventListener('change', () => {
            const difficulty = document.getElementById('difficulty').value;
            switch (difficulty) {
                case '1':
                    speed = 120;
                    break;
                case '2':
                    speed = 100;
                    break;
                case '3':
                    speed = 80;
                    break;
                default:
                    speed = 120;
            }
            if (!isPaused) {
                clearInterval(gameInterval);
                gameInterval = setInterval(gameLoop, speed);
            }
        });