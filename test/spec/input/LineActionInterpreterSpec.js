define(['input/LineActionInterpreter', 'input/PointerAction'], function (LineActionInterpreter, PointerAction) {
    describe("as a user I click on the 'point A' action point of a line to start the edit action", function () {

        it("should return 'NOTHING' " +
            "when I miss all points", function () {
            var pointer = {
                xPoint: 500,
                yPoint: 500,
                radius: 2
            };
            var circle = {
                xPoint: 100,
                yPoint: 100,
                radius: 50
            };
            var checkCollision = function () {
                return false;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, circle);

            expect(actual).toBe(PointerAction.NOTHING);
        });

//        it("should return 'MOVE' " +
//            "when I hit the center point", function () {
//            var pointer = {
//                xPoint: 100,
//                yPoint: 100,
//                radius: 2
//            };
//            var circle = {
//                xPoint: 100,
//                yPoint: 100,
//                radius: 50
//            };
//            var checkCollision = function (actionPoint, pointer) {
//                return actionPoint.xPoint === circle.xPoint && actionPoint.yPoint === circle.yPoint;
//            };
//
//            var cut = new CircleActionInterpreter(checkCollision);
//
//            var actual = cut.interpret(pointer, circle);
//
//            expect(actual).toBe(PointerAction.MOVE);
//        });
    });

    describe("as a user I click on the 'point B' action point of a line to start the edit action", function () {

    });

    describe("as a user I click on 'control point A' action point of a line to start the " +
        "edit action: transform to bezier curve", function() {

    });

    describe("as a user I click on 'control point B' action point of a line to start the " +
        "edit action: transform to bezier curve", function() {

    });
});