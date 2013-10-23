define(function () {
    /**
     *
     * @param {ABRectangle} pointer
     * @param {ABRectangle} rectangle
     */
    function checkCollision(pointer, rectangle) {
        if (pointer.pointB.xPoint < rectangle.pointA.xPoint ||
            (pointer.pointA.xPoint > rectangle.pointA.xPoint && pointer.pointB.xPoint < rectangle.pointB.xPoint) ||
            pointer.pointA.xPoint > rectangle.pointB.xPoint)
            return false;
        return true;
    }

    return checkCollision;
});