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
    function ToolMouseHandler(layerBucket, collisionDetector, actionInterpreter, zoomLevel) {
        if (layerBucket == null || layerBucket.layers == null)
            throw "Illegal argument: layer model not provided";

        this.layerBucket = layerBucket;
        this.collisionDetector = collisionDetector;
        this.actionInterpreter = actionInterpreter;

        this.counter = 0;
        this.activeAction = PointerAction.NOTHING;
        this.state = State.CAN_START;
        this.oldItem = {};

        this.zoomLevel = zoomLevel;
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

        var scaleFactor = this._getScaleFactor(),
            clientX = this._calcClientX(event.clientX, scaleFactor),
            clientY = this._calcClientY(event.clientY, scaleFactor);

        var wasShapeOrActionPointSelected = this._selectShapeOrStartAction(clientX, clientY);
        if (wasShapeOrActionPointSelected)
            return;

        this._createNewShape(clientX, clientY);
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

        var scaleFactor = this._getScaleFactor(),
            clientX = this._calcClientX(event.clientX, scaleFactor),
            clientY = this._calcClientY(event.clientY, scaleFactor);

        this._resizeShape(clientX, clientY);
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

        var scaleFactor = this._getScaleFactor(),
            clientX = this._calcClientX(event.clientX, scaleFactor),
            clientY = this._calcClientY(event.clientY, scaleFactor);

        this._resizeShape(clientX, clientY);

        if (this._isRect(this.layerBucket.activeItem))
            this._normalizeRect(this.layerBucket.activeItem);

        if (this._isRectFlat(this.layerBucket.activeItem) || this._isCircleFlat(this.layerBucket.activeItem) ||
            this._isLineFlat(this.layerBucket.activeItem))
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

    ToolMouseHandler.prototype._getScaleFactor = function () {
        return this.zoomLevel() / 100;
    };

    ToolMouseHandler.prototype._calcClientX = function (clientX, scaleFactor) {
        return Math.floor(clientX / scaleFactor);
    };

    ToolMouseHandler.prototype._calcClientY = function (clientY, scaleFactor) {
        return Math.floor(clientY / scaleFactor);
    };

    ToolMouseHandler.prototype._createNewShape = function (clientX, clientY) {
        if (this.layerBucket.activeLayer == null) {
            //todo test case
            this.state = State.CAN_START;
            return;
        }

        var item;
        if (this.layerBucket.activeLayer.type === RECTANGLE) {
            item = new Rectangle('unknown ' + this.counter++, clientX, clientY, 10, 10);

        } else if (this.layerBucket.activeLayer.type === LINE) {
            item = new Line('unknown ' + this.counter++, clientX, clientY, clientX, clientY)

        } else if (this.layerBucket.activeLayer.type === CIRCLE) {
            item = new Circle('unknown ' + this.counter++, clientX, clientY, 10, 10);

        } else {
            //todo test case
            this.state = State.CAN_START;
            return;
        }

        this.layerBucket.deactivateActiveItem();
        this.layerBucket.activateItem(item);

        this.activeAction = PointerAction.CREATE_NEW;

        this.layerBucket.activeLayer.items.push(item);
    };

    ToolMouseHandler.prototype._resolveWrongState = function () {
        if (this.activeAction === PointerAction.CREATE_NEW) {
            this._removeStartedShape();

        } else {
            if (this._isRect(this.layerBucket.activeItem))
                this._revertChangedRect();

            else if (this._isCircle(this.layerBucket.activeItem))
                this._revertChangedCircle();

            else if (this._isLine(this.layerBucket.activeItem))
                this._revertChangedLine();
        }

        this.state = State.CAN_START;
    };

    ToolMouseHandler.prototype._removeStartedShape = function () {
        var self = this;
        this.layerBucket.layers.forEach(function (layer) {
            if (layer.isActive())
                layer.items.remove(self.layerBucket.activeItem);
        });
    };

    ToolMouseHandler.prototype._revertChangedRect = function () {
        this.layerBucket.activeItem.xPoint(this.oldItem.xPoint);
        this.layerBucket.activeItem.yPoint(this.oldItem.yPoint);
        this.layerBucket.activeItem.width(this.oldItem.width);
        this.layerBucket.activeItem.height(this.oldItem.height);
    };

    ToolMouseHandler.prototype._revertChangedCircle = function () {
        this.layerBucket.activeItem.xPoint(this.oldItem.xPoint);
        this.layerBucket.activeItem.yPoint(this.oldItem.yPoint);
        this.layerBucket.activeItem.radius(this.oldItem.radius);
    };

    ToolMouseHandler.prototype._revertChangedLine = function () {
        this.layerBucket.activeItem.xPointA(this.oldItem.xPointA);
        this.layerBucket.activeItem.yPointA(this.oldItem.yPointA);
        this.layerBucket.activeItem.xPointB(this.oldItem.xPointB);
        this.layerBucket.activeItem.yPointB(this.oldItem.yPointB);
    };

    ToolMouseHandler.prototype._selectShapeOrStartAction = function (clientX, clientY) {
        var isPointerShapeCollision = false;
        var isPointerActionPointCollision = false;

        const OFF_SET = 2;
        var pointer = new ABRectangle(
            new Point(clientX - OFF_SET, clientY - OFF_SET),
            new Point(clientX + OFF_SET, clientY + OFF_SET)
        );

        var circlePointer = {
            center: {
                xPoint: clientX,
                yPoint: clientY
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
                        self.layerBucket.activeItem = item;
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
                        self.layerBucket.deactivateActiveItem();
                        self.layerBucket.activateItem(item);
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

    ToolMouseHandler.prototype._resizeShape = function (clientX, clientY) {

        if (this._isRect(this.layerBucket.activeItem)) {
            this._resizeRect(clientX, clientY);

        } else if (this._isLine(this.layerBucket.activeItem)) {
            this._resizeLine(clientX, clientY);

        } else if (this._isCircle(this.layerBucket.activeItem)) {
            this._resizeCircle(clientX, clientY);

        } else if (this._isCurve(this.layerBucket.activeItem)) {
            this._resizeCurve(clientX, clientY);
        }
    };

    ToolMouseHandler.prototype._resizeCircle = function (clientX, clientY) {
        if (this.activeAction === PointerAction.MOVE)
            this._changeCenterPoint(clientX, clientY);

        else if (this.activeAction === PointerAction.CREATE_NEW || this.activeAction === PointerAction.RESIZE_RADIUS)
            this._resizeRadius(clientX, clientY);
    };

    ToolMouseHandler.prototype._changeCenterPoint = function (clientX, clientY) {
        this.layerBucket.activeItem.xPoint(clientX);
        this.layerBucket.activeItem.yPoint(clientY);
    };

    ToolMouseHandler.prototype._resizeRadius = function (clientX, clientY) {
        var radius = Math.sqrt(Math.pow(clientX - this.layerBucket.activeItem.xPoint(), 2) +
            Math.pow(clientY - this.layerBucket.activeItem.yPoint(), 2));
        this.layerBucket.activeItem.radius(Math.floor(radius));
    };

    ToolMouseHandler.prototype._resizeLine = function (clientX, clientY) {
        if (this.activeAction === PointerAction.CHANGE_POINT_A)
            this._changePointA(clientX, clientY);

        else if (this.activeAction === PointerAction.CREATE_NEW || this.activeAction === PointerAction.CHANGE_POINT_B)
            this._changePointB(clientX, clientY);

        else if (this.activeAction === PointerAction.MOVE)
            this._moveLine(clientX, clientY);

        else if (this.activeAction === PointerAction.TRANSFORM_FROM_POINT_A)
            this._transformToCurveFromA(clientX, clientY);

        else if (this.activeAction === PointerAction.TRANSFORM_FROM_POINT_B)
            this._transformToCurveFromB(clientX, clientY);
    };

    ToolMouseHandler.prototype._resizeCurve = function (clientX, clientY) {
        if (this.activeAction === PointerAction.CHANGE_POINT_A)
            this._changePointA(clientX, clientY);

        else if (this.activeAction === PointerAction.CHANGE_POINT_B)
            this._changePointB(clientX, clientY);

        else if (this.activeAction === PointerAction.CHANGE_POINT_C)
            this._changePointC(clientX, clientY);

        else if (this.activeAction === PointerAction.CHANGE_POINT_D)
            this._changePointD(clientX, clientY);

        else if (this.activeAction === PointerAction.MOVE)
            this._moveCurve(clientX, clientY);
    };

    ToolMouseHandler.prototype._transformToCurveFromA = function (clientX, clientY) {
        var curve = new Curve(this.layerBucket.activeItem.name,
            this.layerBucket.activeItem.xPointA(), this.layerBucket.activeItem.yPointA(),
            clientX, clientY,
            this.layerBucket.activeItem.xPointB(), this.layerBucket.activeItem.yPointB(),
            this.layerBucket.activeItem.xPointB(), this.layerBucket.activeItem.yPointB());

        this._removeStartedShape();
        this.layerBucket.activeLayer.items.push(curve);
//        this.layerBucket.activateItem(curve)
    };

    ToolMouseHandler.prototype._transformToCurveFromB = function (clientX, clientY) {
        var curve = new Curve(this.layerBucket.activeItem.name,
            this.layerBucket.activeItem.xPointA(), this.layerBucket.activeItem.yPointA(),
            this.layerBucket.activeItem.xPointA(), this.layerBucket.activeItem.yPointA(),
            clientX, clientY,
            this.layerBucket.activeItem.xPointB(), this.layerBucket.activeItem.yPointB());

        this._removeStartedShape();
        this.layerBucket.activeLayer.items.push(curve);
//        this.layerBucket.activateItem(curve)
    };

    ToolMouseHandler.prototype._moveCurve = function (clientX, clientY) {
        var delta = {
            x: clientX - this.layerBucket.activeItem.xCenterPoint,
            y: clientY - this.layerBucket.activeItem.yCenterPoint
        };

        this.layerBucket.activeItem.xPointA(this.layerBucket.activeItem.xPointA() + delta.x);
        this.layerBucket.activeItem.yPointA(this.layerBucket.activeItem.yPointA() + delta.y);
        this.layerBucket.activeItem.xPointB(this.layerBucket.activeItem.xPointB() + delta.x);
        this.layerBucket.activeItem.yPointB(this.layerBucket.activeItem.yPointB() + delta.y);
        this.layerBucket.activeItem.xPointC(this.layerBucket.activeItem.xPointC() + delta.x);
        this.layerBucket.activeItem.yPointC(this.layerBucket.activeItem.yPointC() + delta.y);
        this.layerBucket.activeItem.xPointD(this.layerBucket.activeItem.xPointD() + delta.x);
        this.layerBucket.activeItem.yPointD(this.layerBucket.activeItem.yPointD() + delta.y);
    };

    ToolMouseHandler.prototype._moveLine = function (clientX, clientY) {
        var pointA = {
            xPoint: this.layerBucket.activeItem.xPointA(),
            yPoint: this.layerBucket.activeItem.yPointA()
        };
        var pointB = {
            xPoint: this.layerBucket.activeItem.xPointB(),
            yPoint: this.layerBucket.activeItem.yPointB()
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
            x: clientX - centerPoint.xPoint,
            y: clientY - centerPoint.yPoint
        };

        this.layerBucket.activeItem.xPointA(pointA.xPoint + delta.x);
        this.layerBucket.activeItem.yPointA(pointA.yPoint + delta.y);
        this.layerBucket.activeItem.xPointB(pointB.xPoint + delta.x);
        this.layerBucket.activeItem.yPointB(pointB.yPoint + delta.y);
    };

    ToolMouseHandler.prototype._changePointA = function (clientX, clientY) {
        this.layerBucket.activeItem.xPointA(clientX);
        this.layerBucket.activeItem.yPointA(clientY);
    };

    ToolMouseHandler.prototype._changePointB = function (clientX, clientY) {
        this.layerBucket.activeItem.xPointB(clientX);
        this.layerBucket.activeItem.yPointB(clientY);
    };

    ToolMouseHandler.prototype._changePointC = function (clientX, clientY) {
        this.layerBucket.activeItem.xPointC(clientX);
        this.layerBucket.activeItem.yPointC(clientY);
    };

    ToolMouseHandler.prototype._changePointD = function (clientX, clientY) {
        this.layerBucket.activeItem.xPointD(clientX);
        this.layerBucket.activeItem.yPointD(clientY);
    };

    ToolMouseHandler.prototype._resizeRect = function (clientX, clientY) {
        if (this.activeAction === PointerAction.RESIZE_BOTTOM_AND_RIGHT ||
            this.activeAction === PointerAction.CREATE_NEW) {
            this._resizeRight(clientX, clientY);
            this._resizeBottom(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_TOP_AND_LEFT) {
            this._resizeTop(clientX, clientY);
            this._resizeLeft(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_TOP_AND_RIGHT) {
            this._resizeTop(clientX, clientY);
            this._resizeRight(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_BOTTOM_AND_LEFT) {
            this._resizeLeft(clientX, clientY);
            this._resizeBottom(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_RIGHT) {
            this._resizeRight(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_BOTTOM) {
            this._resizeBottom(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_LEFT) {
            this._resizeLeft(clientX, clientY);

        } else if (this.activeAction === PointerAction.RESIZE_TOP) {
            this._resizeTop(clientX, clientY);

        } else if (this.activeAction === PointerAction.MOVE) {
            this._move(clientX, clientY);
        }
    };

    ToolMouseHandler.prototype._resizeRight = function (clientX, clientY) {
        this.layerBucket.activeItem.width(clientX - this.layerBucket.activeItem.xPoint());
    };

    ToolMouseHandler.prototype._resizeBottom = function (clientX, clientY) {
        this.layerBucket.activeItem.height(clientY - this.layerBucket.activeItem.yPoint());
    };

    ToolMouseHandler.prototype._resizeTop = function (clientX, clientY) {
        this.layerBucket.activeItem.height(this.layerBucket.activeItem.height() - (clientY - this.layerBucket.activeItem.yPoint()));
        this.layerBucket.activeItem.yPoint(clientY);
    };

    ToolMouseHandler.prototype._resizeLeft = function (clientX, clientY) {
        this.layerBucket.activeItem.width(this.layerBucket.activeItem.width() - (clientX - this.layerBucket.activeItem.xPoint()));
        this.layerBucket.activeItem.xPoint(clientX);
    };

    ToolMouseHandler.prototype._move = function (clientX, clientY) {
        this.layerBucket.activeItem.xPoint(clientX - Math.floor(this.layerBucket.activeItem.width() / 2));
        this.layerBucket.activeItem.yPoint(clientY - Math.floor(this.layerBucket.activeItem.height() / 2));
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