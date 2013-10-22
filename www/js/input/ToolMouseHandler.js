define(['view/Item', 'lib/knockout', 'input/PointerAction'], function (Item, ko, PointerAction) {

    function ToolMouseHandler(layers, checkPointerShapeCollision, interpretPointerAction) {
        if (layers == null)
            throw "Illegal argument: layer model not provided";

        this.layers = layers;
        this._checkCollision = checkPointerShapeCollision;
        this._interpretAction = interpretPointerAction;

        this.counter = 0;
        this.activeShape = null;
        this.activeAction = PointerAction.NOTHING;
        this.state = State.CLEAR;
    }

    ToolMouseHandler.prototype.handleDown = function (event) {
        this._validate(event);
        if (this.state !== State.CLEAR && this.state !== State.UP) {
            this.layers()[0].items.remove(this.activeShape);
            this.state = State.CLEAR;
            return;
        }
        this.state = State.DOWN;

        var isPointerShapeCollision = false;
        var isPointerActionPointCollision = false;

        var self = this;
        ko.utils.arrayForEach(this.layers(), function (layer) {
            if (isPointerShapeCollision || isPointerActionPointCollision)
                return;

            ko.utils.arrayForEach(layer.items(), function (item) {
                if (isPointerShapeCollision || isPointerActionPointCollision || item.isHidden())
                    return;

                if (!item.isSelected() && self._checkCollision(event, item)) {
                    item.isSelected(true);
                    isPointerShapeCollision = true;
                    self.activeShape = item;

                } else if (item.isSelected()) {
                    var tempAction = self._interpretAction(event, item);

                    if (tempAction !== PointerAction.NOTHING) {
                        isPointerActionPointCollision = true;
                        self.activeShape = item;
                        self.activeAction = tempAction;
                    }
                }
            });
        });

        if (isPointerShapeCollision || isPointerActionPointCollision)
            return;

        this.activeShape = new Item('unknown ' + this.counter++, event.clientX, event.clientY, 10, 10);
        this.activeAction = PointerAction.RESIZE_BOTTOM_AND_RIGHT;

        this.layers()[0].items.push(this.activeShape);
    };

    ToolMouseHandler.prototype.handleMove = function (event) {
        this._validate(event);

        if (this.state !== State.DOWN) {
            return;
        }

        this._resizeShape(event);
    };

    ToolMouseHandler.prototype.handleUp = function (event) {
        this._validate(event);
        if (this.state !== State.DOWN) {
            return;
        }
        this.state = State.UP;

        this._resizeShape(event);

        this._normalizeRect(this.activeShape);
    };

    ToolMouseHandler.prototype._validate = function (event) {
        if (event == null || event.clientX == null || event.clientY == null)
            throw "Illegal argument: " + event;
    };

    ToolMouseHandler.prototype._resizeShape = function (event) {
        if (this.activeAction === PointerAction.RESIZE_BOTTOM_AND_RIGHT) {
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

    var State = {
        CLEAR: -1,
        DOWN: 0,
        MOVE: 1,
        UP: 2
    };

    return ToolMouseHandler;
});