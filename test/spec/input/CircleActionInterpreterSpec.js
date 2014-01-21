define(['input/CircleActionInterpreter', 'input/PointerAction'], function (CircleActionInterpreter, PointerAction) {
    describe("as a user I click on the center point to start the edit action: move / change position", function () {

        it("should return 'NOTHING' " +
            "when I miss all points", function () {
            var pointer = {};
            var circle = {};
            var checkCollision = function () {
                return false;
            };

            var cut = new CircleActionInterpreter(checkCollision);

            var actual = cut.interpret(pointer, circle);

            expect(actual).toBe(PointerAction.NOTHING);
        });
    });

    describe("as a user I click on the arc point to start the edit action: change radius", function () {

    });
});