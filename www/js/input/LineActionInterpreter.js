define(['input/PointerAction'], function (PointerAction) {
    function LineActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    LineActionInterpreter.prototype.interpret = function (pointer, line) {
        return PointerAction.NOTHING;
    };

    return LineActionInterpreter;
});