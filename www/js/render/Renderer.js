define(['math/Vectors', 'model/Line'], function (Vectors, Line) {
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
    function Renderer(screen, screenCtx, width, height, layerBucket, zoomLevel) {
        this.screen = screen;
        this.screenCtx = screenCtx;
        this.screenWidth = width;
        this.screenHeight = height;
        this.layerBucket = layerBucket;
        this.zoomLevel = zoomLevel;
    }

    /**
     * renders complete editor scene.
     */
    Renderer.prototype.drawScene = function () {
        this._clearScreen();

        this._setScaleFactor();

        var self = this;
        this.layerBucket.layers.forEach(function (layer) {
            if (!layer.isHidden()) {

                if (layer.type === 'rectangle') {
                    layer.items.forEach(function (item) {
                        if (!item.isHidden()) {
                            if (item.img) {
                                self.screenCtx.drawImage(item.img, item.xPoint() * self.scaleFactor,
                                        item.yPoint() * self.scaleFactor,
                                        item.width() * self.scaleFactor,
                                        item.height() * self.scaleFactor);
                            }

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
                                if (item instanceof Line)
                                    self._drawActiveLine(item.xPointA(), item.yPointA(), item.xPointB(), item.yPointB(), 'blue');
                                else
                                    self._drawActiveCurve(item.xPointA(), item.yPointA(), item.xPointB(), item.yPointB(),
                                        item.xPointC(), item.yPointC(), item.xPointD(), item.yPointD(), 'blue');
                            } else {
                                if (item instanceof Line)
                                    self._drawLine(item.xPointA(), item.yPointA(), item.xPointB(), item.yPointB());
                                else
                                    self._drawCurve(item.xPointA(), item.yPointA(), item.xPointB(), item.yPointB(),
                                        item.xPointC(), item.yPointC(), item.xPointD(), item.yPointD());
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

        this._drawRectangle(0, 0, this.screenWidth, this.screenHeight);
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
        this.screenCtx.moveTo(xPointA  * this.scaleFactor, yPointA  * this.scaleFactor);
        this.screenCtx.lineTo(xPointB  * this.scaleFactor, yPointB  * this.scaleFactor);
        this.screenCtx.stroke();
    };

    Renderer.prototype._drawCurve = function (xPointA, yPointA, xPointB, yPointB, xPointC, yPointC, xPointD, yPointD) {
        this.screenCtx.beginPath();
        this.screenCtx.moveTo(xPointA * this.scaleFactor, yPointA * this.scaleFactor);
        this.screenCtx.bezierCurveTo(xPointB * this.scaleFactor,
            yPointB * this.scaleFactor, xPointC * this.scaleFactor, yPointC * this.scaleFactor,
            xPointD * this.scaleFactor, yPointD * this.scaleFactor);
        this.screenCtx.stroke();
    };

    Renderer.prototype._drawActiveCurve = function (xPointA, yPointA, xPointB, yPointB, xPointC, yPointC, xPointD,
                                                    yPointD, color) {
        this.screenCtx.save();

        this._setColor(color);
        this._drawCurve(xPointA, yPointA, xPointB, yPointB, xPointC, yPointC, xPointD, yPointD);

        this._drawCirclePoint(xPointA, yPointA);
        this._drawCirclePoint(xPointB, yPointB);
        this._drawCirclePoint(xPointC, yPointC);
        this._drawCirclePoint(xPointD, yPointD);

        this._drawCirclePoint((xPointD - xPointA) / 2, (yPointD - yPointA) / 2);

        this.screenCtx.restore();
    };

    Renderer.prototype._drawActiveLine = function (xPointA, yPointA, xPointB, yPointB, color) {
        this.screenCtx.save();

        this._setColor(color);
        this._drawLine(xPointA, yPointA, xPointB, yPointB);
        this._drawCirclePoint(xPointA, yPointA);

        var vector = Vectors.createVector({xPoint: xPointA, yPoint: yPointA}, {xPoint: xPointB, yPoint: yPointB});
        var length = Vectors.magnitude(vector) / 4;
        var half = Vectors.magnitude(vector) / 2;
        var unitVector = Vectors.normalize(vector);

        this._drawCirclePoint(xPointA + length * unitVector.x, yPointA + length * unitVector.y);
        this._drawCirclePoint(xPointA + half * unitVector.x, yPointA + half * unitVector.y);
        this._drawCirclePoint(xPointB + length * -unitVector.x, yPointB + length * -unitVector.y);

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
        this.screenCtx.arc(xPoint * this.scaleFactor, yPoint * this.scaleFactor, radius * this.scaleFactor, 0, 2 * Math.PI, false);

        if (fillColor !== undefined) {
            this.screenCtx.fillStyle = fillColor;
            this.screenCtx.fill();
        }

        this.screenCtx.stroke();
    };

    Renderer.prototype._drawRectangle = function (xPoint, yPoint, width, height) {
        this.screenCtx.strokeRect(xPoint * this.scaleFactor - 0.5, yPoint * this.scaleFactor - 0.5, width * this.scaleFactor, height * this.scaleFactor);
    };

    Renderer.prototype._setColor = function (color) {
        this.screenCtx.strokeStyle = color;
    };

    Renderer.prototype.resize = function (width, height) {
        this.screen.width = width;
        this.screen.height = height;
        this.screenWidth = width;
        this.screenHeight = height;
    };

    Renderer.prototype._setScaleFactor = function () {
        this.scaleFactor = this.zoomLevel() / 100;
    };

    return Renderer;
});