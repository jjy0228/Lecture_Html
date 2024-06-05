const startButton = document.getElementById('startButton');
const gameCanvas = document.getElementById('gameCanvas');
const title = document.getElementById('title');
const ctx = gameCanvas.getContext('2d');
let circles = [];
let heartPosition;
let playerHP = 3;
const maxHP = 3;
let starRotation = 0;
let starX = 0;
let starY = 0;
const starSpeed = 2;
let keys = {};
let circleTimerId;
let animationFrameId;
let starSize = 15;
let isAttacking = false;
let killedCircles = 0;
let attackRadius = starSize;
let attackIncrement = 2;
let attackMaxRadius = 100;

startButton.addEventListener('click', function() {
    startButton.style.backgroundColor = 'blue';
    setTimeout(function() {
        title.style.display = 'none';
        startButton.style.display = 'none';
        gameCanvas.style.display = 'block';
        ctx.translate(gameCanvas.width / 2, gameCanvas.height / 2);
        heartPosition = getRandomPosition();
        startGame();
    }, 1000);
});

function startGame() {
    clearInterval(circleTimerId);
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('keyup', keyUpHandler);
    gameCanvas.removeEventListener('mousedown', attack);

    drawHeart(heartPosition.x, heartPosition.y, 30);
    drawStar(starX, starY, 5, starSize, starSize / 2);
    circleTimerId = setInterval(generateCircle, 200);
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    gameCanvas.addEventListener('mousedown', attack);
    animationFrameId = requestAnimationFrame(updateGame);
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(starRotation);

    ctx.beginPath();
    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * outerRadius;
        let y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();

    ctx.restore();
}

function drawHeart(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.bezierCurveTo(x + size / 4, y - size, x + size, y - size / 4, x, y + size);
    ctx.bezierCurveTo(x - size, y - size / 4, x - size / 4, y - size, x, y - size / 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function getRandomPosition() {
    const x = (Math.random() - 0.5) * gameCanvas.width;
    const y = (Math.random() - 0.5) * gameCanvas.height;
    return { x: x, y: y };
}

function generateCircle() {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.max(gameCanvas.width, gameCanvas.height) / 2 + 50;
    circles.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        radius: 5,
        speed: 1
    });
}

function updateGame() {
    ctx.clearRect(-gameCanvas.width / 2, -gameCanvas.height / 2, gameCanvas.width, gameCanvas.height);
    updateStarPosition();
    drawStar(starX, starY, 5, starSize, starSize / 2);
    drawHeart(heartPosition.x, heartPosition.y, 30);
    drawPlayerHP();
    drawKilledCircles();

    let collidedIndex = -1;

    starRotation -= 0.005;

    circles.forEach(function(circle, index) {
        const dx = starX - circle.x;
        const dy = starY - circle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        circle.speedX = (dx / dist) * circle.speed;
        circle.speedY = (dy / dist) * circle.speed;

        circle.x += circle.speedX;
        circle.y += circle.speedY;

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();

        if (checkCollision(circle.x, circle.y, circle.radius, starX, starY, starSize / 2)) {
            collidedIndex = index;
        }
    });

    if (collidedIndex !== -1) {
        playerHP--;
        circles.splice(collidedIndex, 1);
    }

    if (checkCollision(heartPosition.x, heartPosition.y, 15, starX, starY, starSize / 2)) {
        if (playerHP < maxHP) playerHP++;
        heartPosition = getRandomPosition();
    }

    if (isAttacking) {
        drawAttack(starX, starY, attackRadius);
        let initialLength = circles.length;
        circles = circles.filter(circle => !checkCollision(circle.x, circle.y, circle.radius, starX, starY, attackRadius));
        killedCircles += initialLength - circles.length;

        attackRadius += attackIncrement;
        if (attackRadius > attackMaxRadius) {
            isAttacking = false;
            attackRadius = starSize;
        }
    }

    if (playerHP > 0) {
        animationFrameId = requestAnimationFrame(updateGame);
    } else {
        showGameOverScreen();
    }
}

function updateStarPosition() {
    if (keys['ArrowUp']) starY -= starSpeed;
    if (keys['ArrowDown']) starY += starSpeed;
    if (keys['ArrowLeft']) starX -= starSpeed;
    if (keys['ArrowRight']) starX += starSpeed;
}

function keyDownHandler(event) {
    keys[event.key] = true;
}

function keyUpHandler(event) {
    keys[event.key] = false;
}

