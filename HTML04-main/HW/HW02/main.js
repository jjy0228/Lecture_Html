// canvas에 숫자 그리기
var canvas = document.getElementById("GameScreenCanvas");
var ctx = canvas.getContext("2d");

var studentID = "202027057"; // 예시 학번
drawStudentID(ctx, studentID, 10, 50); // 숫자 그리기 시작 위치
drawNum(studentID);    

function drawNumber(ctx, num, x, y) {
    // 선의 색상을 마젠타색으로 설정
    ctx.strokeStyle = "magenta";

    // 기본 선의 길이
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

function drawStudentID(ctx, studentID, startX, startY) {
    let spacing = 30; // 숫자 사이 간격

    for (let i = 0; i < studentID.length; i++) {
        let num = studentID[i];
        drawNumber(ctx, num, startX + (i * spacing), startY);
    }
}