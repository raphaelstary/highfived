define(['input/ToolMouseHandler', 'lib/knockout', 'model/Layer', 'model/Rectangle', 'input/PointerAction',
    'spec/input/expectItem', 'model/LayerBucket', 'model/Line', 'model/Circle'], function (ToolMouseHandler, ko, Layer, Rectangle,
    PointerAction, expectItem, LayerBucket, Line, Circle) {

    var layerBucket, layers, layerOne, layerOneItems, itemOne, checkPointerItemCollision, interpretItemAction;

    describe("as a user I want to draw a new rect", function () {

        it("should create a new item, " +
            "when you start drawing", function () {

            var cut = new ToolMouseHandler(layerBucket);

            expect(layerOneItems.length).toBe(0);

            cut.handleDown({clientX: 0, clientY: 0});

            expect(layerOneItems.length).toBe(1);

            var item = layerOneItems[0];
            expect(item).toBeDefined();
            expect(item instanceof Rectangle).toBeTruthy();

            expectItem(item).fn('xPoint').toBe(0).fn('yPoint').toBe(0).fn('width').toBe(10).fn('height').toBe(10);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleMove({clientX: 100, clientY: 100});

            expectItem(item).fn('xPoint').toBe(0).fn('yPoint').toBe(0).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 100, clientY: 100});

            expectItem(item).fn('xPoint').toBe(0).fn('yPoint').toBe(0).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should normalize item's width and height, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 200, clientY: 200});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 100, clientY: 100});

            expectItem(item).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should draw a new item in the active layer, " +
            "when I create one with the mouse cursor " +
            "given two layers", function () {

            var layerTwo = new Layer('layerTwo', ko.observableArray(), 'rectangle');
            layerOne.isActive(false);
            layerTwo.isActive(true);
            layerBucket.layers.push(layerTwo);
            layerBucket.activeLayer = layerTwo;
            layerTwo.items.forEach = forEach;

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 200, clientY: 200});

            expect(layerOneItems.length).toBe(0);
            expect(layerTwo.items().length).toBe(1);
        });

        beforeEach(setUpRectLayerWithZeroItems);
    });

    describe("as a user I want to create a new line", function () {

        it("should create a new item, " +
            "when you start drawing", function () {

            var cut = new ToolMouseHandler(layerBucket);

            expect(layerOneItems.length).toBe(0);

            cut.handleDown({clientX: 0, clientY: 0});

            expect(layerOneItems.length).toBe(1);

            var item = layerOneItems[0];
            expect(item).toBeDefined();
            expect(item instanceof Line).toBeTruthy();

            expectItem(item).fn('xPointA').toBe(0).fn('yPointA').toBe(0);
        });

        it("should change item's 2nd point coordinates, " +
            "when moving the mouse cursor " +
            "given a new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleMove({clientX: 50, clientY: 50});

            expectItem(item).fn('xPointA').toBe(0).fn('yPointA').toBe(0)
                .fn('xPointB').toBe(50).fn('yPointB').toBe(50);
        });

        it("should change item's 2nd point coordinates, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 5, clientY: 15});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 55, clientY: 20});

            expectItem(item).fn('xPointA').toBe(5).fn('yPointA').toBe(15)
                .fn('xPointB').toBe(55).fn('yPointB').toBe(20);
        });

        beforeEach(setUpOneLineLayerWithZeroItems);
    });

    describe("as a user I want to create a new circle", function () {
        it("should create a new item, " +
            "when you start drawing", function () {

            var cut = new ToolMouseHandler(layerBucket);

            expect(layerOneItems.length).toBe(0);

            cut.handleDown({clientX: 3, clientY: 2});

            expect(layerOneItems.length).toBe(1);

            var item = layerOneItems[0];
            expect(item).toBeDefined();
            expect(item instanceof Circle).toBeTruthy();

            expectItem(item).fn('xPoint').toBe(3).fn('yPoint').toBe(2);
        });

        it("should change item's radius length, " +
            "when moving the mouse cursor " +
            "given a new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 100, clientY: 100});
            var item = layerOneItems[0];

            cut.handleMove({clientX: 150, clientY: 100});

            expectItem(item).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('radius').toBe(50);
        });

        it("should change item's radius length, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 100, clientY: 100});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 50, clientY: 100});

            expectItem(item).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('radius').toBe(50);
        });

        beforeEach(setUpOneCircleLayerWithZeroItems);
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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(50).fn('yPoint').toBe(50).fn('width').toBe(50).fn('height').toBe(50);
        });

        it("should change nothing on recently changed item (instead creates a new one), " +
            "when releasing click button, " +
            "given one item was selected & changed", function () {

            selectItemAndSetAction(PointerAction.RESIZE_BOTTOM_AND_RIGHT);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 200, clientY: 200});
            cut.handleMove({clientX: 250, clientY: 250});
            cut.handleMove({clientX: 275, clientY: 275});
            cut.handleUp({clientX: 300, clientY: 300});

            cut._checkCollision = function () {
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

    describe("as a user I want to move an existing circle", function () {
        it("should change item's x & y coordinates, " +
            "when moving mouse cursor " +
            "given one item has been selected " +
            " and the 'move' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(350).fn('yPoint').toBe(350).fn('radius').toBe(50);
        });

        it("should change item's x & y coordinates, " +
            "when moving mouse to end position cursor " +
            "given one item has been selected " +
            " and the 'move' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(350).fn('yPoint').toBe(350).fn('radius').toBe(50);
        });

        beforeEach(function () {
            setUpLayerWithOneCircle();
            setUpCollisionService();
        });
    });

    describe("as a user I want to resize an existing circle", function () {

        it("should change item's radius " +
            "when moving the mouse cursor " +
            "given one item was selected " +
            " and the 'resize radius' action point was selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_RADIUS);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 200, clientY: 100});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('radius').toBe(100);
        });

        it("should change item's radius " +
            "when moving the mouse cursor to its end position " +
            "given one item was selected " +
            " and the 'resize radius' action point was selected", function () {

            selectItemAndSetAction(PointerAction.RESIZE_RADIUS);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleUp({clientX: 250, clientY: 100});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('radius').toBe(150);
        });

        beforeEach(function () {
            setUpLayerWithOneCircle();
            setUpCollisionService();
        });
    });

    describe("as a user I want to edit the point coordinates of a line", function () {

        it("should change item's point a coordinates " +
            "when moving the mouse cursor " +
            "given one item was selected " +
            " and the 'change point a' action point was selected", function () {

            selectItemAndSetAction(PointerAction.CHANGE_POINT_A);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 100, clientY: 100});

            cut.handleMove({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPointA').toBe(50).fn('yPointA').toBe(50)
                .fn('xPointB').toBe(200).fn('yPointB').toBe(100);
        });


        it("should change item's point a coordinates " +
            "when moving the mouse cursor to its end position " +
            "given one item was selected " +
            " and the 'change point a' action point was selected", function () {

            selectItemAndSetAction(PointerAction.CHANGE_POINT_A);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 100, clientY: 100});

            cut.handleUp({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPointA').toBe(50).fn('yPointA').toBe(50)
                .fn('xPointB').toBe(200).fn('yPointB').toBe(100);
        });

        it("should change item's point b coordinates " +
            "when moving the mouse cursor " +
            "given one item was selected " +
            " and the 'change point b' action point was selected", function () {

            selectItemAndSetAction(PointerAction.CHANGE_POINT_B);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 200, clientY: 100});

            cut.handleMove({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPointA').toBe(100).fn('yPointA').toBe(100)
                .fn('xPointB').toBe(300).fn('yPointB').toBe(300);
        });


        it("should change item's point b coordinates " +
            "when moving the mouse cursor to its end position " +
            "given one item was selected " +
            " and the 'change point b' action point was selected", function () {

            selectItemAndSetAction(PointerAction.CHANGE_POINT_B);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 200, clientY: 100});

            cut.handleUp({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPointA').toBe(100).fn('yPointA').toBe(100)
                .fn('xPointB').toBe(350).fn('yPointB').toBe(350);
        });

        beforeEach(function () {
            setUpLayerWithOneLine();
            setUpCollisionService();
        });
    });

    describe("as a user I want to move an existing rect", function () {

        it("should change item's x & y coordinates, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'move' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(1);

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should change item's x & y coordinates, " +
            "when moving & stopping mouse cursor, " +
            "given one item has been selected " +
            " and the 'move' action point has been selected", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

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

        it("should throw an exception, " +
            "when it's initialized with layer model with null layers", function () {

            var ex;
            try {
                new ToolMouseHandler(new LayerBucket());
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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);

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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);

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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleDown({});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });

        it("should throw an exception, " +
            "when it's called and the parameter object properties clientX & clientY are no positive numbers", function () {

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleDown({clientX: -1, clientY: -1});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });

        it("should throw an exception, " +
            "when it's called and the parameter object properties clientX & clientY are not of type numeric", function () {

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleDown({clientX: true, clientY: true});
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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);

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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);

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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleMove({});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });

        it("should throw an exception, " +
            "when it's called and the parameter object properties clientX & clientY are no positive numbers", function () {

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleMove({clientX: -1, clientY: -1});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });

        it("should throw an exception, " +
            "when it's called and the parameter object properties clientX & clientY are not of type numeric", function () {

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleMove({clientX: true, clientY: true});
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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);

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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);

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

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleUp({});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });

        it("should throw an exception, " +
            "when it's called and the parameter object properties clientX & clientY are no positive numbers", function () {

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleUp({clientX: -1, clientY: -1});
            } catch (e) {
                ex = e;
            }

            expect(ex).toBeDefined();
            expect(ex).toBe('Illegal argument: ' + {});
        });

        it("should throw an exception, " +
            "when it's called and the parameter object properties clientX & clientY are not of type numeric", function () {

            var toolMouseHandler = new ToolMouseHandler(layerBucket);
            var ex;
            try {
                toolMouseHandler.handleUp({clientX: true, clientY: true});
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

        it("should do nothing to the model, " +
            "when 'handleMove' is called 1st before 'handleDown' " +
            "given an item was moved", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 300, clientY: 300});
            cut.handleUp({clientX: 350, clientY: 350});

            cut.handleMove({clientX: 600, clientY: 600});

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should do nothing to the model, " +
            "when 'handleMove' is called 1st before 'handleDown' " +
            "given an item was moved", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 310, clientY: 310});
            cut.handleMove({clientX: 300, clientY: 300});
            cut.handleUp({clientX: 350, clientY: 350});

            cut.handleUp({clientX: 600, clientY: 600});

            expectItem(itemOne).fn('xPoint').toBe(300).fn('yPoint').toBe(300).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given it was already called", function () {

            setUpRectLayerWithZeroItems();
            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleDown({clientX: 350, clientY: 350});

            expect(layerOneItems.length).toBe(0);
        });

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given a move was not finished", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(1);
            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('width').toBe(100).fn('height').toBe(100);
        });

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given an item was created but not finished", function () {

            setUpRectLayerWithZeroItems();

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(0);
        });

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given an item was created but not finished with two layers", function () {

            setUpRectLayerWithZeroItems();
            var layerTwo = new Layer('layerTwo', ko.observableArray());
            layerOne.isActive(false);
            layerTwo.isActive(true);
            layerBucket.layers.push(layerTwo);
            layerTwo.items.forEach = forEach;

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerTwo.items().length).toBe(0);
        });

        beforeEach(setUpLayersWithOneItemAndCollisionService);
    });

    describe("handle internal object state with circles, " +
        "new class -> 1 time 'handleDown' -> 0..n times 'handleMove' -> 1 time 'handleUp' -> " +
        "1 time 'handleDown'", function () {

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given a move was not finished", function () {

            selectItemAndSetAction(PointerAction.MOVE);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(1);
            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('radius').toBe(50);
        });

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given a move was not finished", function () {

            selectItemAndSetAction(PointerAction.RESIZE_RADIUS);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 100, clientY: 100});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(1);
            expectItem(itemOne).fn('xPoint').toBe(100).fn('yPoint').toBe(100).fn('radius').toBe(50);
        });

        beforeEach(function () {
            setUpLayerWithOneCircle();
            setUpCollisionService();
        });
    });

    describe("handle internal object state with circles, " +
        "new class -> 1 time 'handleDown' -> 0..n times 'handleMove' -> 1 time 'handleUp' -> " +
        "1 time 'handleDown'", function () {

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given a move was not finished", function () {

            selectItemAndSetAction(PointerAction.CHANGE_POINT_A);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(1);
            expectItem(itemOne).fn('xPointA').toBe(100).fn('yPointA').toBe(100)
                .fn('xPointB').toBe(200).fn('yPointB').toBe(100);
        });

        it("should do nothing to the model, " +
            "when 'handleDown' is called " +
            "given a move was not finished", function () {

            selectItemAndSetAction(PointerAction.CHANGE_POINT_B);

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 100, clientY: 100});
            cut.handleMove({clientX: 350, clientY: 350});

            cut.handleDown({clientX: 600, clientY: 600});

            expect(layerOneItems.length).toBe(1);
            expectItem(itemOne).fn('xPointA').toBe(100).fn('yPointA').toBe(100)
                .fn('xPointB').toBe(200).fn('yPointB').toBe(100);
        });

        beforeEach(function () {
            setUpLayerWithOneLine();
            setUpCollisionService();
        });
    });

    describe("in standard editing only the last item with which I interact is activated", function () {
    // as a user I want to select a rect
        it("should create a new item which is active, " +
            "when 'handleDown' is called", function () {
            setUpRectLayerWithZeroItems();

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});

            var item = layerOneItems[0];
            expect(item.isActive()).toBeTruthy();
        });

        it("should deactivate all active shapes, " +
            "when a new item started " +
            "given there is an active item", function () {

            setUpLayersWithOneItemAndCollisionService();
            selectItemAndSetAction(PointerAction.NOTHING);

            checkPointerItemCollision = function () {
                return false;
            };

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            expect(itemOne.isActive()).toBeFalsy();
        });

        it("should deactivate all active shapes and activate one, " +
            "when a new item is selected " +
            "given there is an active item", function () {

            setUpLayersWithOneItemAndCollisionService();
            selectItemAndSetAction(PointerAction.NOTHING);
            var itemTwo = new Rectangle('onlyItem', 300, 300, 100, 100);
            layerOneItems.push(itemTwo);

            checkPointerItemCollision = function (pointer, abRect) {
                return abRect.pointA.xPoint == itemTwo.xPoint() && abRect.pointA.yPoint == itemTwo.yPoint();
            };

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 300, clientY: 300});

            expect(itemOne.isActive()).toBeFalsy();
            expect(itemTwo.isActive()).toBeTruthy();
        });

        it("should select an new active item, " +
            "when 'handleDown' is called", function () {
            setUpRectLayerWithZeroItems();

            var cut = new ToolMouseHandler(layerBucket);

            cut.handleDown({clientX: 0, clientY: 0});

            var item = layerOneItems[0];
            expect(item.isSelected).toBeTruthy();
        });

        it("should select an item, " +
            "when it gets active " +
            "given there is an item", function () {

            setUpLayersWithOneItemAndCollisionService();

            checkPointerItemCollision = function () {
                return true;
            };

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 100, clientY: 100});

            expect(itemOne.isActive()).toBeTruthy();
            expect(itemOne.isSelected()).toBeTruthy();
        });

        it("shouldn't change its values " +
            "when an item gets selected/active " +
            "given there are two items", function () {

            setUpRectLayerWithZeroItems();
            checkPointerItemCollision = function (pointer) {
                return pointer.pointA.xPoint == 198 && pointer.pointA.yPoint == 148;
            };

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);
            // create 1st rect
            cut.handleDown({clientX: 100, clientY: 100});
            cut.handleUp({clientX: 200, clientY: 200});

            // create 2nd rect
            cut.handleDown({clientX: 300, clientY: 300});
            cut.handleUp({clientX: 400, clientY: 400});

            // select 1st rect
            cut.handleDown({clientX: 200, clientY: 150});
            cut.handleUp({clientX: 200, clientY: 150});

            expect(layerOneItems[0].width()).toBe(100);
            expect(layerOneItems[0].height()).toBe(100);
        });

        it("shouldn't create a new item, " +
            "when I want to select an existing item and mistakenly miss it with my pointer " +
            "given there is an item", function () {

            setUpLayersWithOneRect();

            checkPointerItemCollision = function () {
                return false;
            };

            var cut = new ToolMouseHandler(layerBucket, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 210, clientY: 150});
            cut.handleUp({clientX: 210, clientY: 150});

            expect(layerOneItems.length).toBe(1);
        });
    });

    function selectItemAndSetAction(action) {
        itemOne.isActive(true);
        layerBucket.activeItem = itemOne;

        interpretItemAction = function () {
            return action;
        };
    }

    function setUpLayersWithOneItemAndCollisionService() {
        setUpLayersWithOneRect();
        setUpCollisionService();
    }

    function setUpCollisionService() {
        checkPointerItemCollision = function () {
            return true;
        };
    }

    function setUpLayersWithOneRect() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray([new Rectangle('onlyItem', 100, 100, 100, 100)]), 'rectangle')
        ]);
        layerBucket = new LayerBucket(layers);
        setUpLayerVars();
    }

    function setUpRectLayerWithZeroItems() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray(), 'rectangle')
        ]);
        layerBucket = new LayerBucket(layers);
        setUpLayerVars();
    }

    function setUpLayerWithOneLine() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray([new Line('onlyItem', 100, 100, 200, 100)]), 'line')
        ]);
        layerBucket = new LayerBucket(layers);
        setUpLayerVars();
    }

    function setUpOneLineLayerWithZeroItems() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray(), 'line')
        ]);
        layerBucket = new LayerBucket(layers);
        setUpLayerVars();
    }

    function setUpLayerWithOneCircle() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray([new Circle('onlyItem', 100, 100, 50)]), 'circle')
        ]);
        layerBucket = new LayerBucket(layers);
        setUpLayerVars();
    }

    function setUpOneCircleLayerWithZeroItems() {
        layers = ko.observableArray([
            new Layer('layerOne', ko.observableArray(), 'circle')
        ]);
        layerBucket = new LayerBucket(layers);
        setUpLayerVars();
    }

    function setUpLayerVars() {
        layerOne = layers()[0];
        layerOne.isActive(true);
        layerBucket.activeLayer = layerOne;

        layerOneItems = layerOne.items();
        itemOne = layerOneItems[0];

        setupForEach();
    }

    function setupForEach() {
        layers.forEach = forEach;
        layerOne.items.forEach = forEach;
    }

    function forEach(fn) {
        ko.utils.arrayForEach(this(), fn);
    }
});