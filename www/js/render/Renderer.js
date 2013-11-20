define(function () {
    /**
     * main editor render class
     *
     * @param {HTMLCanvasElement} screen                dom canvas called screen
     * @param {CanvasRenderingContext2D} screenCtx      context of screen
     * @param {number} width                            screen html element's width
     * @param {number} height                           screen html element's height
     * @param {LayerBucket} layerBucket                           the layer model for the whole editor with its items
     * @constructor
     */
    function Renderer(screen, screenCtx, width, height, layerBucket) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.screenWidth = width;
        this.screenHeight = height;
        this.layerBucket = layerBucket;
    }

    /**
     * renders complete editor scene.
     */
    Renderer.prototype.drawScene = function () {
        this._clearScreen();

        var self = this;
        this.layerBucket.layers.forEach(function (layer) {
            if (!layer.isHidden()) {
                layer.items.forEach(function (item) {

                    if (!item.isHidden()) {
                        if (item.isActive()) {
                            self._drawActiveRectangle(item.xPoint(), item.yPoint(), item.width(), item.height(), 'red');
                        } else {
                            self._drawRectangle(item.xPoint(), item.yPoint(), item.width(), item.height());
                        }
                    }
                });
            }
        });
    };

    Renderer.prototype._clearScreen = function () {
        this.screenCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    };

    Renderer.prototype._drawActiveRectangle = function (xPoint, yPoint, width, height, color) {
        this.screenCtx.save();

        this._setColor(color);
        this._drawRectangle(xPoint, yPoint, width, height);
        this._drawCircle(xPoint, yPoint);
        this._drawCircle(xPoint + width / 2, yPoint);
        this._drawCircle(xPoint + width, yPoint);
        this._drawCircle(xPoint, yPoint + height / 2);
        this._drawCircle(xPoint, yPoint + height);
        this._drawCircle(xPoint + width, yPoint + height / 2);
        this._drawCircle(xPoint + width / 2, yPoint + height);
        this._drawCircle(xPoint + width / 2, yPoint + height / 2);
        this._drawCircle(xPoint + width, yPoint + height);

        this.screenCtx.restore();
    };

    Renderer.prototype._drawCircle = function (xPoint, yPoint) {
        this.screenCtx.beginPath();
        this.screenCtx.arc(xPoint, yPoint, 2, 0, 2 * Math.PI, false);
        this.screenCtx.fillStyle = 'white';
        this.screenCtx.fill();
        this.screenCtx.stroke();
    };

    Renderer.prototype._drawRectangle = function (xPoint, yPoint, width, height) {
        this.screenCtx.strokeRect(xPoint - 0.5, yPoint - 0.5, width, height);
    };

    Renderer.prototype._setColor = function (color) {
        this.screenCtx.strokeStyle = color;
    };

    return Renderer;
});