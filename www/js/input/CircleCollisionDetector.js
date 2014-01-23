define(function () {

    function calculateDistance(circleA, circleB) {
        return Math.sqrt(Math.pow(circleB.center.xPoint - circleA.center.xPoint, 2) +
            Math.pow(circleB.center.yPoint - circleA.center.yPoint, 2))
    }

    function isNotOutside(distance, circle, pointer) {
        return distance <= circle.radius + pointer.radius;
    }

    function isNotInside(distance, circle, pointer) {
        return distance >= circle.radius - pointer.radius;
    }

    return {
        /**
         * checks if a pointer hits a circle
         *
         * @param {Object} circle    given circle
         * @param {Object} pointer   given pointer as a circle
         * @returns {boolean} true if there is a collision else false
         */
        checkCircle: function (circle, pointer) {
            var distance = calculateDistance(circle, pointer);

            return isNotOutside(distance, circle, pointer) && isNotInside(distance, circle, pointer);
        },

        /**
         * checks if a pointer hits a filled circle
         *
         * @param {Object} circle    given circle
         * @param {Object} pointer   given pointer as a circle
         * @returns {boolean} true if there is a collision else false
         */
        checkFilledCircle: function (circle, pointer) {
            return isNotOutside(calculateDistance(circle, pointer), circle, pointer);
        }
    };
});