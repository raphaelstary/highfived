define(['input/CircleActionInterpreter', 'input/PointerAction'], function (CircleActionInterpreter, PointerAction) {
    describe("as a user I click on the center point to start the edit action: move / change position", function () {

        it("should return 'NOTHING' " +
            "when I miss all points", function () {
            var pointer = {
                center: {
                    xPoint: 500,
                    yPoint: 500
                },
                radius: 2
            };
            var circle = {
                center: {
                    xPoint: 100,
                    yPoint: 100
                },
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
                center: {
                    xPoint: 100,
                    yPoint: 100
                },
                radius: 2
            };
            var circle = {
                center: {
                    xPoint: 100,
                    yPoint: 100
                },
                radius: 50
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === circle.center.xPoint &&
                    actionPoint.center.yPoint === circle.center.yPoint;
            };

            var cut = new CircleActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, circle);

            expect(actual).toBe(PointerAction.MOVE);
        });
    });

    describe("as a user I click on the arc point to start the edit action: change radius", function () {

        it("should return 'RESIZE_RADIUS' " +
            "when I hit the arc point", function () {
            var pointer = {
                center: {
                    xPoint: 150,
                    yPoint: 100
                },
                radius: 2
            };
            var circle = {
                center: {
                    xPoint: 100,
                    yPoint: 100
                },
                radius: 50
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === circle.center.xPoint + circle.radius &&
                    actionPoint.center.yPoint === circle.center.yPoint;
            };

            var cut = new CircleActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, circle);

            expect(actual).toBe(PointerAction.RESIZE_RADIUS);
        });
    });
});