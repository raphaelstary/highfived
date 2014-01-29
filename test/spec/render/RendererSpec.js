define(['render/Renderer', 'model/Layer', 'model/Rectangle', 'model/Line', 'model/Circle', 'model/Curve',
    'model/LayerBucket', 'lib/knockout'], function (Renderer, Layer, Rectangle, Line, Circle, Curve, LayerBucket, ko) {

    var layerBucket, layers, items, itemOne, CANVAS_WIDTH, CANVAS_HEIGHT;

    describe('as a caller I want to render circles & active circles on the screen', function () {

        it('should draw a normal circle ' +
            'when I call drawScene ' +
            'given a valid layer model containing one circle', function () {

            var beginPathCalled = false, arcCalled = false, strokeCalled = false;

            var ctx = {
                clearRect: function () {},
                beginPath: function () {
                    beginPathCalled = true;
                },
                arc: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    arcCalled = true;
                },
                stroke: function () {
                    strokeCalled = true;
                }
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(beginPathCalled).toBeTruthy();
            expect(arcCalled).toBeTruthy();
            expect(strokeCalled).toBeTruthy();
        });

        it('should draw an active circle ' +
            'when I call drawScene ' +
            'given a valid layer model containing one active circle', function () {

            itemOne.isActive(true);

            var beginPathCalled = false, arcCalled = false, strokeCalled = false, fillCalled = false;

            var ctx = {
                save: function () {},
                restore: function () {},
                clearRect: function () {},
                beginPath: function () {
                    beginPathCalled = true;
                },
                arc: function (x, y) {
                    expectValidPixelCoordinate(x, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(y, 0, CANVAS_HEIGHT);

                    arcCalled = true;
                },
                stroke: function () {
                    strokeCalled = true;
                },
                fill: function () {
                    fillCalled = true;
                }
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(beginPathCalled).toBeTruthy();
            expect(arcCalled).toBeTruthy();
            expect(strokeCalled).toBeTruthy();
            expect(fillCalled).toBeTruthy();

            expect(ctx.fillStyle).toBe('white');
            expect(ctx.strokeStyle).toBe('green');
        });

        it('should draw nothing - no circle, ' +
            'when I call drawScene, ' +
            'given valid layer model with one hidden circle', function () {

            itemOne.isHidden(true);

            var called = false;

            var ctx = {
                clearRect: function () {},
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () {},
                stroke: function () {
                    called = true;
                }
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(called).toBeFalsy();
        });

        beforeEach(initCircle);
    });

    describe('as a caller I want to render bezier curves & active bezier curves on the screen', function () {

        it('should draw a normal curve ' +
            'when I call drawScene ' +
            'given a valid layer model containing one curve', function () {

            var moveToCalled = false;
            var beginPathCalled = false;
            var strokeCalled = false;
            var bezierCurveToCalled = false;

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
                bezierCurveTo: function (xB, yB, xC, yC, xD, yD) {
                    expectValidPixelCoordinate(xB, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(yB, 0, CANVAS_HEIGHT);
                    expectValidPixelCoordinate(xC, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(yC, 0, CANVAS_HEIGHT);
                    expectValidPixelCoordinate(xD, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(yD, 0, CANVAS_HEIGHT);

                    bezierCurveToCalled = true;
                },
                stroke: function () {
                    strokeCalled = true;
                }
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(moveToCalled).toBe(true);
            expect(bezierCurveToCalled).toBe(true);
            expect(beginPathCalled).toBe(true);
            expect(strokeCalled).toBe(true);
        });

        it('should draw an active curve ' +
            'when I call drawScene ' +
            'given a valid layer model containing one active curve', function () {

            itemOne.isActive(true);

            var moveToCalled = false;
            var bezierCurveToCalled = false;
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
                bezierCurveTo: function (xB, yB, xC, yC, xD, yD) {
                    expectValidPixelCoordinate(xB, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(yB, 0, CANVAS_HEIGHT);
                    expectValidPixelCoordinate(xC, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(yC, 0, CANVAS_HEIGHT);
                    expectValidPixelCoordinate(xD, 0, CANVAS_WIDTH);
                    expectValidPixelCoordinate(yD, 0, CANVAS_HEIGHT);

                    bezierCurveToCalled = true;
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
            expect(bezierCurveToCalled).toBeTruthy();
            expect(beginPathCalled).toBeTruthy();
            expect(strokeCalled).toBeTruthy();

            expect(arcCalled).toBeTruthy();
            expect(fillCalled).toBeTruthy();

            expect(ctx.fillStyle).toBe('white');
            expect(ctx.strokeStyle).toBe('blue');
        });

        beforeEach(initCurve);
    });

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
            'given a valid layer model containing one active line', function () {

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

        it('should draw nothing - no line, ' +
            'when I call drawScene, ' +
            'given valid layer model with one hidden line', function () {

            itemOne.isHidden(true);

            var called = false;

            var ctx = {
                clearRect: function () {},
                beginPath: function () {},
                moveTo: function () {},
                lineTo: function () {},
                stroke: function () {
                    called = true;
                }
            };

            var renderer = new Renderer(null, ctx, CANVAS_WIDTH, CANVAS_HEIGHT, layerBucket);

            renderer.drawScene();

            expect(called).toBeFalsy();
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
            'given valid layer model with one active rect', function () {

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

    function initCircle() {
        items = ko.observableArray([new Circle('onlyItem', 50, 50, 100)]);
        layers = ko.observableArray([
            new Layer('layerOne', items, 'circle')
        ]);

        init();
    }

    function initLine() {
        items = ko.observableArray([new Line('onlyItem', 10, 15, 100, 150)]);
        layers = ko.observableArray([
            new Layer('layerOne', items, 'line')
        ]);

        init();
    }

    function initCurve() {
        items = ko.observableArray([new Curve('onlyItem', 100, 100, 100, 50, 200, 50, 200, 100)]);
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