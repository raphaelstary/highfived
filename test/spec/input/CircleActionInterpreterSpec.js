define(['input/CircleActionInterpreter', 'input/PointerAction'], function (CircleActionInterpreter, PointerAction) {
    describe("as a user I click on the center point to start the edit action: move / change position", function () {

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

            var cut = new CircleActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, circle);

            expect(actual).toBe(PointerAction.NOTHING);
        });

        it("should return 'MOVE' " +
            "when I hit the center point", function () {
            var pointer = {
                xPoint: 100,
                yPoint: 100,
                radius: 2
            };
            var circle = {
                xPoint: 100,
                yPoint: 100,
                radius: 50
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.xPoint === circle.xPoint && actionPoint.yPoint === circle.yPoint;
            };

            var cut = new CircleActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, circle);

            expect(actual).toBe(PointerAction.MOVE);
        });
    });

    describe("as a user I click on the arc point to start the edit action: change radius", function () {

    });
});