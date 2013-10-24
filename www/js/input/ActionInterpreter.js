define(['input/PointerAction', 'input/ABRectangle', 'input/Point'], function (PointerAction, ABRectangle, Point) {

    /**
     *
     * @param checkCollision
     * @constructor
     */
    function ActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    /**
     *
     * @param {ABRectangle} pointer
     * @param {Item} item
     * @returns {PointerAction}
     * @public
     */
    ActionInterpreter.prototype.interpret = function (pointer, item) {
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

    ActionInterpreter.prototype._getTopLeftPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() - 2, item.yPoint() - 2),
            new Point(item.xPoint() + 2, item.yPoint() + 2));
    };

    ActionInterpreter.prototype._getTopPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() + (item.width() / 2) - 2, item.yPoint() - 2),
            new Point(item.xPoint() + (item.width() / 2) + 2, item.yPoint() + 2));
    };

    ActionInterpreter.prototype._getTopRightPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() + item.width() - 2, item.yPoint() - 2),
            new Point(item.xPoint() + item.width() + 2, item.yPoint() + 2));
    };

    ActionInterpreter.prototype._getLeftPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() - 2, item.yPoint() + (item.height() / 2) - 2),
            new Point(item.xPoint() + 2, item.yPoint() + (item.height() / 2) + 2));
    };

    ActionInterpreter.prototype._getCenterPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() + (item.width() / 2) - 2, item.yPoint() + (item.height() / 2) - 2),
            new Point(item.xPoint() + (item.width() / 2) + 2, item.yPoint() + (item.height() / 2) + 2));
    };

    ActionInterpreter.prototype._getRightPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() + item.width() - 2, item.yPoint() + (item.height() / 2) - 2),
            new Point(item.xPoint() + item.width() + 2, item.yPoint() + (item.height() / 2) + 2));
    };

    ActionInterpreter.prototype._getBottomLeftPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() - 2, item.yPoint() + item.height() - 2),
            new Point(item.xPoint() + 2, item.yPoint() + item.height() + 2));
    };

    ActionInterpreter.prototype._getBottomPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() + (item.width() / 2) - 2, item.yPoint() + item.height() - 2),
            new Point(item.xPoint() + (item.width() / 2) + 2, item.yPoint() + item.height() + 2));
    };

    ActionInterpreter.prototype._getBottomRightPoint = function (item) {
        return new ABRectangle(new Point(item.xPoint() + item.width() - 2, item.yPoint() + item.height() - 2),
            new Point(item.xPoint() + item.width() + 2, item.yPoint() + item.height() + 2));
    };

    return ActionInterpreter;
});