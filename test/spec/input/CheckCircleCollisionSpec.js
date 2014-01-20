define(['input/checkCircleCollision'], function (checkCircleCollision) {
    describe('as a caller I want to check if a pointer hits a circle', function () {

        it("should return false " +
            "when the pointer is outside of the circle " +
            "the distance is longer than both radii", function () {

            var circle = {xPoint: 50, yPoint: 50, radius: 50};
            var pointer = {xPoint: 105, yPoint: 50, radius: 4};

            var actual = checkCircleCollision(circle, pointer);

            expect(actual).toBe(false);
        });

        it("should return true " +
            "when the pointer touches the circle from the outside: " +
            "distance - (radius_1 + radius_2) <= 0", function () {

            var circle = {xPoint: 50, yPoint: 50, radius: 50};
            var pointer = {xPoint: 104, yPoint: 50, radius: 4};

            var actual = checkCircleCollision(circle, pointer);

            expect(actual).toBe(true);

        });

        it("should return true " +
            "when the pointer touches the circle from the inside: " +
            "distance - (radius_1 + radius_2) >= -radius_1", function () {

        });

        it("should return false " +
            "when the pointer is inside of the circle: " +
            "distance - (radius_1 + radius_2) < -radius_1", function () {

        });
    });
});