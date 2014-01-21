define(['input/PointerAction'], function (PointerAction) {
    function CircleActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    CircleActionInterpreter.prototype.interpret = function () {
        return PointerAction.NOTHING;
    };

    return CircleActionInterpreter;
});