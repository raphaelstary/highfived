define(['input/ActionInterpreter', 'input/PointerAction', 'view/Item'], function (
    ActionInterpreter, PointerAction, Item) {

    describe("as a user I click on the 'top left' action point to start the edit action", function () {

        it("should return 'NOTHING' " +
            "when I miss the action point",  function () {

            var checkCollision = function () {
                return false;
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.NOTHING);
        });

        it("should return 'RESIZE_TOP_LEFT' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isTopLeft(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_TOP_AND_LEFT);
        });
    });

    describe("as a user I click on the 'top' action point to start the edit action", function () {

        it("should return 'RESIZE_TOP' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isTop(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_TOP);
        });
    });

    describe("as a user I click on the 'top right' action point to start the edit action", function () {

        it("should return 'RESIZE_TOP_RIGHT' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isTopRight(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_TOP_AND_RIGHT);
        });
    });

    describe("as a user I click on the 'left' action point to start the edit action", function () {

        it("should return 'RESIZE_LEFT' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isLeft(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_LEFT);
        });
    });

    describe("as a user I click on the 'move' action point to start the edit action", function () {

        it("should return 'MOVE' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isCenter(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.MOVE);
        });
    });

    describe("as a user I click on the 'right' action point to start the edit action", function () {

        it("should return 'RESIZE_RIGHT' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isRight(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_RIGHT);
        });
    });

    describe("as a user I click on the 'bottom left' action point to start the edit action", function () {

        it("should return 'RESIZE_BOTTOM_LEFT' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isBottomLeft(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_BOTTOM_AND_LEFT);
        });
    });

    describe("as a user I click on the 'bottom' action point to start the edit action", function () {

        it("should return 'RESIZE_BOTTOM' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isBottom(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_BOTTOM);
        });
    });

    describe("as a user I click on the 'bottom right' action point to start the edit action", function () {

        it("should return 'RESIZE_BOTTOM_RIGHT' " +
            "when I hit the action point",  function () {

            var checkCollision = function (pointer, actionPointAsRect) {
                return isBottomRight(actionPointAsRect, item);
            };

            var cut = new ActionInterpreter(checkCollision);

            var item = new Item('itemOne', 100, 100, 100, 100);

            var actual = cut.interpret({}, item);

            expect(actual).toBe(PointerAction.RESIZE_BOTTOM_AND_RIGHT);
        });
    });

    function isTopLeft(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + 2;
    }

    function isTop(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() + (rectItem.width()/2) - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + (rectItem.width()/2) + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + 2;
    }

    function isTopRight(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() + rectItem.width() - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + rectItem.width() + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + 2;
    }

    function isLeft(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint()  - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() + (rectItem.height()/2) - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + (rectItem.height()/2) + 2;
    }

    function isCenter(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() + (rectItem.width()/2) - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() + (rectItem.height()/2) - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + (rectItem.width()/2) + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + (rectItem.height()/2) + 2;
    }

    function isRight(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() + rectItem.width() - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() + (rectItem.height()/2) - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + rectItem.width() + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + (rectItem.height()/2) + 2;
    }

    function isBottomLeft(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint()  - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() + rectItem.height() - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + rectItem.height() + 2;
    }

    function isBottom(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() + (rectItem.width()/2) - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() + rectItem.height() - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + (rectItem.width()/2) + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + rectItem.height() + 2;
    }

    function isBottomRight(actionPoint, rectItem) {
        return actionPoint.pointA.xPoint === rectItem.xPoint() + rectItem.width() - 2 &&
            actionPoint.pointA.yPoint === rectItem.yPoint() + rectItem.height() - 2 &&
            actionPoint.pointB.xPoint === rectItem.xPoint() + rectItem.width() + 2 &&
            actionPoint.pointB.yPoint === rectItem.yPoint() + rectItem.height() + 2;
    }
});