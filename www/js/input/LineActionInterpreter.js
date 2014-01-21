define(['input/PointerAction'], function (PointerAction) {
    var OFF_SET = 2;

    function LineActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    LineActionInterpreter.prototype.interpret = function (pointer, line) {
        if (this._checkCollision({center: {xPoint: line.pointA.xPoint, yPoint: line.pointA.yPoint}, radius: OFF_SET}, pointer))
            return PointerAction.CHANGE_POINT_A;

        else if (this._checkCollision({center: {xPoint: line.pointB.xPoint, yPoint: line.pointB.yPoint}, radius: OFF_SET}, pointer))
            return PointerAction.CHANGE_POINT_B;

//        else if ()

        return PointerAction.NOTHING;
    };

    return LineActionInterpreter;
});