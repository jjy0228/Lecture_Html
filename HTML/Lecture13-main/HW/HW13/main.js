const triangle = document.getElementById('triangle');

function isPointInTriangle(x, y) {
    const rect = triangle.getBoundingClientRect();
    const triangleX = x - rect.left;
    const triangleY = y - rect.top;

    const b1 = sign(triangleX, triangleY, 0, 200, 100, 0) < 0.0;
    const b2 = sign(triangleX, triangleY, 100, 0, 200, 200) < 0.0;
    const b3 = sign(triangleX, triangleY, 200, 200, 0, 200) < 0.0;

    return ((b1 === b2) && (b2 === b3));
}

function sign(x1, y1, x2, y2, x3, y3) {
    return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
}

triangle.addEventListener('click', (event) => {
    if (isPointInTriangle(event.clientX, event.clientY)) {
        triangle.style.borderBottomColor = triangle.style.borderBottomColor === 'yellow' ? 'red' : 'yellow';
    }
    event.stopPropagation();
});

document.body.addEventListener('click', (event) => {
    if (!isPointInTriangle(event.clientX, event.clientY)) {
        triangle.style.borderBottomColor = 'yellow';
    }
});
