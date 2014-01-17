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

                if (layer.type === 'rectangle') {
                    layer.items.forEach(function (item) {
                        if (!item.isHidden()) {
                            if (item.isActive()) {
                                self._drawActiveRectangle(item.xPoint(), item.yPoint(), item.width(), item.height(), 'red');
                            } else {
                                self._drawRectangle(item.xPoint(), item.yPoint(), item.width(), item.height());
                            }
                        }
                    });

                } else if (layer.type === 'line') {
                    layer.items.forEach(function (item) {
                        if (!item.isHidden()) {
                            if (item.isActive()) {
                                self._drawActiveLine(item.xPointA(), item.yPointA(), item.xPointB(), item.yPointB(), 'blue');
                            } else {
                                self._drawLine(item.xPointA(), item.yPointA(), item.xPointB(), item.yPointB());
                            }
                        }
                    });

                } else if (layer.type === 'circle') {
                    layer.items.forEach(function (item) {
                        if (!item.isHidden()) {
                            if (item.isActive()) {
                                self._drawActiveCircle(item.xPoint(), item.yPoint(), item.radius(), 'green');
                            } else {
                                self._drawCircle(item.xPoint(), item.yPoint(), item.radius());
                            }
                        }
                    });
                }
            }
        });
    };

    Renderer.prototype._drawActiveCircle = function (xPoint, yPoint, radius, color) {
        this.screenCtx.save();

        this._setColor(color);
        this._drawCircle(xPoint, yPoint, radius);
        this._drawCirclePoint(xPoint, yPoint);
        this._drawCirclePoint(xPoint + radius, yPoint);

        this.screenCtx.restore();
    };

    Renderer.prototype._drawLine = function (xPointA, yPointA, xPointB, yPointB) {
        this.screenCtx.beginPath();
        this.screenCtx.moveTo(xPointA, yPointA);
        this.screenCtx.lineTo(xPointB, yPointB);
        this.screenCtx.stroke();
    };

    Renderer.prototype._drawActiveLine = function (xPointA, yPointA, xPointB, yPointB, color) {
        this.screenCtx.save();

        this._setColor(color);
        this._drawLine(xPointA, yPointA, xPointB, yPointB);
        this._drawCirclePoint(xPointA, yPointA);
        this._drawCirclePoint(xPointB, yPointB);

        this.screenCtx.restore();
    };

    Renderer.prototype._clearScreen = function () {
        this.screenCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    };

    Renderer.prototype._drawActiveRectangle = function (xPoint, yPoint, width, height, color) {
        this.screenCtx.save();

        this._setColor(color);
        this._drawRectangle(xPoint, yPoint, width, height);
        this._drawCirclePoint(xPoint, yPoint);
        this._drawCirclePoint(xPoint + width / 2, yPoint);
        this._drawCirclePoint(xPoint + width, yPoint);
        this._drawCirclePoint(xPoint, yPoint + height / 2);
        this._drawCirclePoint(xPoint, yPoint + height);
        this._drawCirclePoint(xPoint + width, yPoint + height / 2);
        this._drawCirclePoint(xPoint + width / 2, yPoint + height);
        this._drawCirclePoint(xPoint + width / 2, yPoint + height / 2);
        this._drawCirclePoint(xPoint + width, yPoint + height);

        this.screenCtx.restore();
    };

    Renderer.prototype._drawCirclePoint = function (xPoint, yPoint) {
        this._drawCircle(xPoint, yPoint, 2, 'white');
    };

    Renderer.prototype._drawCircle = function (xPoint, yPoint, radius, fillColor) {
        this.screenCtx.beginPath();
        this.screenCtx.arc(xPoint, yPoint, radius, 0, 2 * Math.PI, false);

        if (fillColor !== undefined) {
            this.screenCtx.fillStyle = fillColor;
            this.screenCtx.fill();
        }

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