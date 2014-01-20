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

        var perpendicularLength = normalLineUnitVector.x * pointAToCircleVector.x +
            normalLineUnitVector.y * pointAToCircleVector.y;

        return perpendicularLength <= pointer.radius;
    }

    return checkLineCollision;
});