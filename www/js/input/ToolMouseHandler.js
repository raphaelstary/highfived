define(['model/Rectangle', 'input/PointerAction', 'input/ABRectangle', 'input/Point'], function (Rectangle,
    PointerAction, ABRectangle, Point) {

    /**
     * handles {MouseEvent}s when the 'edit' mode in the editor is on
     *
     * @param {Object} layerBucket                           the layer model for the whole editor with its items
     * @param {function} checkPointerShapeCollision     checks if mouse pointer clicked on a shape
     * @param {function} interpretPointerAction         checks/chooses if mouse pointer hit an 'action point'
     * @constructor
     * @public
     */
    function ToolMouseHandler(layerBucket, checkPointerShapeCollision, interpretPointerAction) {
        if (layerBucket == null || layerBucket.layers == null)
            throw "Illegal argument: layer model not provided";

        this.layerBucket = layerBucket;
        this._checkCollision = checkPointerShapeCollision;
        this._interpretAction = interpretPointerAction;

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
     * @public
     */
    ToolMouseHandler.prototype.handleDown = function (event) {
        this._validate(event);

        if (this.state !== State.CAN_START) {
            this._resolveWrongState();
            return;
        }

        this.state = State.STARTED;

        var wasRectOrActionPointSelected = this._selectRectOrStartAction(event);
        if (wasRectOrActionPointSelected)
            return;

        this._createNewRect(event);
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
     * @public
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
     * @public
     */
    ToolMouseHandler.prototype.handleUp = function (event) {
        this._validate(event);

        if (this.state !== State.STARTED)
            return;

        this._resizeShape(event);

        this._normalizeRect(this.activeShape);

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

    ToolMouseHandler.prototype._createNewRect = function (event) {
        this._deactivateActiveItem();
        this._activateItem(new Rectangle('unknown ' + this.counter++, event.clientX, event.clientY, 10, 10));

        this.activeAction = PointerAction.CREATE_NEW;

        this.layerBucket.layers()[0].items.push(this.activeShape);
    };

    ToolMouseHandler.prototype._resolveWrongState = function () {
        if (this.activeAction === PointerAction.CREATE_NEW) {
            this._removeStartedRect();

        } else {
            this._revertChangedRect();
        }

        this.state = State.CAN_START;
    };

    ToolMouseHandler.prototype._removeStartedRect = function () {
        this.layerBucket.layers()[0].items.remove(this.activeShape);
    };

    ToolMouseHandler.prototype._revertChangedRect = function () {
        this.activeShape.xPoint(this.oldItem.xPoint);
        this.activeShape.yPoint(this.oldItem.yPoint);
        this.activeShape.width(this.oldItem.width);
        this.activeShape.height(this.oldItem.height);
    };

    ToolMouseHandler.prototype._selectRectOrStartAction = function (event) {
        var isPointerShapeCollision = false;
        var isPointerActionPointCollision = false;

        const OFF_SET = 2;
        var pointer = new ABRectangle(
            new Point(event.clientX - OFF_SET, event.clientY - OFF_SET),
            new Point(event.clientX + OFF_SET, event.clientY + OFF_SET)
        );

        var self = this;
        this.layerBucket.layers.forEach(function (layer) {
            if (isPointerShapeCollision || isPointerActionPointCollision)
                return;

            layer.items.forEach(function (item) {
                if (isPointerShapeCollision || isPointerActionPointCollision || item.isHidden())
                    return;

                if (!item.isActive() && self._checkCollision(pointer, self._getABRect(item))) {
                    self._deactivateActiveItem();
                    self._activateItem(item);

                    isPointerShapeCollision = true;

                } else if (item.isActive()) {
                    var tempAction = self._interpretAction(pointer, item);

                    if (tempAction !== PointerAction.NOTHING) {
                        isPointerActionPointCollision = true;
                        self.activeShape = item;
                        self.activeAction = tempAction;

                        self.oldItem.xPoint = item.xPoint();
                        self.oldItem.yPoint = item.yPoint();
                        self.oldItem.width = item.width();
                        self.oldItem.height = item.height();
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

    ToolMouseHandler.prototype._resizeShape = function (event) {
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

    return ToolMouseHandler;
});