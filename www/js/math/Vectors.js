define(['math/Vector'], function (Vector) {
    return {
        /**
         *
         * @param {Point} pointA
         * @param {Point} pointB
         * @returns {Vector}
         */
        createVector: function (pointA, pointB) {
            return new Vector(pointB.xPoint - pointA.xPoint, pointB.yPoint - pointA.yPoint);
        },

        /**
         *
         * @param {Vector} vector
         * @returns {Vector}
         */
        normalize: function (vector) {
            var magnitude = this.magnitude(vector);

            return new Vector(vector.x / magnitude, vector.y / magnitude);
        },

        /**
         *
         * @param {Vector} vector
         * @returns {Vector}
         */
        normalRight: function (vector) {
            return new Vector(-vector.y, vector.x);
        },

        /**
         *
         * @param {Vector} vector
         * @returns {Vector}
         */
        normalLeft: function (vector) {
            return new Vector(vector.y, -vector.x);
        },

        /**
         *
         * @param {Vector} vectorA
         * @param {Vector} vectorB
         * @returns {number}
         */
        dotProduct: function (vectorA, vectorB) {
            return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
        },

        /**
         *
         * @param {Vector} vector
         * @returns {number}
         */
        magnitude: function (vector) {
            return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
        }
    }
});