define(['input/PointerAction', 'math/Vectors'], function (PointerAction, Vectors) {
    var OFF_SET = 2;

    function LineActionInterpreter(checkCollision) {
        this._checkCollision = checkCollision;
    }

    LineActionInterpreter.prototype.interpret = function (pointer, line) {
        if (this._checkCollision({center: {xPoint: line.pointA.xPoint, yPoint: line.pointA.yPoint}, radius: OFF_SET}, pointer))
            return PointerAction.CHANGE_POINT_A;

        else if (this._checkCollision({center: {xPoint: line.pointB.xPoint, yPoint: line.pointB.yPoint}, radius: OFF_SET}, pointer))
            return PointerAction.CHANGE_POINT_B;

        else {
            var vector = Vectors.createVector(line.pointA, line.pointB);
            var length = Vectors.magnitude(vector) / 3;
            var unitVector = Vectors.normalize(vector);

            var controlPointA = {
                center: {
                    xPoint: line.pointA.xPoint + length * unitVector.x,
                    yPoint: line.pointA.yPoint + length * unitVector.y
                },
                radius: OFF_SET
            };

            var controlPointB = {
                center: {
                    xPoint: line.pointB.xPoint + length * -unitVector.x,
                    yPoint: line.pointB.yPoint + length * -unitVector.y
                },
                radius: OFF_SET
            };

            if (this._checkCollision(controlPointA, pointer))
                return PointerAction.TRANSFORM_FROM_POINT_A;

            else if (this._checkCollision(controlPointB, pointer))
                return PointerAction.TRANSFORM_FROM_POINT_B;

        }
            return PointerAction.NOTHING;
    };

    return LineActionInterpreter;
});