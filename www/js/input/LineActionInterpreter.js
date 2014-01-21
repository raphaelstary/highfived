define(['input/PointerAction'], function (PointerAction) {
    var OFF_SET = 2;

    function LineActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    LineActionInterpreter.prototype.interpret = function (pointer, line) {
        if (this._checkCollision({xPoint: line.xPointA, yPoint: line.yPointA, radius: OFF_SET}, pointer))
            return PointerAction.CHANGE_POINT_A;

        else if (this._checkCollision({xPoint: line.xPointB, yPoint: line.yPointB, radius: OFF_SET}, pointer))
            return PointerAction.CHANGE_POINT_B;

        return PointerAction.NOTHING;
    };

    return LineActionInterpreter;
});