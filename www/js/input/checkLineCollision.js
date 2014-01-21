define(['math/Vectors'], function (Vectors) {
    /**
     * checks if a pointer hits a line
     *
     * @param {Line} line given line
     * @param {Circle} pointer given pointer
     * @returns {boolean} true if it's a hit else false
     */
    function checkLineCollision(line, pointer) {
        var lineVector = Vectors.createVector(line.pointA, line.pointB);

        var normalLineUnitVector = Vectors.normalRight(Vectors.normalize(lineVector));

        var pointAToCircleVector = Vectors.createVector(line.pointA, pointer.center);

        var pointBToCircleVector = Vectors.createVector(line.pointB, pointer.center);

        var perpendicularLength = Vectors.dotProduct(normalLineUnitVector, pointAToCircleVector);

        return isInPerpendicularRange(perpendicularLength, pointer.radius) &&
            isWithinLineSegment(lineVector, pointAToCircleVector, pointBToCircleVector);
    }

    function isInPerpendicularRange(perpendicularLength, radius) {
        return Math.abs(perpendicularLength) <= radius;
    }

    function isWithinLineSegment(vectorA, vectorB, vectorC) {
        return Vectors.dotProduct(vectorA, vectorB) >= 0 && Vectors.dotProduct(vectorA, vectorC) <= 0;
    }

    return checkLineCollision;
});