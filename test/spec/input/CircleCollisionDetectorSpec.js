define(['input/CircleCollisionDetector'], function (CircleCollisionDetector) {
    describe('as a caller I want to check if a pointer hits a circle', function () {

        it("should return false " +
            "when the pointer is outside of the circle", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 105, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkCircle(circle, pointer);

            expect(actual).toBe(false);
        });

        it("should return true " +
            "when the pointer touches the circle from the outside", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 104, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkCircle(circle, pointer);

            expect(actual).toBe(true);

        });

        it("should return true " +
            "when the pointer touches the circle from the inside", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 96, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkCircle(circle, pointer);

            expect(actual).toBe(true);
        });

        it("should return false " +
            "when the pointer is inside of the circle", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 95, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkCircle(circle, pointer);

            expect(actual).toBe(false);
        });
    });

    describe("as a caller I want to check if a pointer hits a filled circle", function () {
        it("should return false " +
            "when the pointer is outside of the circle", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 105, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkFilledCircle(circle, pointer);

            expect(actual).toBe(false);
        });

        it("should return true " +
            "when the pointer touches the circle from the outside", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 104, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkFilledCircle(circle, pointer);

            expect(actual).toBe(true);

        });

        it("should return true " +
            "when the pointer touches the circle from the inside", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 96, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkFilledCircle(circle, pointer);

            expect(actual).toBe(true);
        });

        it("should return true " +
            "when the pointer is inside of the circle", function () {

            var circle = {center: {xPoint: 50, yPoint: 50}, radius: 50};
            var pointer = {center: {xPoint: 95, yPoint: 50}, radius: 4};

            var actual = CircleCollisionDetector.checkFilledCircle(circle, pointer);

            expect(actual).toBe(true);
        });
    });
});