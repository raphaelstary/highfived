define(['input/LineActionInterpreter', 'input/PointerAction'], function (LineActionInterpreter, PointerAction) {
    describe("as a user I click on the 'point A' action point of a line to start the edit action", function () {

        it("should return 'NOTHING' " +
            "when I miss all points", function () {
            var pointer = {
                xPoint: 500,
                yPoint: 500,
                radius: 2
            };
            var line = {
                xPointA: 100,
                yPointA: 100,
                xPointB: 150,
                yPointB: 100
            };
            var checkCollision = function () {
                return false;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, line);

            expect(actual).toBe(PointerAction.NOTHING);
        });

        it("should return 'CHANGE_POINT_A' " +
            "when I hit point A", function () {
            var pointer = {
                xPoint: 100,
                yPoint: 100,
                radius: 2
            };
            var line = {
                xPointA: 100,
                yPointA: 100,
                xPointB: 150,
                yPointB: 100
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.xPoint === line.xPointA && actionPoint.yPoint === line.yPointA;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, line);

            expect(actual).toBe(PointerAction.CHANGE_POINT_A);
        });
    });

    describe("as a user I click on the 'point B' action point of a line to start the edit action", function () {

        it("should return 'CHANGE_POINT_B' " +
            "when I hit point B", function () {
            var pointer = {
                xPoint: 150,
                yPoint: 100,
                radius: 2
            };
            var line = {
                xPointA: 100,
                yPointA: 100,
                xPointB: 150,
                yPointB: 100
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.xPoint === line.xPointB && actionPoint.yPoint === line.yPointB;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, line);

            expect(actual).toBe(PointerAction.CHANGE_POINT_B);
        });
    });

    describe("as a user I click on 'control point A' action point of a line to start the " +
        "edit action: transform to bezier curve", function() {

        it("should return 'TRANSFORM_FROM_POINT_A " +
            "when I hit control point A", function () {

        });
    });

    describe("as a user I click on 'control point B' action point of a line to start the " +
        "edit action: transform to bezier curve", function() {

    });
});