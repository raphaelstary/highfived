define(['input/ToolMouseHandler', 'lib/knockout', 'view/Layer', 'view/Item', 'input/PointerAction'], function (
    ToolMouseHandler, ko, Layer, Item, PointerAction) {

    describe("as a user I want to draw a new rect", function () {
        var layers, layerOne, layerOneItems;

        it("should create a new item, " +
            "when you start drawing", function () {

            var cut = new ToolMouseHandler(layers);

            expect(layerOneItems.length).toBe(0);

            cut.handleDown({clientX: 0, clientY: 0});

            expect(layerOneItems.length).toBe(1);

            var item = layerOneItems[0];
            expect(item).toBeDefined();
            expect(item instanceof Item).toBeTruthy();

            expect(item.xPoint()).toBe(0);
            expect(item.yPoint()).toBe(0);
            expect(item.width()).toBe(10);
            expect(item.height()).toBe(10);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleMove({clientX: 100, clientY: 100});

            expect(item.xPoint()).toBe(0);
            expect(item.yPoint()).toBe(0);
            expect(item.width()).toBe(100);
            expect(item.height()).toBe(100);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 0, clientY: 0});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 100, clientY: 100});

            expect(item.xPoint()).toBe(0);
            expect(item.yPoint()).toBe(0);
            expect(item.width()).toBe(100);
            expect(item.height()).toBe(100);
        });

        it("should normalize item's width and height, " +
            "when moving mouse cursor has arrived at its end position, " +
            "given new item was created", function () {

            var cut = new ToolMouseHandler(layers);

            cut.handleDown({clientX: 200, clientY: 200});
            var item = layerOneItems[0];

            cut.handleUp({clientX: 100, clientY: 100});

            expect(item.xPoint()).toBe(100);
            expect(item.yPoint()).toBe(100);
            expect(item.width()).toBe(100);
            expect(item.height()).toBe(100);
        });

        beforeEach(function () {
            layers = ko.observableArray([
                new Layer('layerOne', ko.observableArray())
            ]);
            layerOne = layers()[0];
            layerOneItems = layerOne.items();
        });
    });

    describe("as a user I want to resize an existing rect", function () {
        var layers, layerOne, layerOneItems, itemOne, checkPointerItemCollision;

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

            expect(itemOne.xPoint()).toBe(100);
            expect(itemOne.yPoint()).toBe(100);
            expect(itemOne.width()).toBe(100);
            expect(itemOne.height()).toBe(100);
        });

        it("should change nothing on existing item (instead creates a new one), " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and no action point has been selected", function () {

            var interpretItemAction = function () {
                return PointerAction.NOTHING;
            };
            itemOne.isSelected(true);

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 500, clientY: 500});

            expect(layerOneItems.length).toBe(2);

            expect(itemOne.xPoint()).toBe(100);
            expect(itemOne.yPoint()).toBe(100);
            expect(itemOne.width()).toBe(100);
            expect(itemOne.height()).toBe(100);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'bottom & right' action point has been selected", function () {

            itemOne.isSelected(true);
            var interpretItemAction = function () {
                return PointerAction.RESIZE_BOTTOM_AND_RIGHT;
            };

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 300, clientY: 300});

            expect(layerOneItems.length).toBe(1);

            expect(itemOne.xPoint()).toBe(100);
            expect(itemOne.yPoint()).toBe(100);
            expect(itemOne.width()).toBe(200);
            expect(itemOne.height()).toBe(200);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'top & left' action point has been selected", function () {

            itemOne.isSelected(true);
            var interpretItemAction = function () {
                return PointerAction.RESIZE_TOP_AND_LEFT;
            };

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 50, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expect(itemOne.xPoint()).toBe(50);
            expect(itemOne.yPoint()).toBe(50);
            expect(itemOne.width()).toBe(150);
            expect(itemOne.height()).toBe(150);
        });

        it("should change item's width and height, " +
            "when moving mouse cursor, " +
            "given one item has been selected " +
            " and the 'top & right' action point has been selected", function () {

            itemOne.isSelected(true);
            var interpretItemAction = function () {
                return PointerAction.RESIZE_TOP_AND_RIGHT;
            };

            var cut = new ToolMouseHandler(layers, checkPointerItemCollision, interpretItemAction);

            cut.handleDown({clientX: 0, clientY: 0});

            cut.handleMove({clientX: 250, clientY: 50});

            expect(layerOneItems.length).toBe(1);

            expect(itemOne.xPoint()).toBe(100);
            expect(itemOne.yPoint()).toBe(50);
            expect(itemOne.width()).toBe(150);
            expect(itemOne.height()).toBe(150);
        });

        beforeEach(function () {
            layers = ko.observableArray([
                new Layer('layerOne', ko.observableArray([new Item('onlyItem', 100, 100, 100, 100)]))
            ]);
            layerOne = layers()[0];
            layerOneItems = layerOne.items();
            itemOne = layerOneItems[0];

            checkPointerItemCollision = function () {
                return true;
            };
        });
    });

    describe("as a user I want to move an existing rect", function () {

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
        var layers, layerOne, layerOneItems;
        beforeEach(function () {
            layers = ko.observableArray([
                new Layer('layerOne', ko.observableArray())
            ]);
            layerOne = layers()[0];
            layerOneItems = layerOne.items();
        });


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
        var layers, layerOne, layerOneItems;
        beforeEach(function () {
            layers = ko.observableArray([
                new Layer('layerOne', ko.observableArray())
            ]);
            layerOne = layers()[0];
            layerOneItems = layerOne.items();
        });


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
        var layers, layerOne, layerOneItems;
        beforeEach(function () {
            layers = ko.observableArray([
                new Layer('layerOne', ko.observableArray())
            ]);
            layerOne = layers()[0];
            layerOneItems = layerOne.items();
        });


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

});