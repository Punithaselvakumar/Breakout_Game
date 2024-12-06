// Select canvas and set up context
const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Game variables
let score = 0;
let lives = 2;
const brickRowCount = 7;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Paddle properties
const paddle = {
  height: 10,
  width: 100,
  x: canvas.width / 2 - 100 / 2,
  dx: 7
};

// Ball properties
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 4,
  dy: -4,
  radius: 10
};

// Bricks array
const bricks = Array.from({ length: brickColumnCount }, (_, c) =>
  Array.from({ length: brickRowCount }, (_, r) => ({ x: 0, y: 0, status: 1 }))
);

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = '#0095DD';
  ctx.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  bricks.forEach((column, c) =>
    column.forEach((brick, r) => {
      if (brick.status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        brick.x = brickX;
        brick.y = brickY;
        ctx.fillStyle = '#0095DD';
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    })
  );
}

// Draw score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// Draw lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#0095DD';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// Move paddle
function movePaddle() {
  if (rightPressed && paddle.x + paddle.width < canvas.width) paddle.x += paddle.dx;
  else if (leftPressed && paddle.x > 0) paddle.x -= paddle.dx;
}

// Move ball
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) ball.dx *= -1;
  if (ball.y - ball.radius < 0) ball.dy *= -1;

  // Paddle collision
  if (
    ball.y + ball.radius > canvas.height - paddle.height &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy = -ball.dy;
  }

  // Brick collision
  bricks.forEach(column =>
    column.forEach(brick => {
      if (
        brick.status === 1 &&
        ball.x > brick.x &&
        ball.x < brick.x + brickWidth &&
        ball.y > brick.y &&
        ball.y < brick.y + brickHeight
      ) {
        ball.dy *= -1;
        brick.status = 0;
        score++;

        if (score === brickRowCount * brickColumnCount) {
          alert('You win!');
          document.location.reload();
        }
      }
    })
  );

  // Bottom wall collision
  if (ball.y + ball.radius > canvas.height) {
    lives--;
    if (lives === 0) {
      alert('Game Over');
      document.location.reload();
    } else {
      resetBallAndPaddle();
    }
  }
}

function resetBallAndPaddle() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 30;
  ball.dx = 4;
  ball.dy = -4;
  paddle.x = canvas.width / 2 - paddle.width / 2;
}

// Key handlers
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
  else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
});

document.addEventListener('keyup', e => {
  if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
  else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
});

// Show and hide rules
const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const rules = document.getElementById('rules');

rulesBtn.addEventListener('click', () => {
  rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
  rules.classList.remove('show');
});

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();
}

// Update game frame
function update() {
  movePaddle();
  moveBall();
  draw();
  requestAnimationFrame(update);
}

update();
