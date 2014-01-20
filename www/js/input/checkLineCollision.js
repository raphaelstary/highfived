define(function () {
    /**
     * checks if a pointer hits a line
     *
     * @param {Object} line given line
     * @param {Object} pointer given pointer
     * @returns {boolean} true if it's a hit else false
     */
    function checkLineCollision(line, pointer) {
        var lineVector = {
            x: line.xPointB - line.xPointA,
            y: line.yPointB - line.yPointA
        };
        var magnitude = Math.sqrt(lineVector.x * lineVector.x + lineVector.y * lineVector.y);

        var normalLineUnitVector = {
            x: -(lineVector.y /magnitude),
            y: lineVector.x / magnitude
        };

        var pointAToCircleVector = {
            x: pointer.xPoint - line.xPointA,
            y: pointer.yPoint - line.yPointA
        };
        var pointBToCircleVector = {
            x: pointer.xPoint - line.xPointB,
            y: pointer.yPoint - line.yPointB
        };

        var perpendicularLength = dotProduct(normalLineUnitVector, pointAToCircleVector);

        return isInPerpendicularRange(perpendicularLength, pointer.radius) &&
            isWithinLineSegment(lineVector, pointAToCircleVector, pointBToCircleVector);
    }

    function dotProduct(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    function isInPerpendicularRange(perpendicularLength, radius) {
        return Math.abs(perpendicularLength) <= radius;
    }

    function isWithinLineSegment(vectorA, vectorB, vectorC) {
        return dotProduct(vectorA, vectorB) >= 0 && dotProduct(vectorA, vectorC) <= 0;
    }

    return checkLineCollision;
});