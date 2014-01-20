define(['input/checkLineCollision'], function (checkLineCollision) {
    describe("as a caller I want to check if a pointer hits a line", function () {

        it("should return false " +
            "when a pointer misses a line on the left side of the line", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 30, yPoint: 15, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(false);
        });

        it("should return true " +
            "when a pointer hits a line on the left side of the line", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 30, yPoint: 14, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(true);
        });

        it("should return true " +
            "when a pointer hits a line on the right side of the line", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 30, yPoint: 6, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(true);
        });

        it("should return false " +
            "when a pointer misses a line on the right side of the line", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 30, yPoint: 5, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(false);
        });

        it("should return false " +
            "when a pointer misses a line before the line segment", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 9, yPoint: 10, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(false);
        });

        it("should return true " +
            "when a pointer hits a line at the beginning of the line segment", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 10, yPoint: 10, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(true);
        });

        it("should return true " +
            "when a pointer hits a line at the end of the line segment", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 50, yPoint: 10, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(true);
        });

        it("should return false " +
            "when a pointer misses a line after the line segment", function () {

            var line = {xPointA: 10, yPointA: 10, xPointB: 50, yPointB: 10};
            var pointer = {xPoint: 51, yPoint: 10, radius: 4};

            var actual = checkLineCollision(line, pointer);

            expect(actual).toBe(false);
        });
    });
});