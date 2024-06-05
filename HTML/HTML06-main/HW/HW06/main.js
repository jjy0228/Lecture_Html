var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 600;

class HeartObject {
    constructor(color, size, positionX, positionY, velocityX, velocityY, rotationSpeed) {
        this.color = color;
        this.size = size;
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.rotationSpeed = rotationSpeed;
        this.rotation = 0;
    }

    draw() {
        ctx.save();
        ctx.translate(this.positionX, this.positionY);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        var x, y, theta;
        for (var i = 0; i < 50; i++) {
            theta = i * (Math.PI * 2) / 50;
            x = this.size * 16 * Math.pow(Math.sin(theta), 3);
            y = -this.size * (13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta));
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        this.positionX += this.velocityX;
        this.positionY += this.velocityY;
        this.rotation += this.rotationSpeed;
    }
}

var hearts = [];
var mousePosition = { x: canvas.width / 2, y: canvas.height / 2 };

canvas.addEventListener('mousemove', function(e) {
    mousePosition.x = e.clientX;
    mousePosition.y = e.clientY;
});

function createHeart() {
    if (hearts.length < 100) {
        var color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        var size = Math.random() * 5 + 2; 
        var velocityX = (Math.random() - 0.5) * 4;
        var velocityY = (Math.random() - 0.5) * 4;
        var rotationSpeed = (Math.random() - 0.5) * 0.1;
        var heart = new HeartObject(color, size, mousePosition.x, mousePosition.y, velocityX, velocityY, rotationSpeed);
        hearts.push(heart);
    }
    setTimeout(createHeart, 200); 
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((heart, index) => {
        heart.draw();
    });
}

createHeart();
animate();
