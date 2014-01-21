define(['input/PointerAction'], function (PointerAction) {
    var OFF_SET = 2;

    function CircleActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    CircleActionInterpreter.prototype.interpret = function (pointer, circle) {

        if (this._checkCollision({xPoint: circle.xPoint, yPoint: circle.yPoint, radius: OFF_SET}, pointer))
            return PointerAction.MOVE;

        else if (this._checkCollision({xPoint: circle.xPoint + circle.radius, yPoint: circle.yPoint, radius: OFF_SET},
            pointer))
            return PointerAction.RESIZE_RADIUS;

        return PointerAction.NOTHING;
    };

    return CircleActionInterpreter;
});