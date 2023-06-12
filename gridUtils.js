function drawGrid(ctx) {
    ctx.beginPath();
    for (let index = 0; index < Math.ceil(canvas.width / 20) + 1; index++) {
        ctx.moveTo(index * 20, 0);
        ctx.lineTo(index * 20, canvas.height);
    }
    for (let index = 0; index < Math.ceil(canvas.height / 20) + 1; index++) {
        ctx.moveTo(0, index * 20);
        ctx.lineTo(canvas.width, index * 20);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.stroke();

    ctx.beginPath();
    for (let index = 0; index < Math.ceil(canvas.width / (20 * 5)) + 1; index++) {
        ctx.moveTo(index * (20 * 5), 0);
        ctx.lineTo(index * (20 * 5), canvas.height);
    }
    for (let index = 0; index < Math.ceil(canvas.height / (20 * 5)) + 1; index++) {
        ctx.moveTo(0, index * (20 * 5));
        ctx.lineTo(canvas.width, index * (20 * 5));
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(0,0,0,0.4)";
    ctx.stroke();
}

export { drawGrid };
