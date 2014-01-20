define(function () {

    /**
     * checks if a pointer hits a circle
     *
     * @param {Object} circle    given circle
     * @param {Object} pointer   given pointer as a circle
     * @returns {boolean} true if there is a collision else false
     */
    function checkCircleCollision(circle, pointer) {

        var distance = Math.sqrt(Math.pow(pointer.xPoint - circle.xPoint, 2) +
            Math.pow(pointer.yPoint - circle.yPoint, 2));

        var possibleHitDistance = distance - circle.radius;

        return possibleHitDistance - pointer.radius <= 0 &&
            Math.abs(possibleHitDistance) <= pointer.radius;
    }

    return checkCircleCollision;
});