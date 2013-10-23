define(['input/checkCollision', 'input/ABRectangle', 'input/Point'], function (checkCollision, ABRectangle, Point) {
    describe("as an InputHandler I want to know if a pointer collides with a shape's border.", function () {
        // rectangle's left side
        it("should return 'false', " +
            "when pointer misses shape on the left outer side", function () {

            var pointer = new ABRectangle(new Point(0, 0), new Point(4, 4));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the left outer side", function () {

            var pointer = new ABRectangle(new Point(1, 1), new Point(5, 5));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the left inner side", function () {

            var pointer = new ABRectangle(new Point(5, 5), new Point(10, 10));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the left inner side", function () {

            var pointer = new ABRectangle(new Point(6, 6), new Point(10, 10));
            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        // rectangle's right side
        it("should return 'false', " +
            "when pointer misses shape on the right inner side", function () {

            var pointer = new ABRectangle(new Point(94, 5), new Point(99, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the right inner side", function () {

            var pointer = new ABRectangle(new Point(95, 5), new Point(100, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'true', " +
            "when pointer touches shape on the right outer side", function () {

            var pointer = new ABRectangle(new Point(100, 5), new Point(105, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeTruthy();
        });

        it("should return 'false', " +
            "when pointer misses shape on the right outer side", function () {

            var pointer = new ABRectangle(new Point(101, 5), new Point(106, 10));
            var rectangle = new ABRectangle(new Point(0, 0), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

        // rectangle's top side

        it("should return 'false', " +
            "when pointer misses shape on the top outer side", function () {

            var pointer = new ABRectangle(new Point(50, 0), new Point(55, 5));
            var rectangle = new ABRectangle(new Point(0, 6), new Point(100, 100));

            var actual = checkCollision(pointer, rectangle);

            expect(actual).toBeFalsy();
        });

//        it("should return 'true', " +
//            "when pointer touches shape on the left outer side", function () {
//
//            var pointer = new ABRectangle(new Point(1, 1), new Point(5, 5));
//            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));
//
//            var actual = checkCollision(pointer, rectangle);
//
//            expect(actual).toBeTruthy();
//        });
//
//        it("should return 'true', " +
//            "when pointer touches shape on the left inner side", function () {
//
//            var pointer = new ABRectangle(new Point(5, 5), new Point(10, 10));
//            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));
//
//            var actual = checkCollision(pointer, rectangle);
//
//            expect(actual).toBeTruthy();
//        });
//
//        it("should return 'false', " +
//            "when pointer misses shape on the left inner side", function () {
//
//            var pointer = new ABRectangle(new Point(6, 6), new Point(10, 10));
//            var rectangle = new ABRectangle(new Point(5, 0), new Point(100, 100));
//
//            var actual = checkCollision(pointer, rectangle);
//
//            expect(actual).toBeFalsy();
//        });
    });
});