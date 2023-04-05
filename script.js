const grid = document.querySelectorAll('.grid');
const apple = document.querySelector('.apple-icon');
const scoreDisplay = document.getElementById('score');

// Define snake object
const snake = {
  body: [{row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}],
  direction: 'right',
  nextDirection: 'right'
};

function drawSnake() {
  // Clear any previous snake elements
  grid.forEach(gridCell => {
    if (gridCell.classList.contains('snake')) {
      gridCell.classList.remove('snake');
    }
  });

  // Draw the snake onto the game board
  snake.body.forEach((segment, index) => {
    const snakeHead = (index === snake.body.length - 1);
    const gridCell = grid[segment.row * 20 + segment.col];

    // Add 'snake' class to grid cell
    gridCell.classList.add('snake');

    // Set background image for snake head
    if (snakeHead) {
      switch (snake.direction) {
        case 'up':
          gridCell.style.backgroundImage = 'url("https://i.ibb.co/9hBbtSB/snake-head-up.png")';
          break;
        case 'down':
          gridCell.style.backgroundImage = 'url("https://i.ibb.co/LCm4V4s/snake-head-down.png")';
          break;
        case 'left':
          gridCell.style.backgroundImage = 'url("https://i.ibb.co/NVLgN10/snake-head-left.png")';
          break;
        case 'right':
          gridCell.style.backgroundImage = 'url("https://i.ibb.co/pw8Dzjh/snake-head-right.png")';
          break;
      }
    }
  });
}

function moveSnake() {
    // Calculate the new head position based on the current direction
    const oldHead = snake.body[snake.body.length - 1];
    let newHead;
  
    switch (snake.direction) {
      case 'up':
        newHead = {row: oldHead.row - 1, col: oldHead.col};
        break;
      case 'down':
        newHead = {row: oldHead.row + 1, col: oldHead.col};
        break;
      case 'left':
        newHead = {row: oldHead.row, col: oldHead.col - 1};
        break;
      case 'right':
        newHead = {row: oldHead.row, col: oldHead.col + 1};
        break;
    }
  
    // Add the new head to the beginning of the snake's body
    snake.body.push(newHead);
  
    // Remove the tail if the snake did not eat an apple
    const ateApple = checkAppleCollision();
    if (!ateApple) {
      snake.body.shift();
    }
  
    // Update the snake's direction to the next direction (if it has changed)
    snake.direction = snake.nextDirection;
  
    // Check for collisions with walls or the snake's own body
    const collided = checkWallCollision() || checkSnakeCollision();
    if (collided) {
      gameOver();
      return;
    }
  
    // Redraw the snake on the game board
    drawSnake();
  
    // Move the apple to a new random position if the snake ate it
    if (ateApple) {
      moveApple();
    }
  }
  
        
        function checkWallCollision() {
        // Check if the snake's head is outside the game board
        const head = snake.body[snake.body.length - 1];
        return head.row < 0 || head.row >= 20 || head.col < 0 || head.col >= 20;
        }
        
        function checkSnakeCollision() {
        // Check if the snake's head collides with any part of its body
        const head = snake.body[snake.body.length - 1];
        for (let i = 0; i < snake.body.length - 1; i++) {
        if (snake.body[i].row === head.row && snake.body[i].col === head.col) {
        return true;
        }
        }
        return false;
        }
        
        function checkAppleCollision() {
        // Check if the snake's head collides with the apple
        const head = snake.body[snake.body.length - 1];
        const applePosition = getPosition(apple);
        if (head.row === applePosition.row && head.col === applePosition.col) {
        // Increase the score and update the score display
        score++;
        scoreDisplay.textContent = score;
        return true}
        return false;
        }
        
        function getPosition(element) {
        // Get the row and column position of an element in the grid
        const index = Array.from(grid).indexOf(element);
        const row = Math.floor(index / 20);
        const col = index % 20;
        return {row, col};
        }
        
        function moveApple() {
        // Move the apple to a new random position
        let newPosition = {};
        do {
        const row = Math.floor(Math.random() * 20);
        const col = Math.floor(Math.random() * 20);
        newPosition = {row, col};
        } while (isSnakeSegment(newPosition));
        
        setPosition(apple, newPosition);
        }
        
        function isSnakeSegment(position) {
        // Check if a given position is occupied by any segment of the snake's body
        return snake.body.some(segment => {
        return segment.row === position.row && segment.col === position.col;
        });
        }
        
        function setPosition(element, position) {
        // Set the row and column position of an element in the grid
        const index = position.row * 20 + position.col;
        const gridCell = grid[index];
        element.style.top = `${position.row * 25}px`;
        element.style.left = `${position.col * 25}px`;
        gridCell.appendChild(element);
        }
        
        function gameOver() {
            clearInterval(gameInterval);
            alert(`Game Over! Your final score is ${score}`);
            
            // Reset snake object to initial state
            snake.body = [{row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}];
            snake.direction = 'right';
            snake.nextDirection = 'right';
            
            // Reset score
            score = 0;
            scoreDisplay.textContent = score;
            
            // Reset apple position
            placeApple();
            
            // Redraw the snake and apple
            drawSnake();
            drawApple();
            
            // Restart the game interval
            gameInterval = setInterval(gameLoop, 100);
            }
            
            // Listen for arrow key presses to change snake direction
            document.addEventListener('keydown', event => {
            const key = event.key;
            const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            
            if (validKeys.includes(key)) {
            event.preventDefault();
            switch (key) {
            case 'ArrowUp':
            if (snake.direction !== 'down') {
            snake.nextDirection = 'up';
            }
            break;
            case 'ArrowDown':
            if (snake.direction !== 'up') {
            snake.nextDirection = 'down';
            }
            break;
            case 'ArrowLeft':
            if (snake.direction !== 'right') {
            snake.nextDirection = 'left';
            }
            break;
            case 'ArrowRight':
            if (snake.direction !== 'left') {
            snake.nextDirection = 'right';
            }
            break;
            }
            }
            });
            
            // Start the game interval
            let gameInterval = setInterval(gameLoop, 100);
            
            // Draw initial snake and apple
            drawSnake();
            drawApple();
