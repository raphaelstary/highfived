define(function () {
    /**
     * checks if a given pointer hits a rectangle
     *
     * @param {ABRectangle} pointer
     * @param {ABRectangle} rectangle
     * @public
     * @function
     */
    function checkCollision(pointer, rectangle) {
        return !(isLeftOutside(pointer, rectangle) || isInsideBorders(pointer, rectangle) ||
            isRightOutside(pointer, rectangle) || isTopOutside(pointer, rectangle) ||
            isBottomOutside(pointer, rectangle));

    }

    var isLeftOutside = function (pointer, rectangle) {
        return pointer.pointB.xPoint < rectangle.pointA.xPoint;
    };

    var isRightOutside = function (pointer, rectangle) {
        return pointer.pointA.xPoint > rectangle.pointB.xPoint;
    };

    var isTopOutside = function (pointer, rectangle) {
        return pointer.pointB.yPoint < rectangle.pointA.yPoint;
    };

    var isBottomOutside = function (poiter, rectangle) {
        return poiter.pointA.yPoint > rectangle.pointB.yPoint;
    };

    var isInsideBorders = function (pointer, rectangle) {
        return isInsideOnXAxis(pointer, rectangle) && isInsideOnYAxis(pointer, rectangle);
    };

    var isInsideOnXAxis = function (pointer, rectangle) {
        return pointer.pointA.xPoint > rectangle.pointA.xPoint && pointer.pointB.xPoint < rectangle.pointB.xPoint;
    };

    var isInsideOnYAxis = function (pointer, rectangle) {
        return pointer.pointA.yPoint > rectangle.pointA.yPoint && pointer.pointB.yPoint < rectangle.pointB.yPoint;
    };

    return checkCollision;
});