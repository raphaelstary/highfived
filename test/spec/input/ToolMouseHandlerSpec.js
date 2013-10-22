define(['input/ToolMouseHandler', 'lib/knockout', 'view/Layer', 'view/Item', 'input/PointerAction', 'spec/input/expectItem'], function (
    ToolMouseHandler, ko, Layer, Item, PointerAction, expectItem) {

    var layers, layerOne, layerOneItems, itemOne, checkPointerItemCollision, interpretItemAction;

    describe("as a user I want to draw a new rect", function () {

        it("should create a new item, " +
            "when you start drawing", function () {

            var cut = new ToolMouseHandler(layers);

            expect(layerOneItems.length).toBe(0);

            cut.handleDown({clientX: 0, clientY: 0});

            expect(layerOneItems.length).toBe(1);

            var item = layerOneItems[0];
            expect(item).toBeDefined();
            expect(item instanceof Item).toBeTruthy();

            expectItem(item).fn('xPoint').toBe(0).fn('yPoint').toBe(0).fn('width').toBe(10).fn('height').toBe(10);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleMove({clientX: 100, clientY: 100});

            expectItem(item).fn('xPoint').toBe(0).fn('yPoint').toBe(0).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 100, clientY: 100});

            expectItem(item).fn('xPoint').toBe(0).fn('yPoint').toBe(0).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should normalize item's width and height, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 200, clientY: 200});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 100, clientY: 100});

            expectItem(item).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        beforeEach(setUpLayersWithZeroItems);
    });

    describe("as a user I want to resize an existing rect", function () {
        // ############################## mouse move method:

        it("should change nothing on existing item (instead creates a new one), " +
            "when moving mouse cursor, " +
            "given no item has been selected", function () {

            checkPointerItemCollision = function () {
                return false;
            };
            var interpretItemAction = function () {
                return PointerAction.RESIZE_BOTTOM_AND_RIGHT;
            };

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 500, clientY: 500});

            expect(layerOneItems.length).toBe(2);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change nothing on existing item (instead creates a new one), " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and no action point has been selected", function () {

            selectItemAndSetAction(PointerAction.NOTHING);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 500, clientY: 500});

            expect(layerOneItems.length).toBe(2);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'bottom & right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(200).fn('height').toBe(200);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'top & left' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_TOP_AND_LEFT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(50).fn('width').toBe(150).fn('height').toBe(150);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'top & right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_TOP_AND_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 250, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(50).fn('width').toBe(150).fn('height').toBe(150);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'bottom & left' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_LEFT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 50, clientY: 250});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(100).fn('width').toBe(150).fn('height').toBe(150);
        });

        it("should change item's width, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(200).fn('height').toBe(100);
        });

        it("should change item's height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'bottom' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(200);
        });

        it("should change item's width, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'left' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_LEFT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(100).fn('width').toBe(150).fn('height').toBe(100);
        });

        it("should change item's height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'top' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_TOP);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(50).fn('width').toBe(100).fn('height').toBe(150);
        });

        // ############################## mouse up method:

        it("should change nothing on existing item (instead creates a new one), " +
            "when releasing click button, " +
            "given no item has been selected", function () {

            checkPointerItemCollision = function () {
                return false;
            };
            var interpretItemAction = function () {
                return PointerAction.RESIZE_BOTTOM_AND_RIGHT;
            };

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 500, clientY: 500});

            expect(layerOneItems.length).toBe(2);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change nothing on existing item (instead creates a new one), " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and no action point has been selected", function () {

            selectItemAndSetAction(PointerAction.NOTHING);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 500, clientY: 500});

            expect(layerOneItems.length).toBe(2);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change item's width and height, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'bottom & right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(200).fn('height').toBe(200);
        });

        it("should change item's width and height, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'top & left' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_TOP_AND_LEFT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(50).fn('width').toBe(150).fn('height').toBe(150);
        });

        it("should change item's width and height, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'top & right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_TOP_AND_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 250, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(50).fn('width').toBe(150).fn('height').toBe(150);
        });

        it("should change item's width and height, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'bottom & left' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_LEFT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 50, clientY: 250});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(100).fn('width').toBe(150).fn('height').toBe(150);
        });

        it("should change item's width, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(200).fn('height').toBe(100);
        });

        it("should change item's height, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'bottom' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(200);
        });

        it("should change item's width, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'left' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_LEFT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(100).fn('width').toBe(150).fn('height').toBe(100);
        });

        it("should change item's height, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'top' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_TOP);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(50).fn('width').toBe(100).fn('height').toBe(150);
        });

        it("should normalize the changed item, " +
            "when releasing click button, " +
            "given one item has been selected " +
            " and the 'bottom & right' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(50).fn('width').toBe(50).fn('height').toBe(50);
        });

        it("should change nothing on recently changed item (instead creates a new one), " +
            "when releasing click button, " +
            "given one item was selected & changed", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_RIGHT);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 200, clientY: 200});
            cut.handleMove({clientX: 250, clientY: 250});
            cut.handleMove({clientX: 275, clientY: 275});
            cut.handleUp({clientX: 300, clientY: 300});

            cut._checkCollision = function() {
                return false;
            };
            cut._interpretAction = function () {
                return PointerAction.NOTHING;
            };

            cut.handleDown({clientX: 350, clientY: 350});
            cut.handleMove({clientX: 400, clientY: 400});
            cut.handleMove({clientX: 425, clientY: 425});
            cut.handleUp({clientX: 450, clientY: 450});

            expect(layerOneItems.length).toBe(2);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(200).fn('height').toBe(200);
        });

        beforeEach(setUpLayersWithOneItemAndCollisionService);
    });

    describe("as a user I want to move an existing rect", function () {

        it("should change item's x & y coordinates, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'move' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change item's x & y coordinates, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'move' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        beforeEach(setUpLayersWithOneItemAndCollisionService);
    });

    describe('tool click handler handles all click events in case the ui is in edit mode', function () {
        it("should throw an exception, " +
            "when it's initialized with undefined layer model", function () {

            var ex;
            try {
                new ToolMouseHandler(undefined);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe("Illegal argument: layer model not provided");
        });

        it("should throw an exception, " +
            "when it's initialized with null layer model", function () {

            var ex;
            try {
                new ToolMouseHandler(null);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe("Illegal argument: layer model not provided");
        });
    });

    describe('handle mouse down event. with handleDown call. Parameter validation', function () {
        beforeEach(setUpLayersWithOneItemAndCollisionService);

        it("should throw an exception, " +
            "when it's called with undefined", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);

            var ex;
            try {
                toolMouseHandler.handleDown(undefined);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + undefined);

        });

        it("should throw an exception, " +
            "when it's called with null", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);

            var ex;
            try {
                toolMouseHandler.handleDown(null);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + null);

        });

        it("should throw an exception, " +
            "when it's called and the parameter object doesn't hold clientX & clientY values", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);
            var ex;
            try {
                toolMouseHandler.handleDown({});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });
    });

    describe('handle mouse move event. with handleMove call. Parameter validation', function () {
        beforeEach(setUpLayersWithOneItemAndCollisionService);

        it("should throw an exception, " +
            "when it's called with undefined", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);

            var ex;
            try {
                toolMouseHandler.handleMove(undefined);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + undefined);

        });

        it("should throw an exception, " +
            "when it's called with null", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);

            var ex;
            try {
                toolMouseHandler.handleMove(null);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + null);

        });

        it("should throw an exception, " +
            "when it's called and the parameter object doesn't hold clientX & clientY values", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);
            var ex;
            try {
                toolMouseHandler.handleMove({});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });
    });

    describe('handle mouse up event. with handleUp call. Parameter validation', function () {
        beforeEach(setUpLayersWithOneItemAndCollisionService);

        it("should throw an exception, " +
            "when it's called with undefined", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);

            var ex;
            try {
                toolMouseHandler.handleUp(undefined);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + undefined);

        });

        it("should throw an exception, " +
            "when it's called with null", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);

            var ex;
            try {
                toolMouseHandler.handleUp(null);
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + null);

        });

        it("should throw an exception, " +
            "when it's called and the parameter object doesn't hold clientX & clientY values", function () {

            var toolMouseHandler = new ToolMouseHandler(layers);
            var ex;
            try {
                toolMouseHandler.handleUp({});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });
    });

    describe("handle internal object state, " +
        "new class -> 1 time 'handleDown' -> 0..n times 'handleMove' -> 1 time 'handleUp' -> " +
        "1 time 'handleDown'", function () {

        it ("should do nothing to the model, " +
            "when 'handleMove' is called 1st before 'handleDown' " +
            "given an item was moved", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 300, clientY: 300});
            cut.handleUp({clientX: 350, clientY: 350});

            cut.handleMove({clientX: 600, clientY: 600});

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it ("should do nothing to the model, " +
            "when 'handleMove' is called 1st before 'handleDown' " +
            "given an item was moved", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 310, clientY: 310});
            cut.handleMove({clientX: 300, clientY: 300});
            cut.handleUp({clientX: 350, clientY: 350});

            cut.handleUp({clientX: 600, clientY: 600});

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it ("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given it was already called", function () {

            setUpLayersWithZeroItems();
            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleDown({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(0);
        });

        it ("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given a move was not finished", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(1);
            //todo when new rect was created but not finished than delete new rect,
            // when rect was changed but not finished than revert rect
            // add expect.length 1 to created and so on ITs
            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it ("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given an item was created but not finished", function () {

            setUpLayersWithZeroItems();

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(0);
        });

        beforeEach(setUpLayersWithOneItemAndCollisionService);
    });

    function selectItemAndSetAction(action) {
        itemOne.isSelected(true);

        interpretItemAction = function () {
            return action;
        };
    }

    function setUpLayersWithOneItemAndCollisionService() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray([new Item('onlyItem', 100, 100, 100, 100)]))
        ]);
        setUpLayerVars();

        checkPointerItemCollision = function () {
            return true;
        };
    }

    function setUpLayersWithZeroItems() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray())
        ]);
        setUpLayerVars();
    }

    function setUpLayerVars() {
        layerOne = layers()[0];
        layerOneItems = layerOne.items();
        itemOne = layerOneItems[0];
    }
});