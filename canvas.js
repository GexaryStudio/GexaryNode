import Node from "./node.js";
import { drawGrid } from "./gridUtils.js";

const generateBtn = document.getElementById("generate-button");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const w = 100 * 5; // Canvas Width
const h = 100 * 3; // Canvas Height
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
function resizeCanvas() {
    const pixelRatio = Math.ceil(window.devicePixelRatio || 1); // Pixel Ratio

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    canvas.width = w * pixelRatio;
    canvas.height = h * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

    // clear the canvas
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function removeShadow() {
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "rgba(0,0,0,0)";
        ctx.shadowBlur = 0;
    }

    function setShadow(offsetX, offsetY, color, blur) {
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;
        ctx.shadowColor = color;
        ctx.shadowBlur = blur;
    }

    // Liste des rects
    let rects = [];
    rects.push(new Node("Hello World", "", 5, 0));
    rects.push(new Node("Hello World", "red", 5, 5));

    let points = [
        { x: rects[0].x + 150, y: rects[0].y + 30 },
        { x: rects[1].x + 10, y: rects[1].y + 30 },
    ];
    function drawConnectors() {
        points = [
            { x: rects[0].x + 150, y: rects[0].y + 30 },
            { x: rects[1].x + 10, y: rects[1].y + 30 },
        ];
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        if (points[1].x >= points[0].x) {
            let halfDistance = (points[1].x - points[0].x) / 2;
            // halfDistance = Math.max(halfDistance, 60);
            ctx.bezierCurveTo(
                halfDistance + points[0].x,
                points[0].y,
                points[1].x - halfDistance,
                points[1].y,
                points[1].x,
                points[1].y
            );
        } else {
            let halfDistance = points[0].x - points[1].x;
            // halfDistance = Math.max(halfDistance, 60);
            ctx.bezierCurveTo(
                points[0].x + halfDistance,
                points[0].y,
                points[1].x - halfDistance,
                points[1].y,
                points[1].x,
                points[1].y
            );
        }

        ctx.lineWidth = 3;
        ctx.strokeStyle = "#00e11e";
        ctx.stroke();
    }
    function drawCircles() {
        ctx.fillStyle = "#00e11e";
        // ctx.lineWidth = 2;
        // ctx.strokeStyle = "#005a1e";
        points.forEach((point) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI, false);
            ctx.fill();
            // ctx.stroke();
        });
    }
    // Fonction pour dessiner les rects
    function drawrects() {
        clear();
        ctx.fillStyle = "#343434";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx);

        drawConnectors();

        for (var i = 0; i < rects.length; i++) {
            var rect = rects[i];

            if (rect.isGlowing) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#ffae00";
                ctx.lineWidth = 6;
                ctx.roundRect(rect.x, rect.y, rect.rectWidth, rect.rectHeight, 10);
                ctx.stroke();
            }

            ctx.fillStyle = rect.color;
            ctx.beginPath();
            ctx.strokeStyle = rect.borderColor;
            ctx.lineWidth = 2;

            if (rect.isGlowing) {
                setShadow(0, 0, "#ffae00", 32);
            }

            ctx.roundRect(rect.x, rect.y, rect.rectWidth, rect.rectHeight, 10);
            ctx.fill();
            removeShadow();

            ctx.beginPath();
            ctx.fillStyle = rect.headColor;
            ctx.roundRect(rect.x, rect.y, rect.rectWidth, 20, [10, 10, 0, 0]);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.font = "16px sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            setShadow(0, 4, "rgba(0,0,0,0.4)", 2);
            ctx.fillText(rect.title, rect.x + 80, rect.y + 12);
            removeShadow();

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.roundRect(rect.x, rect.y, rect.rectWidth, rect.rectHeight, 10);
            ctx.stroke();
        }
        drawCircles();
        drawSelection();
    }

    // Fonction pour vérifier si la position de la souris est sur un rect
    function isMouseOverrect(mouseX, mouseY, rect) {
        return mouseX >= rect.x && mouseX <= rect.x + rect.rectWidth && mouseY >= rect.y && mouseY <= rect.y + rect.rectHeight;
    }
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: parseInt(e.clientX - rect.left),
            y: parseInt(e.clientY - rect.top),
        };
    }
    function setCursor(value) {
        switch (value) {
            case 0:
                canvas.style.cursor = "default";
                break;
            case 1:
                canvas.style.cursor = "pointer";
                break;
            case 2:
                canvas.style.cursor = "all-scroll";
                break;
        }
    }

    function doOverlap(square1, square2) {
        if (
            square1.x < square2.x + square2.rectWidth &&
            square1.x + square1.rectWidth > square2.x &&
            square1.y < square2.y + square2.rectHeight &&
            square1.y + square1.rectHeight > square2.y
        ) {
            return true; // Les carrés se superposent
        } else {
            return false; // Les carrés ne se superposent pas
        }
    }
    let lineDashAnim = undefined;
    let offset = 0;
    function drawSelection() {
        if (isSelecting) {
            ctx.fillStyle = "rgba(255,255,255,0.1)";
            ctx.beginPath();
            ctx.roundRect(
                parseInt(selectionRect.x),
                parseInt(selectionRect.y),
                parseInt(selectionRect.rectWidth),
                parseInt(selectionRect.rectHeight),
                4
            );
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255,255,255,0.6)";
            ctx.lineDashOffset = offset;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            rects.forEach((rect) => {
                if (doOverlap(selectionRect, rect)) {
                    rect.isGlowing = true;
                }
            });
        }
    }

    let nodeDragging = false;
    let isSelecting = false;
    let selectStart = { x: 0, y: 0 };
    let selectionRect = { x: 0, y: 0, rectWidth: 0, rectHeight: 0 };

    // Gestionnaire d'événement lorsque la souris est enfoncée
    canvas.addEventListener("mousedown", function (e) {
        const mousePos = getMousePos(e);
        if (e.button === 0) {
            for (var i = 0; i < rects.length; i++) {
                var rect = rects[i];

                if (isMouseOverrect(mousePos.x, mousePos.y, rect) || rect.isGlowing) {
                    nodeDragging = true;
                    setCursor(2);
                    rect.isDragging = true;
                    rect.isGlowing = true;
                    rect.offsetX = mousePos.x - rect.x;
                    rect.offsetY = mousePos.y - rect.y;
                    drawrects();
                }
            }
            if (!nodeDragging) {
                isSelecting = true;
                selectStart = mousePos;
                selectionRect = { x: mousePos.x, y: mousePos.y, width: 0, height: 0 };
                lineDashAnim = setInterval(() => {
                    offset++;
                    if (offset > 16) {
                        offset = 0;
                    }
                    drawrects();
                }, 20);
            }
        }
    });

    // Gestionnaire d'événement lorsque la souris est déplacée
    canvas.addEventListener("mousemove", function (e) {
        const mousePos = getMousePos(e);

        if (isSelecting) {
            selectionRect.x = Math.min(selectStart.x, mousePos.x);
            selectionRect.y = Math.min(selectStart.y, mousePos.y);
            selectionRect.rectWidth = Math.abs(selectStart.x - mousePos.x);
            selectionRect.rectHeight = Math.abs(selectStart.y - mousePos.y);
            window.requestAnimationFrame(drawrects);
        }

        let isNodeDragging = false;
        rects.forEach((rect) => {
            if (rect.isDragging) {
                const mouseGridPosX = Math.floor((mousePos.x - rect.offsetX) / 20) * 20;
                const mouseGridPosY = Math.floor((mousePos.y - rect.offsetY) / 20) * 20;

                if (mouseGridPosY != rect.y || mouseGridPosX != rect.x) {
                    rect.x = mouseGridPosX;
                    rect.y = mouseGridPosY;
                    // rect.x = Math.max(0, Math.min(rect.x, w - rect.rectWidth));
                    // rect.y = Math.max(0, Math.min(rect.y, h - rect.rectHeight));

                    window.requestAnimationFrame(drawrects);
                }
            } else if (isMouseOverrect(mousePos.x, mousePos.y, rect) && !nodeDragging) {
                isNodeDragging = true;
            }
        });
        if (isNodeDragging) {
            setCursor(1);
        } else if (nodeDragging) {
            setCursor(2);
        } else {
            setCursor(0);
        }
    });

    // Gestionnaire d'événement lorsque la souris est relâchée
    canvas.addEventListener("mouseup", function (e) {
        if (e.button === 0) {
            if (nodeDragging) {
                nodeDragging = false;
                setCursor(0);
                rects.forEach((rect) => {
                    rect.isDragging = false;
                    rect.isGlowing = false;
                });
                window.requestAnimationFrame(drawrects);
            }
            if (isSelecting) {
                isSelecting = false;
                clearInterval(lineDashAnim);
                window.requestAnimationFrame(drawrects);
            }
        }
    });

    // Dessine les rects initiaux
    drawrects();
}

// window.addEventListener("resize", resizeCanvas, false);
resizeCanvas();
document.onkeydown = (event) => {
    if (event.ctrlKey && event.key === "b") {
        const image = canvas.toDataURL("image/png", 1.0);
        console.log(image);
        document.getElementById("image").src = image;
    }
};
generateBtn.addEventListener("click", function (e) {
    const image = canvas.toDataURL("image/png", 1.0);
    console.log(image);
    document.getElementById("image").src = image;
});
