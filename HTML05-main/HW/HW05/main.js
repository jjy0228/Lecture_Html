var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");

var sunRotationAngle = 0;
var earthOrbitAngle = 0; 
var earthRotationAngle = 0;
var moonOrbitAngle = 0;
var moonRotationAngle = 0;

draw();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); 
    sunRotationAngle += Math.PI / 100;
    ctx.rotate(sunRotationAngle);
    ctx.fillStyle = "Red";
    ctx.fillRect(-50, -50, 100, 100); 
    ctx.restore();

    earthOrbitAngle -= Math.PI / 200;
    var earthX = Math.cos(earthOrbitAngle) * 200 + canvas.width / 2;
    var earthY = Math.sin(earthOrbitAngle) * 200 + canvas.height / 2;

    ctx.save();
    ctx.translate(earthX, earthY);
    earthRotationAngle += Math.PI / 150;
    ctx.rotate(earthRotationAngle);
    ctx.fillStyle = "blue";
    ctx.fillRect(-25, -25, 50, 50); 
    ctx.restore();

    moonOrbitAngle += Math.PI / 100;
    var moonX = Math.cos(moonOrbitAngle) * 50 + earthX;
    var moonY = Math.sin(moonOrbitAngle) * 50 + earthY;

    ctx.save();
    ctx.translate(moonX, moonY);
    moonRotationAngle += Math.PI / 80;
    ctx.rotate(moonRotationAngle);
    ctx.fillStyle = "gray";
    ctx.fillRect(-15, -15, 30, 30); 
    ctx.restore();

    requestAnimationFrame(draw);
}