function attack() {
    if (isAttacking) return;
    isAttacking = true;
}

function drawAttack(cx, cy, outerRadius) {
    const spikes = 5;
    const innerRadius = outerRadius / 2;
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(starRotation);

    ctx.beginPath();
    ctx.moveTo(0, -outerRadius);
    for (let i = 0; i < spikes; i++) {
        let x = Math.cos(rot) * outerRadius;
        let y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(0, -outerRadius);
    ctx.closePath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.stroke();

    ctx.restore();
}

function showGameOverScreen() {
    clearInterval(circleTimerId);
    cancelAnimationFrame(animationFrameId);
    ctx.clearRect(-gameCanvas.width / 2, -gameCanvas.height / 2, gameCanvas.width, gameCanvas.height);
    title.innerHTML = "게임오버";
    title.style.display = 'block';
    startButton.innerHTML = "시작";
    startButton.style.display = 'block';
    gameCanvas.style.display = 'none';
    startButton.onclick = resetGame;
    window.removeEventListener('keydown', keyDownHandler);
    window.removeEventListener('keyup', keyUpHandler);
    gameCanvas.removeEventListener('mousedown', attack);
}

function resetGame() {
    clearInterval(circleTimerId);
    cancelAnimationFrame(animationFrameId);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    playerHP = maxHP;
    killedCircles = 0;
    circles = [];
    starX = 0;
    starY = 0;
    title.style.display = 'none';
    startButton.style.display = 'none';
    gameCanvas.style.display = 'block';
    ctx.translate(gameCanvas.width / 0, gameCanvas.height / 0);
    heartPosition = getRandomPosition();
    startGame();
}

function checkCollision(x1, y1, r1, x2, y2, r2) {
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance < r1 + r2;
}

function drawPlayerHP() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player HP: " + playerHP, -gameCanvas.width / 2 + 10, -gameCanvas.height / 2 + 30);
}

function drawNumber(ctx, num, x, y) {
    ctx.strokeStyle = "magenta";
    let length = 20;

    ctx.beginPath();
    switch(num) {
        case '0':
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x + length, y + 2*length);
            ctx.lineTo(x, y + 2*length);
            ctx.closePath();
            break;
        case '1':
            ctx.moveTo(x + length / 2, y);
            ctx.lineTo(x + length / 2, y + 2*length);
            break;
        case '2':
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x + length, y + length);
            ctx.lineTo(x, y + length);
            ctx.lineTo(x, y + 2*length);
            ctx.lineTo(x + length, y + 2*length);
            break;
        case '3':
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x + length, y + 2*length);
            ctx.lineTo(x, y + 2*length);
            ctx.moveTo(x, y + length);
            ctx.lineTo(x + length, y + length);
            break;
        case '4':
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + length);
            ctx.lineTo(x + length, y + length);
            ctx.moveTo(x + length, y);
            ctx.lineTo(x + length, y + 2*length);
            break;
        case '5':
            ctx.moveTo(x + length, y);
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + length);
            ctx.lineTo(x + length, y + length);
            ctx.lineTo(x + length, y + 2*length);
            ctx.lineTo(x, y + 2*length);
            break;
        case '6':
            ctx.moveTo(x + length, y + length);
            ctx.lineTo(x, y + length);
            ctx.lineTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x + length, y + 2*length);
            ctx.lineTo(x, y + 2*length);
            ctx.closePath();
            break;
        case '7':
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x + length, y + 2*length);
            break;
        case '8':
            ctx.moveTo(x, y);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x + length, y + 2*length);
            ctx.lineTo(x, y + 2*length);
            ctx.closePath();
            ctx.moveTo(x, y + length);
            ctx.lineTo(x + length, y + length);
            break;
        case '9':
            ctx.moveTo(x, y + length);
            ctx.lineTo(x + length, y + length);
            ctx.lineTo(x + length, y);
            ctx.lineTo(x, y);
            ctx.closePath();
            ctx.moveTo(x + length, y + length);
            ctx.lineTo(x + length, y + 2*length);
            break;
    }
    ctx.stroke();
}

function drawKilledCircles() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    let x = gameCanvas.width / 2 - 90;
    let y = -gameCanvas.height / 2 + 30;
    let numStr = killedCircles.toString();
    for (let i = 0; i < numStr.length; i++) {
        drawNumber(ctx, numStr[i], x + i * 30, y);
    }
}
