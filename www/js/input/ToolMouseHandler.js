define(['model/Line', 'model/Rectangle', 'model/Circle', 'model/Curve', 'input/PointerAction', 'input/ABRectangle',
    'math/Point', 'math/Line', 'math/Circle', 'math/Vectors'], function (Line, Rectangle, Circle, Curve, PointerAction,
    ABRectangle, Point, MathLine, MathCircle, Vectors) {

    /**
     * handles {MouseEvent}s when the 'edit' mode in the editor is on
     *
     * @param {Object} entityBucket                  the layer model for the whole editor with its items
     * @param {Object} collisionDetector            checks if mouse pointer clicked on a shape
     * @param {Object} actionInterpreter            checks/chooses if mouse pointer hit an 'action point'
     * @constructor
     */
    function ToolMouseHandler(entityBucket, collisionDetector, actionInterpreter, zoomLevel) {
        if (entityBucket == null || entityBucket.entities == null)
            throw "Illegal argument: layer model not provided";

        this.entityBucket = entityBucket;
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

//        this._createNewShape(clientX, clientY);
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

        if (this._isRect(this.entityBucket.activeItem))
            this._normalizeRect(this.entityBucket.activeItem);

        if (this._isRectFlat(this.entityBucket.activeItem) || this._isCircleFlat(this.entityBucket.activeItem) ||
            this._isLineFlat(this.entityBucket.activeItem))
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
        if (this.entityBucket.activeEntity == null) {
            //todo test case
            this.state = State.CAN_START;
            return;
        }

        var item;
        if (this.entityBucket.activeEntity.type === RECTANGLE) {
            item = new Rectangle('unknown ' + this.counter++, clientX, clientY, 10, 10);

        } else if (this.entityBucket.activeEntity.type === LINE) {
            item = new Line('unknown ' + this.counter++, clientX, clientY, clientX, clientY)

        } else if (this.entityBucket.activeEntity.type === CIRCLE) {
            item = new Circle('unknown ' + this.counter++, clientX, clientY, 10, 10);

        } else {
            //todo test case
            this.state = State.CAN_START;
            return;
        }

        this.entityBucket.deactivateActiveItem();
        this.entityBucket.activateItem(item);

        this.activeAction = PointerAction.CREATE_NEW;

        this.entityBucket.activeEntity.items.push(item);
    };

    ToolMouseHandler.prototype._resolveWrongState = function () {
        if (this.activeAction === PointerAction.CREATE_NEW) {
            this._removeStartedShape();

        } else {
            if (this._isRect(this.entityBucket.activeItem))
                this._revertChangedRect();

            else if (this._isCircle(this.entityBucket.activeItem))
                this._revertChangedCircle();

            else if (this._isLine(this.entityBucket.activeItem))
                this._revertChangedLine();
        }

        this.state = State.CAN_START;
    };

    ToolMouseHandler.prototype._removeStartedShape = function () {
        var self = this;
        this.entityBucket.entities.forEach(function (layer) {
            if (layer.isActive())
                layer.items.remove(self.entityBucket.activeItem);
        });
    };

    ToolMouseHandler.prototype._revertChangedRect = function () {
        this.entityBucket.activeItem.xPoint(this.oldItem.xPoint);
        this.entityBucket.activeItem.yPoint(this.oldItem.yPoint);
        this.entityBucket.activeItem.width(this.oldItem.width);
        this.entityBucket.activeItem.height(this.oldItem.height);
    };

    ToolMouseHandler.prototype._revertChangedCircle = function () {
        this.entityBucket.activeItem.xPoint(this.oldItem.xPoint);
        this.entityBucket.activeItem.yPoint(this.oldItem.yPoint);
        this.entityBucket.activeItem.radius(this.oldItem.radius);
    };

    ToolMouseHandler.prototype._revertChangedLine = function () {
        this.entityBucket.activeItem.xPointA(this.oldItem.xPointA);
        this.entityBucket.activeItem.yPointA(this.oldItem.yPointA);
        this.entityBucket.activeItem.xPointB(this.oldItem.xPointB);
        this.entityBucket.activeItem.yPointB(this.oldItem.yPointB);
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
        this.entityBucket.entities.forEach(function (layer) {
            if (isPointerShapeCollision || isPointerActionPointCollision)
                return;

//            layer.items.forEach(function (item) {
//                if (isPointerShapeCollision || isPointerActionPointCollision || item.isHidden())
//                    return;
//
//                var isRect = self._isRect(item),
//                    isCircle = self._isCircle(item),
//                    isLine = self._isLine(item),
//                    isCurve = self._isCurve(item);
//
//                if (item.isActive()) {
//                    var tempAction;
//
//                    if (isRect) {
//                        tempAction = self.actionInterpreter.interpretRect(pointer, item);
//
//                    } else if (isCircle) {
//                        tempAction = self.actionInterpreter.interpretCircle(circlePointer, self._getMathCircle(item));
//
//                    } else if (isLine) {
//                        tempAction = self.actionInterpreter.interpretLine(circlePointer, self._getMathLine(item));
//
//                    } else if (isCurve) {
//                        tempAction = self.actionInterpreter.interpretCurve(circlePointer, self._getMathCurve(item));
//                    }
//
//                    if (tempAction !== PointerAction.NOTHING) {
//                        isPointerActionPointCollision = true;
//                        self.entityBucket.activeItem = item;
//                        self.activeAction = tempAction;
//
//                        if (isRect) {
//                            self._setOldRect(item);
//
//                        } else if (isCircle) {
//                            self._setOldCircle(item);
//
//                        } else if (isLine) {
//                            self._setOldLine(item);
//                        }
//                    }
//                } else {
//
//                    if (isRectCollision() || isCircleCollision() || isLineCollision()) {
//                        self.entityBucket.deactivateActiveItem();
//                        self.entityBucket.activateItem(item);
//                        self.activeAction = PointerAction.NOTHING;
//
//                        isPointerShapeCollision = true;
//                    }
//
//                    function isRectCollision() {
//                        return isRect && self.collisionDetector.checkRect(pointer, self._getABRect(item));
//                    }
//
//                    function isCircleCollision() {
//                        return isCircle && self.collisionDetector.checkCircle(self._getMathCircle(item), circlePointer);
//                    }
//
//                    function isLineCollision() {
//                        return isLine && self.collisionDetector.checkLine(self._getMathLine(item), circlePointer);
//                    }
//                }
//            });
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

        if (this._isRect(this.entityBucket.activeItem)) {
            this._resizeRect(clientX, clientY);

        } else if (this._isLine(this.entityBucket.activeItem)) {
            this._resizeLine(clientX, clientY);

        } else if (this._isCircle(this.entityBucket.activeItem)) {
            this._resizeCircle(clientX, clientY);

        } else if (this._isCurve(this.entityBucket.activeItem)) {
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
        this.entityBucket.activeItem.xPoint(clientX);
        this.entityBucket.activeItem.yPoint(clientY);
    };

    ToolMouseHandler.prototype._resizeRadius = function (clientX, clientY) {
        var radius = Math.sqrt(Math.pow(clientX - this.entityBucket.activeItem.xPoint(), 2) +
            Math.pow(clientY - this.entityBucket.activeItem.yPoint(), 2));
        this.entityBucket.activeItem.radius(Math.floor(radius));
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
        var curve = new Curve(this.entityBucket.activeItem.name,
            this.entityBucket.activeItem.xPointA(), this.entityBucket.activeItem.yPointA(),
            clientX, clientY,
            this.entityBucket.activeItem.xPointB(), this.entityBucket.activeItem.yPointB(),
            this.entityBucket.activeItem.xPointB(), this.entityBucket.activeItem.yPointB());

        this._removeStartedShape();
        this.entityBucket.activeEntity.items.push(curve);
//        this.entityBucket.activateItem(curve)
    };

    ToolMouseHandler.prototype._transformToCurveFromB = function (clientX, clientY) {
        var curve = new Curve(this.entityBucket.activeItem.name,
            this.entityBucket.activeItem.xPointA(), this.entityBucket.activeItem.yPointA(),
            this.entityBucket.activeItem.xPointA(), this.entityBucket.activeItem.yPointA(),
            clientX, clientY,
            this.entityBucket.activeItem.xPointB(), this.entityBucket.activeItem.yPointB());

        this._removeStartedShape();
        this.entityBucket.activeEntity.items.push(curve);
//        this.entityBucket.activateItem(curve)
    };

    ToolMouseHandler.prototype._moveCurve = function (clientX, clientY) {
        var delta = {
            x: clientX - this.entityBucket.activeItem.xCenterPoint,
            y: clientY - this.entityBucket.activeItem.yCenterPoint
        };

        this.entityBucket.activeItem.xPointA(this.entityBucket.activeItem.xPointA() + delta.x);
        this.entityBucket.activeItem.yPointA(this.entityBucket.activeItem.yPointA() + delta.y);
        this.entityBucket.activeItem.xPointB(this.entityBucket.activeItem.xPointB() + delta.x);
        this.entityBucket.activeItem.yPointB(this.entityBucket.activeItem.yPointB() + delta.y);
        this.entityBucket.activeItem.xPointC(this.entityBucket.activeItem.xPointC() + delta.x);
        this.entityBucket.activeItem.yPointC(this.entityBucket.activeItem.yPointC() + delta.y);
        this.entityBucket.activeItem.xPointD(this.entityBucket.activeItem.xPointD() + delta.x);
        this.entityBucket.activeItem.yPointD(this.entityBucket.activeItem.yPointD() + delta.y);
    };

    ToolMouseHandler.prototype._moveLine = function (clientX, clientY) {
        var pointA = {
            xPoint: this.entityBucket.activeItem.xPointA(),
            yPoint: this.entityBucket.activeItem.yPointA()
        };
        var pointB = {
            xPoint: this.entityBucket.activeItem.xPointB(),
            yPoint: this.entityBucket.activeItem.yPointB()
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

        this.entityBucket.activeItem.xPointA(pointA.xPoint + delta.x);
        this.entityBucket.activeItem.yPointA(pointA.yPoint + delta.y);
        this.entityBucket.activeItem.xPointB(pointB.xPoint + delta.x);
        this.entityBucket.activeItem.yPointB(pointB.yPoint + delta.y);
    };

    ToolMouseHandler.prototype._changePointA = function (clientX, clientY) {
        this.entityBucket.activeItem.xPointA(clientX);
        this.entityBucket.activeItem.yPointA(clientY);
    };

    ToolMouseHandler.prototype._changePointB = function (clientX, clientY) {
        this.entityBucket.activeItem.xPointB(clientX);
        this.entityBucket.activeItem.yPointB(clientY);
    };

    ToolMouseHandler.prototype._changePointC = function (clientX, clientY) {
        this.entityBucket.activeItem.xPointC(clientX);
        this.entityBucket.activeItem.yPointC(clientY);
    };

    ToolMouseHandler.prototype._changePointD = function (clientX, clientY) {
        this.entityBucket.activeItem.xPointD(clientX);
        this.entityBucket.activeItem.yPointD(clientY);
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
        this.entityBucket.activeItem.width(clientX - this.entityBucket.activeItem.xPoint());
    };

    ToolMouseHandler.prototype._resizeBottom = function (clientX, clientY) {
        this.entityBucket.activeItem.height(clientY - this.entityBucket.activeItem.yPoint());
    };

    ToolMouseHandler.prototype._resizeTop = function (clientX, clientY) {
        this.entityBucket.activeItem.height(this.entityBucket.activeItem.height() - (clientY - this.entityBucket.activeItem.yPoint()));
        this.entityBucket.activeItem.yPoint(clientY);
    };

    ToolMouseHandler.prototype._resizeLeft = function (clientX, clientY) {
        this.entityBucket.activeItem.width(this.entityBucket.activeItem.width() - (clientX - this.entityBucket.activeItem.xPoint()));
        this.entityBucket.activeItem.xPoint(clientX);
    };

    ToolMouseHandler.prototype._move = function (clientX, clientY) {
        this.entityBucket.activeItem.xPoint(clientX - Math.floor(this.entityBucket.activeItem.width() / 2));
        this.entityBucket.activeItem.yPoint(clientY - Math.floor(this.entityBucket.activeItem.height() / 2));
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