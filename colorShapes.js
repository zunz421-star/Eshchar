const canvas = document.getElementById('shapeCanvas');
const ctx = canvas.getContext('2d');

const circles = [];
const triangles = [];

let score = 0;
let round = 1;
let nextSpawn = 0;
let gameOver = false;
let waveTimer = 0;

function randomColor() {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 85%, 60%)`;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function spawnCircle(x, y) {
  circles.push({
    x,
    y,
    vx: 1.8,
    vy: 0,
    radius: 18,
    hp: 80,
    color: randomColor(),
    damage: 18,
    flash: 0,
    type: 'circle'
  });
}

function spawnTriangle() {
  const size = rand(28, 40);
  triangles.push({
    x: canvas.width + size,
    y: rand(size, canvas.height - size),
    vx: -1.1,
    vy: rand(-0.4, 0.4),
    size,
    hp: 80,
    color: randomColor(),
    damage: 14,
    flash: 0,
    type: 'triangle'
  });
}

function drawCircle(entity) {
  ctx.beginPath();
  ctx.fillStyle = entity.flash > 0 ? '#ffffff' : entity.color;
  ctx.arc(entity.x, entity.y, entity.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();
}

function drawTriangle(entity) {
  ctx.beginPath();
  ctx.fillStyle = entity.flash > 0 ? '#ffffff' : entity.color;
  ctx.moveTo(entity.x, entity.y - entity.size / 2);
  ctx.lineTo(entity.x - entity.size / 2, entity.y + entity.size / 2);
  ctx.lineTo(entity.x + entity.size / 2, entity.y + entity.size / 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0f172a';
  ctx.stroke();
}

function drawHud() {
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`ניקוד: ${score} | סיבוב: ${round}`, 24, 32);
  ctx.fillText(`עיגולים: ${circles.length} | משולשים: ${triangles.length}`, 24, 58);

  if (gameOver) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('המשחק נגמר!', canvas.width / 2 - 160, canvas.height / 2 - 20);
    ctx.font = '24px Arial';
    ctx.fillText(`סוף משחק עם ${score} נקודות`, canvas.width / 2 - 120, canvas.height / 2 + 24);
  }
}

function resolveCollision(circle, triangle) {
  const dx = triangle.x - circle.x;
  const dy = triangle.y - circle.y;
  const distance = Math.hypot(dx, dy);
  const minDistance = circle.radius + triangle.size * 0.5;

  if (distance > minDistance) {
    return;
  }

  circle.hp -= triangle.damage;
  triangle.hp -= circle.damage;
  circle.flash = 8;
  triangle.flash = 8;

  const push = 4;
  circle.x -= (dx / distance) * push;
  circle.y -= (dy / distance) * push;
  triangle.x += (dx / distance) * push;
  triangle.y += (dy / distance) * push;

  if (circle.hp <= 0) {
    circle.dead = true;
  }

  if (triangle.hp <= 0) {
    triangle.dead = true;
    score += 10;
  }
}

function updateEntities(delta) {
  for (const circle of circles) {
    circle.x += circle.vx * delta;
    circle.y += circle.vy * delta;
    circle.flash = Math.max(0, circle.flash - 1);

    if (circle.x > canvas.width + 40) {
      circle.dead = true;
    }
  }

  for (const triangle of triangles) {
    triangle.x += triangle.vx * delta;
    triangle.y += triangle.vy * delta;
    triangle.flash = Math.max(0, triangle.flash - 1);

    if (triangle.x < -60) {
      triangle.dead = true;
      gameOver = true;
    }
  }

  for (let i = 0; i < circles.length; i++) {
    for (let j = 0; j < triangles.length; j++) {
      resolveCollision(circles[i], triangles[j]);
    }
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    if (circles[i].dead || circles[i].hp <= 0) {
      circles.splice(i, 1);
    }
  }

  for (let i = triangles.length - 1; i >= 0; i--) {
    if (triangles[i].dead || triangles[i].hp <= 0) {
      triangles.splice(i, 1);
    }
  }
}

function spawnWave() {
  const count = 2 + round;
  for (let i = 0; i < count; i++) {
    spawnTriangle();
  }
}

function update(delta) {
  if (gameOver) {
    drawHud();
    return;
  }

  waveTimer += delta;
  if (waveTimer > 1400) {
    waveTimer = 0;
    round += 1;
    spawnWave();
  }

  if (performance.now() > nextSpawn) {
    nextSpawn = performance.now() + 900;
    spawnTriangle();
  }

  updateEntities(delta / 16.67);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const circle of circles) {
    drawCircle(circle);
  }

  for (const triangle of triangles) {
    drawTriangle(triangle);
  }

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  drawHud();
}

let lastTime = performance.now();

function animate(time) {
  const delta = time - lastTime;
  lastTime = time;
  update(delta);
  requestAnimationFrame(animate);
}

canvas.addEventListener('click', (event) => {
  if (gameOver) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  spawnCircle(x, y);
});

spawnWave();
requestAnimationFrame(animate);
