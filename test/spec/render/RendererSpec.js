define(['render/Renderer', 'model/Layer', 'model/Rectangle', 'model/Line', 'model/LayerBucket',
    'lib/knockout'], function (Renderer, Layer, Rectangle, Line, LayerBucket, ko) {

    var layerBucket, layers, items, itemOne, CANVAS_WIDTH, CANVAS_HEIGHT;

    describe('as a caller I want to render lines & active lines on the screen', function () {
        it('should draw a normal line ' +
            'when I call drawScene ' +
            'given a valid layer model containing one line', function () {
            var moveToCalled = false;
            var lineToCalled = false;
            var beginPathCalled = false;
            var strokeCalled = false;

            var ctx = {
                clearRect: function () {},
                beginPath: function () {
                    beginPathCalled = true;
                },
                moveTo: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    moveToCalled = true;
                },
                lineTo: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    lineToCalled = true;
                },
                stroke: function () {
                    strokeCalled = true;
                }
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(moveToCalled).toBeTruthy();
            expect(lineToCalled).toBeTruthy();
            expect(beginPathCalled).toBeTruthy();
            expect(strokeCalled).toBeTruthy();
        });

        it('should draw an active line ' +
            'when I call drawScene ' +
            'given a valid layer model containing one selected line', function () {

            itemOne.isActive(true);

            var moveToCalled = false;
            var lineToCalled = false;
            var beginPathCalled = false;
            var strokeCalled = false;
            var arcCalled = false;
            var fillCalled = false;

            var ctx = {
                clearRect: function () {},
                beginPath: function () {
                    beginPathCalled = true;
                },
                moveTo: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    moveToCalled = true;
                },
                lineTo: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    lineToCalled = true;
                },
                stroke: function () {
                    strokeCalled = true;
                },
                arc: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    arcCalled = true;
                },
                fill: function () {
                    fillCalled = true;
                },
                save: function () {},
                restore: function () {}
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(moveToCalled).toBeTruthy();
            expect(lineToCalled).toBeTruthy();
            expect(beginPathCalled).toBeTruthy();
            expect(strokeCalled).toBeTruthy();

            expect(arcCalled).toBeTruthy();
            expect(fillCalled).toBeTruthy();

            expect(ctx.fillStyle).toBe('white');
            expect(ctx.strokeStyle).toBe('blue');
        });

        beforeEach(initLine);
    });

    describe('as a caller I want to render rectangles & active rectangles on the screen', function () {

        it('should draw a normal rectangle, ' +
            'when I call drawScene, ' +
            'given valid layer model with one rect', function () {
            var contextCalled = false;

            var context = {
                clearRect: function () {},
                strokeRect: function (x, y, w, h) {
                    contextCalled = true;

                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);
                    expectValidWithOrHeight(w);
                    expectValidWithOrHeight(h);
                }
            };

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(contextCalled).toBeTruthy();
        });

        it('should draw active rectangle, ' +
            'when I call drawScene, ' +
            'given valid layer model with one selected rect', function () {

            itemOne.isActive(true);

            var contextCalled = false,
                activeCalled = false;

            var context = {
                clearRect: function () {},
                save: function () {},
                beginPath: function () {},
                arc: function () {
                    activeCalled = true;
                },
                fill: function () {},
                stroke: function () {},
                restore: function () {},
                strokeRect: function (x, y, w, h) {
                    contextCalled = true;

                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);
                    expectValidWithOrHeight(w);
                    expectValidWithOrHeight(h);
                }
            };

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(contextCalled).toBeTruthy();
            expect(activeCalled).toBeTruthy();
        });

        it('should draw nothing - no rectangle, ' +
            'when I call drawScene, ' +
            'given valid layer model with one hidden rect', function () {

            itemOne.isHidden(true);

            var contextCalled = false;

            var context = {
                clearRect: function () {},
                strokeRect: function () {
                    contextCalled = true;
                }
            };

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(contextCalled).toBeFalsy();
        });

        it('should draw nothing - no rectangle, ' +
            'when I call drawScene, ' +
            'given valid layer model with one rect in one hidden layer', function () {

            layers()[0].isHidden(true);

            var contextCalled = false;

            var context = {
                clearRect: function () {},
                strokeRect: function () {
                    contextCalled = true;
                }
            };

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(contextCalled).toBeFalsy();
        });

        beforeEach(initRect);
    });

    function expectValidPixelCoordinate(pxCoord, lowerBoundary, upperBoundary) {
        expect(typeof pxCoord).toBe('number');
        expect(pxCoord).toBeGreaterThan(lowerBoundary - 0.1);
        expect(pxCoord).toBeLessThan(upperBoundary + 0.1);
    }

    function expectValidWithOrHeight(value) {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
    }

    function initLine() {
        items = ko.observableArray([new Line('onlyItem', 10, 15, 100, 150)]);
        layers = ko.observableArray([
            new Layer('layerOne', items, 'line')
        ]);

        init();
    }

    function initRect() {
        items = ko.observableArray([new Rectangle('onlyItem', 100, 100, 100, 100)]);
        layers = ko.observableArray([
            new Layer('layerOne', items, 'rectangle')
        ]);

        init();
    }

    function init() {
        function forEach(fn) {
            ko.utils.arrayForEach(this(), fn);
        }

        layerBucket = new LayerBucket(layers);

        items.forEach = forEach;
        layers.forEach = forEach;

        itemOne = layers()[0].items()[0];
        CANVAS_WIDTH = 500;
        CANVAS_HEIGHT = 500;
    }
});