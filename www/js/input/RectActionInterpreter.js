define(['input/PointerAction', 'input/ABRectangle', 'input/Point'], function (PointerAction, ABRectangle, Point) {

    /**
     * checks if an action point was hit
     *
     * @param checkCollision
     * @constructor
     */
    function RectActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    /**
     * checks if an given pointer hits an action point and returns the action
     *
     * @param {ABRectangle} pointer
     * @param {Rectangle} item
     * @returns {PointerAction}
     */
    RectActionInterpreter.prototype.interpret = function (pointer, item) {
        if (this._checkCollision(pointer, this._getTopLeftPoint(item))) {
            return PointerAction.RESIZE_TOP_AND_LEFT;

        } else if (this._checkCollision(pointer, this._getTopPoint(item))) {
            return PointerAction.RESIZE_TOP;

        } else if (this._checkCollision(pointer, this._getTopRightPoint(item))) {
            return PointerAction.RESIZE_TOP_AND_RIGHT;

        } else if (this._checkCollision(pointer, this._getLeftPoint(item))) {
            return PointerAction.RESIZE_LEFT;

        } else if (this._checkCollision(pointer, this._getCenterPoint(item))) {
            return PointerAction.MOVE;

        } else if (this._checkCollision(pointer, this._getRightPoint(item))) {
            return PointerAction.RESIZE_RIGHT;

        } else if (this._checkCollision(pointer, this._getBottomLeftPoint(item))) {
            return PointerAction.RESIZE_BOTTOM_AND_LEFT;

        } else if (this._checkCollision(pointer, this._getBottomPoint(item))) {
            return PointerAction.RESIZE_BOTTOM;

        } else if (this._checkCollision(pointer, this._getBottomRightPoint(item))) {
            return PointerAction.RESIZE_BOTTOM_AND_RIGHT;
        }

        return PointerAction.NOTHING;
    };

    RectActionInterpreter.prototype._getTopLeftPoint = function (item) {
        return this._getActionPoint(this._getLeftXAxis(item), this._getTopYAxis(item));
    };

    RectActionInterpreter.prototype._getTopPoint = function (item) {
        return this._getActionPoint(this._getMiddleXAxis(item), this._getTopYAxis(item));
    };
    RectActionInterpreter.prototype._getTopRightPoint = function (item) {
        return this._getActionPoint(this._getRightXAxis(item), this._getTopYAxis(item));
    };

    RectActionInterpreter.prototype._getLeftPoint = function (item) {
        return this._getActionPoint(this._getLeftXAxis(item), this._getMiddleYAxis(item));
    };

    RectActionInterpreter.prototype._getCenterPoint = function (item) {
        return this._getActionPoint(this._getMiddleXAxis(item), this._getMiddleYAxis(item));
    };

    RectActionInterpreter.prototype._getRightPoint = function (item) {
        return this._getActionPoint(this._getRightXAxis(item), this._getMiddleYAxis(item));
    };
    RectActionInterpreter.prototype._getBottomLeftPoint = function (item) {
        return this._getActionPoint(this._getLeftXAxis(item), this._getBottomYAxis(item));
    };

    RectActionInterpreter.prototype._getBottomPoint = function (item) {
        return this._getActionPoint(this._getMiddleXAxis(item), this._getBottomYAxis(item));
    };

    RectActionInterpreter.prototype._getBottomRightPoint = function (item) {
        return this._getActionPoint(this._getRightXAxis(item), this._getBottomYAxis(item));
    };

    RectActionInterpreter.prototype._getLeftXAxis = function (item) {
        return item.xPoint();
    };

    RectActionInterpreter.prototype._getMiddleXAxis = function (item) {
        return item.xPoint() + (item.width() / 2);
    };

    RectActionInterpreter.prototype._getRightXAxis = function (item) {
        return item.xPoint() + item.width();
    };

    RectActionInterpreter.prototype._getTopYAxis = function (item) {
        return item.yPoint();
    };

    RectActionInterpreter.prototype._getMiddleYAxis = function (item) {
        return item.yPoint() + (item.height() / 2);
    };

    RectActionInterpreter.prototype._getBottomYAxis = function (item) {
        return item.yPoint() + item.height();
    };

    RectActionInterpreter.prototype._getActionPoint = function (centerXPoint, centerYPoint) {
        const OFF_SET = 2;

        return new ABRectangle(
            new Point(centerXPoint - OFF_SET, centerYPoint - OFF_SET),
            new Point(centerXPoint + OFF_SET, centerYPoint + OFF_SET));
    };

    return RectActionInterpreter;
});