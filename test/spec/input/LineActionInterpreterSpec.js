define(['input/LineActionInterpreter', 'input/PointerAction'], function (LineActionInterpreter, PointerAction) {
    describe("as a user I click on the 'point A' action point of a line to start the edit action", function () {

        it("should return 'NOTHING' " +
            "when I miss all points", function () {
            var pointer = {
                center: {
                    xPoint: 500,
                    yPoint: 500
                },
                radius: 2
            };
            var line = {
                pointA: {
                    xPoint: 100,
                    yPoint: 100
                },
                pointB: {
                    xPoint: 150,
                    yPoint: 100
                }
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
                center: {
                    xPoint: 100,
                    yPoint: 100
                },
                radius: 2
            };
            var line = {
                pointA: {
                    xPoint: 100,
                    yPoint: 100
                },
                pointB: {
                    xPoint: 150,
                    yPoint: 100
                }
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === line.pointA.xPoint && actionPoint.center.yPoint === line.pointA.yPoint;
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
                center: {
                    xPoint: 150,
                    yPoint: 100
                },
                radius: 2
            };
            var line = {
                pointA: {
                    xPoint: 100,
                    yPoint: 100
                },
                pointB: {
                    xPoint: 150,
                    yPoint: 100
                }
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === line.pointB.xPoint && actionPoint.center.yPoint === line.pointB.yPoint;
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
            var pointer = {
                center: {
                    xPoint: 130,
                    yPoint: 100
                },
                radius: 2
            };
            var line = {
                pointA: {
                    xPoint: 100,
                    yPoint: 100
                },
                pointB: {
                    xPoint: 190,
                    yPoint: 100
                }
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === 130 && actionPoint.center.yPoint === 100;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, line);

            expect(actual).toBe(PointerAction.TRANSFORM_FROM_POINT_A);
        });
    });

    describe("as a user I click on 'control point B' action point of a line to start the " +
        "edit action: transform to bezier curve", function() {

        it("should return 'TRANSFORM_FROM_POINT_B " +
            "when I hit control point A", function () {
            var pointer = {
                center: {
                    xPoint: 160,
                    yPoint: 100
                },
                radius: 2
            };
            var line = {
                pointA: {
                    xPoint: 100,
                    yPoint: 100
                },
                pointB: {
                    xPoint: 190,
                    yPoint: 100
                }
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === 160 && actionPoint.center.yPoint === 100;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, line);

            expect(actual).toBe(PointerAction.TRANSFORM_FROM_POINT_B);
        });
    });

    describe("as a user I click on the 'point B' action point of a line to start the edit action", function () {

        it("should return 'MOVE' " +
            "when I hit point B", function () {
            var pointer = {
                center: {
                    xPoint: 150,
                    yPoint: 100
                },
                radius: 2
            };
            var line = {
                pointA: {
                    xPoint: 100,
                    yPoint: 100
                },
                pointB: {
                    xPoint: 200,
                    yPoint: 100
                }
            };
            var checkCollision = function (actionPoint, pointer) {
                return actionPoint.center.xPoint === 150 && actionPoint.center.yPoint === 100;
            };

            var cut = new LineActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, line);

            expect(actual).toBe(PointerAction.MOVE);
        });
    });
});