class Node {
    constructor(title, color, x, y) {
        this.x = 20 * x;
        this.y = 20 * y;
        this.rectWidth = 20 * 9;
        this.rectHeight = 20 * 3;
        this.color = "#007ef3";
        this.headColor = "#003ec4";
        this.borderColor = "#001136";
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.title = "On Player Join";
        if (color === "red") {
            this.color = "#f30400";
            this.headColor = "#b60000";
            this.borderColor = "#460000";
        }
        this.isGlowing = false;
    }

    addInput(name, type) {}
}

export default Node;
