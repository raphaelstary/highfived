define(['model/Line', 'model/Rectangle', 'model/Circle', 'model/Curve', 'input/PointerAction', 'input/ABRectangle',
    'math/Point', 'math/Line', 'math/Circle', 'math/Vectors'], function (Line, Rectangle, Circle, Curve, PointerAction,
    ABRectangle, Point, MathLine, MathCircle, Vectors) {

    /**
     * handles {MouseEvent}s when the 'edit' mode in the editor is on
     *
     * @param {Object} layerBucket                  the layer model for the whole editor with its items
     * @param {Object} collisionDetector            checks if mouse pointer clicked on a shape
     * @param {Object} actionInterpreter            checks/chooses if mouse pointer hit an 'action point'
     * @constructor
     */
    function ToolMouseHandler(layerBucket, collisionDetector, actionInterpreter) {
        if (layerBucket == null || layerBucket.layers == null)
            throw "Illegal argument: layer model not provided";

        this.layerBucket = layerBucket;
        this.collisionDetector = collisionDetector;
        this.actionInterpreter = actionInterpreter;

        this.counter = 0;
        this.activeShape = null;
        this.activeAction = PointerAction.NOTHING;
        this.state = State.CAN_START;
        this.oldItem = {};
    }

    /**
     * handles mouse down event
     *
     * invariant: {ToolMouseHandler.handleDown} can only be called after the {ToolMouseHandler} initialisation or
     * after {ToolMouseHandler.handleUp} was called.
     * (ToolMouseHandler.handleDown ToolMouseHandler.handleMove* ToolMouseHandler.handleDown)*
     *
     * @param {MouseEvent} event
     * @throws {string} Illegal argument: {@link ToolMouseHandler._validate}
     */
    ToolMouseHandler.prototype.handleDown = function (event) {
        this._validate(event);

        if (this.state !== State.CAN_START) {
            this._resolveWrongState();
            return;
        }

        this.state = State.STARTED;

        var wasShapeOrActionPointSelected = this._selectShapeOrStartAction(event);
        if (wasShapeOrActionPointSelected)
            return;

        this._createNewShape(event);
    };

    /**
     * handles mouse move event
     *
     * invariant: {ToolMouseHandler.handleMove} can only be called after a {ToolMouseHandler.handleDown} call
     * width 0..n following {ToolMouseHandler.handleMove} calls.
     * (ToolMouseHandler.handleDown ToolMouseHandler.handleMove* ToolMouseHandler.handleDown)*
     *
     * @param {MouseEvent} event
     * @throws {string} Illegal argument: {@link ToolMouseHandler._validate}
     */
    ToolMouseHandler.prototype.handleMove = function (event) {
        this._validate(event);

        if (this.state !== State.STARTED)
            return;

        this._resizeShape(event);
    };

    /**
     * handles mouse up event
     *
     * invariant: {ToolMouseHandler.handleUp} can only be called after a {ToolMouseHandler.handleDown} call
     * with 0..n following {ToolMouseHandler.handleMove} calls.
     * (ToolMouseHandler.handleDown ToolMouseHandler.handleMove* ToolMouseHandler.handleDown)*
     *
     * @param {MouseEvent} event
     * @throws {string} Illegal argument: {@link ToolMouseHandler._validate}
     */
    ToolMouseHandler.prototype.handleUp = function (event) {
        this._validate(event);

        if (this.state !== State.STARTED)
            return;

        this._resizeShape(event);

        if (this._isRect(this.activeShape))
            this._normalizeRect(this.activeShape);

        if (this._isRectFlat(this.activeShape) || this._isCircleFlat(this.activeShape) ||
            this._isLineFlat(this.activeShape))
            this._resolveWrongState();
        else
            this.state = State.CAN_START;
    };

    /**
     *
     * @param {MouseEvent} event
     * @throws {string} Illegal argument: when event is undefined or null or event.clientX or event.clientY
     *      are undefined or event.clientX and event.clientY are not positive numbers
     * @private
     */
    ToolMouseHandler.prototype._validate = function (event) {
        if (event == null || event.clientX == null || event.clientY == null ||
            event.clientX < 0 || event.clientY < 0 ||
            typeof event.clientX !== 'number' || typeof event.clientY !== 'number')
            throw "Illegal argument: " + event;
    };

    ToolMouseHandler.prototype._createNewShape = function (event) {
        if (this.layerBucket.activeLayer == null) {
            //todo test case
            this.state = State.CAN_START;
            return;
        }

        var item;
        if (this.layerBucket.activeLayer.type === RECTANGLE) {
            item = new Rectangle('unknown ' + this.counter++, event.clientX, event.clientY, 10, 10);

        } else if (this.layerBucket.activeLayer.type === LINE) {
            item = new Line('unknown ' + this.counter++, event.clientX, event.clientY, event.clientX, event.clientY)

        } else if (this.layerBucket.activeLayer.type === CIRCLE) {
            item = new Circle('unknown ' + this.counter++, event.clientX, event.clientY, 10, 10);

        } else {
            //todo test case
            this.state = State.CAN_START;
            return;
        }

        this._deactivateActiveItem();
        this._activateItem(item);

        this.activeAction = PointerAction.CREATE_NEW;

        this.layerBucket.activeLayer.items.push(item);
    };

    ToolMouseHandler.prototype._resolveWrongState = function () {
        if (this.activeAction === PointerAction.CREATE_NEW) {
            this._removeStartedShape();

        } else {
            if (this._isRect(this.activeShape))
                this._revertChangedRect();

            else if (this._isCircle(this.activeShape))
                this._revertChangedCircle();

            else if (this._isLine(this.activeShape))
                this._revertChangedLine();
        }

        this.state = State.CAN_START;
    };

    ToolMouseHandler.prototype._removeStartedShape = function () {
        var self = this;
        this.layerBucket.layers.forEach(function (layer) {
            if (layer.isActive())
                layer.items.remove(self.activeShape);
        });
    };

    ToolMouseHandler.prototype._revertChangedRect = function () {
        this.activeShape.xPoint(this.oldItem.xPoint);
        this.activeShape.yPoint(this.oldItem.yPoint);
        this.activeShape.width(this.oldItem.width);
        this.activeShape.height(this.oldItem.height);
    };

    ToolMouseHandler.prototype._revertChangedCircle = function () {
        this.activeShape.xPoint(this.oldItem.xPoint);
        this.activeShape.yPoint(this.oldItem.yPoint);
        this.activeShape.radius(this.oldItem.radius);
    };

    ToolMouseHandler.prototype._revertChangedLine = function () {
        this.activeShape.xPointA(this.oldItem.xPointA);
        this.activeShape.yPointA(this.oldItem.yPointA);
        this.activeShape.xPointB(this.oldItem.xPointB);
        this.activeShape.yPointB(this.oldItem.yPointB);
    };

    ToolMouseHandler.prototype._selectShapeOrStartAction = function (event) {
        var isPointerShapeCollision = false;
        var isPointerActionPointCollision = false;

        const OFF_SET = 2;
        var pointer = new ABRectangle(
            new Point(event.clientX - OFF_SET, event.clientY - OFF_SET),
            new Point(event.clientX + OFF_SET, event.clientY + OFF_SET)
        );

        var circlePointer = {
            center: {
                xPoint: event.clientX,
                yPoint: event.clientY
            },
            radius: OFF_SET
        };

        var self = this;
        this.layerBucket.layers.forEach(function (layer) {
            if (isPointerShapeCollision || isPointerActionPointCollision)
                return;

            layer.items.forEach(function (item) {
                if (isPointerShapeCollision || isPointerActionPointCollision || item.isHidden())
                    return;

                var isRect = self._isRect(item),
                    isCircle = self._isCircle(item),
                    isLine = self._isLine(item),
                    isCurve = self._isCurve(item);

                if (item.isActive()) {
                    var tempAction;

                    if (isRect) {
                        tempAction = self.actionInterpreter.interpretRect(pointer, item);

                    } else if (isCircle) {
                        tempAction = self.actionInterpreter.interpretCircle(circlePointer, self._getMathCircle(item));

                    } else if (isLine) {
                        tempAction = self.actionInterpreter.interpretLine(circlePointer, self._getMathLine(item));

                    } else if (isCurve) {
                        tempAction = self.actionInterpreter.interpretCurve(circlePointer, self._getMathCurve(item));
                    }

                    if (tempAction !== PointerAction.NOTHING) {
                        isPointerActionPointCollision = true;
                        self.activeShape = item;
                        self.activeAction = tempAction;

                        if (isRect) {
                            self._setOldRect(item);

                        } else if (isCircle) {
                            self._setOldCircle(item);

                        } else if (isLine) {
                            self._setOldLine(item);
                        }
                    }
                } else {

                    if (isRectCollision() || isCircleCollision() || isLineCollision()) {
                        self._deactivateActiveItem();
                        self._activateItem(item);
                        self.activeAction = PointerAction.NOTHING;

                        isPointerShapeCollision = true;
                    }

                    function isRectCollision() {
                        return isRect && self.collisionDetector.checkRect(pointer, self._getABRect(item));
                    }

                    function isCircleCollision() {
                        return isCircle && self.collisionDetector.checkCircle(self._getMathCircle(item), circlePointer);
                    }

                    function isLineCollision() {
                        return isLine && self.collisionDetector.checkLine(self._getMathLine(item), circlePointer);
                    }
                }
            });
        });

        return isPointerShapeCollision || isPointerActionPointCollision;
    };

    ToolMouseHandler.prototype._activateItem = function (item) {
        this.layerBucket.activeItem = item;
        item.isActive(true);
        item.isSelected(true);
        this.activeShape = item;
    };

    ToolMouseHandler.prototype._deactivateActiveItem = function () {
        if (this.layerBucket.activeItem != null) {
            this.layerBucket.activeItem.isActive(false);
        }
    };

    ToolMouseHandler.prototype._setOldRect = function (item) {
        this.oldItem.xPoint = item.xPoint();
        this.oldItem.yPoint = item.yPoint();
        this.oldItem.width = item.width();
        this.oldItem.height = item.height();
    };

    ToolMouseHandler.prototype._setOldCircle = function (item) {
        this.oldItem.xPoint = item.xPoint();
        this.oldItem.yPoint = item.yPoint();
        this.oldItem.radius = item.radius();
    };

    ToolMouseHandler.prototype._setOldLine = function (item) {
        this.oldItem.xPointA = item.xPointA();
        this.oldItem.yPointA = item.yPointA();
        this.oldItem.xPointB = item.xPointB();
        this.oldItem.yPointB = item.yPointB();
    };

    ToolMouseHandler.prototype._resizeShape = function (event) {
        if (this._isRect(this.activeShape)) {
            this._resizeRect(event);

        } else if (this._isLine(this.activeShape)) {
            this._resizeLine(event);

        } else if (this._isCircle(this.activeShape)) {
            this._resizeCircle(event);

        } else if (this._isCurve(this.activeShape)) {
            this._resizeCurve(event);
        }
    };

    ToolMouseHandler.prototype._resizeCircle = function (event) {
        if (this.activeAction === PointerAction.MOVE)
            this._changeCenterPoint(event);

        else if (this.activeAction === PointerAction.CREATE_NEW || this.activeAction === PointerAction.RESIZE_RADIUS)
            this._resizeRadius(event);
    };

    ToolMouseHandler.prototype._changeCenterPoint = function (event) {
        this.activeShape.xPoint(event.clientX);
        this.activeShape.yPoint(event.clientY);
    };

    ToolMouseHandler.prototype._resizeRadius = function (event) {
        var radius = Math.sqrt(Math.pow(event.clientX - this.activeShape.xPoint(), 2) +
            Math.pow(event.clientY - this.activeShape.yPoint(), 2));
        this.activeShape.radius(Math.floor(radius));
    };

    ToolMouseHandler.prototype._resizeLine = function (event) {
        if (this.activeAction === PointerAction.CHANGE_POINT_A)
            this._changePointA(event);

        else if (this.activeAction === PointerAction.CREATE_NEW || this.activeAction === PointerAction.CHANGE_POINT_B)
            this._changePointB(event);

        else if (this.activeAction === PointerAction.MOVE)
            this._moveLine(event);

        else if (this.activeAction === PointerAction.TRANSFORM_FROM_POINT_A)
            this._transformToCurveFromA(event);

        else if (this.activeAction === PointerAction.TRANSFORM_FROM_POINT_B)
            this._transformToCurveFromB(event);
    };

    ToolMouseHandler.prototype._resizeCurve = function (event) {
        if (this.activeAction === PointerAction.CHANGE_POINT_A)
            this._changePointA(event);

        else if (this.activeAction === PointerAction.CHANGE_POINT_B)
            this._changePointB(event);

        else if (this.activeAction === PointerAction.CHANGE_POINT_C)
            this._changePointC(event);

        else if (this.activeAction === PointerAction.CHANGE_POINT_D)
            this._changePointD(event);

        else if (this.activeAction === PointerAction.MOVE)
            this._moveCurve(event);
    };

    ToolMouseHandler.prototype._transformToCurveFromA = function (event) {
        var curve = new Curve(this.activeShape.name,
            this.activeShape.xPointA(), this.activeShape.yPointA(),
            event.clientX, event.clientY,
            this.activeShape.xPointB(), this.activeShape.yPointB(),
            this.activeShape.xPointB(), this.activeShape.yPointB());

        this._removeStartedShape();
        this.layerBucket.activeLayer.items.push(curve);
//        this._activateItem(curve)
    };

    ToolMouseHandler.prototype._transformToCurveFromB = function (event) {
        var curve = new Curve(this.activeShape.name,
            this.activeShape.xPointA(), this.activeShape.yPointA(),
            this.activeShape.xPointA(), this.activeShape.yPointA(),
            event.clientX, event.clientY,
            this.activeShape.xPointB(), this.activeShape.yPointB());

        this._removeStartedShape();
        this.layerBucket.activeLayer.items.push(curve);
//        this._activateItem(curve)
    };

    ToolMouseHandler.prototype._moveCurve = function (event) {
        var delta = {
            x: event.clientX - this.activeShape.xCenterPoint,
            y: event.clientY - this.activeShape.yCenterPoint
        };

        this.activeShape.xPointA(this.activeShape.xPointA() + delta.x);
        this.activeShape.yPointA(this.activeShape.yPointA() + delta.y);
        this.activeShape.xPointB(this.activeShape.xPointB() + delta.x);
        this.activeShape.yPointB(this.activeShape.yPointB() + delta.y);
        this.activeShape.xPointC(this.activeShape.xPointC() + delta.x);
        this.activeShape.yPointC(this.activeShape.yPointC() + delta.y);
        this.activeShape.xPointD(this.activeShape.xPointD() + delta.x);
        this.activeShape.yPointD(this.activeShape.yPointD() + delta.y);
    };

    ToolMouseHandler.prototype._moveLine = function (event) {
        var pointA = {
            xPoint: this.activeShape.xPointA(),
            yPoint: this.activeShape.yPointA()
        };
        var pointB = {
            xPoint: this.activeShape.xPointB(),
            yPoint: this.activeShape.yPointB()
        };

        var vector = Vectors.createVector(pointA, pointB);
        var magnitude = Vectors.magnitude(vector);
        var length = magnitude / 2;
        var unitVector = Vectors.normalize(vector);

        var centerPoint = {
            xPoint: pointA.xPoint + length * unitVector.x,
            yPoint: pointA.yPoint + length * unitVector.y
        };
        var delta = {
            x: event.clientX - centerPoint.xPoint,
            y: event.clientY - centerPoint.yPoint
        };

        this.activeShape.xPointA(pointA.xPoint + delta.x);
        this.activeShape.yPointA(pointA.yPoint + delta.y);
        this.activeShape.xPointB(pointB.xPoint + delta.x);
        this.activeShape.yPointB(pointB.yPoint + delta.y);
    };

    ToolMouseHandler.prototype._changePointA = function (event) {
        this.activeShape.xPointA(event.clientX);
        this.activeShape.yPointA(event.clientY);
    };

    ToolMouseHandler.prototype._changePointB = function (event) {
        this.activeShape.xPointB(event.clientX);
        this.activeShape.yPointB(event.clientY);
    };

    ToolMouseHandler.prototype._changePointC = function (event) {
        this.activeShape.xPointC(event.clientX);
        this.activeShape.yPointC(event.clientY);
    };

    ToolMouseHandler.prototype._changePointD = function (event) {
        this.activeShape.xPointD(event.clientX);
        this.activeShape.yPointD(event.clientY);
    };

    ToolMouseHandler.prototype._resizeRect = function (event) {
        if (this.activeAction === PointerAction.RESIZE_BOTTOM_AND_RIGHT ||
            this.activeAction === PointerAction.CREATE_NEW) {
            this._resizeRight(event);
            this._resizeBottom(event);

        } else if (this.activeAction === PointerAction.RESIZE_TOP_AND_LEFT) {
            this._resizeTop(event);
            this._resizeLeft(event);

        } else if (this.activeAction === PointerAction.RESIZE_TOP_AND_RIGHT) {
            this._resizeTop(event);
            this._resizeRight(event);

        } else if (this.activeAction === PointerAction.RESIZE_BOTTOM_AND_LEFT) {
            this._resizeLeft(event);
            this._resizeBottom(event);

        } else if (this.activeAction === PointerAction.RESIZE_RIGHT) {
            this._resizeRight(event);

        } else if (this.activeAction === PointerAction.RESIZE_BOTTOM) {
            this._resizeBottom(event);

        } else if (this.activeAction === PointerAction.RESIZE_LEFT) {
            this._resizeLeft(event);

        } else if (this.activeAction === PointerAction.RESIZE_TOP) {
            this._resizeTop(event);

        } else if (this.activeAction === PointerAction.MOVE) {
            this._move(event);
        }
    };

    ToolMouseHandler.prototype._resizeRight = function (event) {
        this.activeShape.width(event.clientX - this.activeShape.xPoint());
    };

    ToolMouseHandler.prototype._resizeBottom = function (event) {
        this.activeShape.height(event.clientY - this.activeShape.yPoint());
    };

    ToolMouseHandler.prototype._resizeTop = function (event) {
        this.activeShape.height(this.activeShape.height() - (event.clientY - this.activeShape.yPoint()));
        this.activeShape.yPoint(event.clientY);
    };

    ToolMouseHandler.prototype._resizeLeft = function (event) {
        this.activeShape.width(this.activeShape.width() - (event.clientX - this.activeShape.xPoint()));
        this.activeShape.xPoint(event.clientX);
    };

    ToolMouseHandler.prototype._move = function (event) {
        this.activeShape.xPoint(event.clientX - Math.floor(this.activeShape.width() / 2));
        this.activeShape.yPoint(event.clientY - Math.floor(this.activeShape.height() / 2));
    };

    ToolMouseHandler.prototype._normalizeRect = function (rect) {
        if (rect.width() < 0) {
            rect.xPoint(rect.xPoint() + rect.width());
            rect.width(Math.abs(rect.width()));
        }
        if (rect.height() < 0) {
            rect.yPoint(rect.yPoint() + rect.height());
            rect.height(Math.abs(rect.height()));
        }
    };

    ToolMouseHandler.prototype._getABRect = function (item) {
        return new ABRectangle(
            new Point(item.xPoint(), item.yPoint()),
            new Point(item.xPoint() + item.width(), item.yPoint() + item.height()));
    };

    ToolMouseHandler.prototype._getMathCircle = function (item) {
        return new MathCircle(new Point(item.xPoint(), item.yPoint()), item.radius());
    };

    ToolMouseHandler.prototype._getMathLine = function (item) {
        return new MathLine(new Point(item.xPointA(), item.yPointA()), new Point(item.xPointB(), item.yPointB()));
    };

    ToolMouseHandler.prototype._getMathCurve = function (item) {
        return null;
    };

    ToolMouseHandler.prototype._isRect = function (item) {
        return item instanceof Rectangle;
    };

    ToolMouseHandler.prototype._isCircle = function (item) {
        return item instanceof Circle;
    };

    ToolMouseHandler.prototype._isLine = function (item) {
        return item instanceof Line;
    };

    ToolMouseHandler.prototype._isCurve = function (item) {
        return item instanceof Curve;
    };

    ToolMouseHandler.prototype._isRectFlat = function (item) {
        return this._isRect(item) && (item.width() === 0 || item.height === 0);
    };

    ToolMouseHandler.prototype._isCircleFlat = function (item) {
        return this._isCircle(item) && item.radius() === 0;
    };

    ToolMouseHandler.prototype._isLineFlat = function (item) {
        return this._isLine(item) && item.xPointA() === item.xPointB() && item.yPointA() === item.yPointB();
    };

    /**
     * defines the inner state of {ToolMouseHandler}
     *
     * @enum {number}
     * @readonly
     * @private
     */
    var State = {
        CAN_START: -1,
        STARTED: 1
    };

    const RECTANGLE = 'rectangle';
    const LINE = 'line';
    const CIRCLE = 'circle';

    return ToolMouseHandler;
});