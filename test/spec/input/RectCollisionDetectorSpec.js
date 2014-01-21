define(['input/RectCollisionDetector', 'input/ABRectangle', 'math/Point'], function (RectCollisionDetector, ABRectangle,
                                                                                  Point) {

    describe("as a caller I want to check If a pointer hits the left side of an empty rect", function () {

        it("should return 'false', " +
            "when pointer misses shape on the left outer side", function () {

            var pointer = new ABRectangle(new Point(0, 0), new Point(4, 4));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the left outer side", function () {

            var pointer = new ABRectangle(new Point(1, 1), new Point(5, 5));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the left inner side", function () {

            var pointer = new ABRectangle(new Point(5, 5), new Point(10, 10));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the left inner side", function () {

            var pointer = new ABRectangle(new Point(6, 6), new Point(10, 10));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });
    });

    describe("as a caller I want to check If a pointer hits the right side of an empty rect", function () {

        it("should return 'false', " +
            "when pointer misses shape on the right inner side", function () {

            var pointer = new ABRectangle(new Point(94, 5), new Point(99, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the right inner side", function () {

            var pointer = new ABRectangle(new Point(95, 5), new Point(100, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the right outer side", function () {

            var pointer = new ABRectangle(new Point(100, 5), new Point(105, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the right outer side", function () {

            var pointer = new ABRectangle(new Point(101, 5), new Point(106, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });
    });

    describe("as a caller I want to check If a pointer hits the top side of an empty rect", function () {

        it("should return 'false', " +
            "when pointer misses shape on the top outer side", function () {

            var pointer = new ABRectangle(new Point(50, 0), new Point(55, 5));
            var rectangle = new ABRectangle(new Point(0, 6), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the top outer side", function () {

            var pointer = new ABRectangle(new Point(50, 0), new Point(55, 5));
            var rectangle = new ABRectangle(new Point(0, 5), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the top inner side", function () {

            var pointer = new ABRectangle(new Point(50, 0), new Point(55, 5));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the top inner side", function () {

            var pointer = new ABRectangle(new Point(50, 1), new Point(55, 6));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });
    });

    describe("as a caller I want to check If a pointer hits the bottom side of an empty rect", function () {

        it("should return 'false', " +
            "when pointer misses shape on the bottom inner side", function () {

            var pointer = new ABRectangle(new Point(50, 94), new Point(55, 99));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the bottom inner side", function () {

            var pointer = new ABRectangle(new Point(50, 95), new Point(55, 100));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the bottom outer side", function () {

            var pointer = new ABRectangle(new Point(50, 100), new Point(55, 105));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the bottom outer side", function () {

            var pointer = new ABRectangle(new Point(50, 101), new Point(55, 106));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });
    });

    // filled rectangle

    describe("as a caller I want to check If a pointer hits the left side of an filled rect", function () {

        it("should return 'false', " +
            "when pointer misses shape on the left outer side", function () {

            var pointer = new ABRectangle(new Point(0, 0), new Point(4, 4));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the left outer side", function () {

            var pointer = new ABRectangle(new Point(1, 1), new Point(5, 5));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

    });

    describe("as a caller I want to check If a pointer hits the right side of an filled rect", function () {

        it("should return 'true', " +
            "when pointer touches shape on the right outer side", function () {

            var pointer = new ABRectangle(new Point(100, 5), new Point(105, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the right outer side", function () {

            var pointer = new ABRectangle(new Point(101, 5), new Point(106, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });
    });

    describe("as a caller I want to check If a pointer hits the top side of an filled rect", function () {

        it("should return 'false', " +
            "when pointer misses shape on the top outer side", function () {

            var pointer = new ABRectangle(new Point(50, 0), new Point(55, 5));
            var rectangle = new ABRectangle(new Point(0, 6), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the top outer side", function () {

            var pointer = new ABRectangle(new Point(50, 0), new Point(55, 5));
            var rectangle = new ABRectangle(new Point(0, 5), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });
    });

    describe("as a caller I want to check If a pointer hits the bottom side of an filled rect", function () {

        it("should return 'true', " +
            "when pointer touches shape on the bottom outer side", function () {

            var pointer = new ABRectangle(new Point(50, 100), new Point(55, 105));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the bottom outer side", function () {

            var pointer = new ABRectangle(new Point(50, 101), new Point(55, 106));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = RectCollisionDetector.checkFilledRectangle(pointer, rectangle);

            expect(actual).toBeFalsy();
        });
    });
});