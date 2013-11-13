define(['render/Renderer', 'view/Layer', 'view/Item', 'lib/knockout'], function (Renderer, Layer, Item, ko) {

    describe('as a caller I want to render rectangles & active rectangles on the screen', function () {
        var layers, itemOne, CANVAS_WIDTH, CANVAS_HEIGHT;

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

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layers);

            renderer.drawScene();

            expect(contextCalled).toBeTruthy();
        });

        it('should draw active rectangle, ' +
            'when I call drawScene, ' +
            'given valid layer model with one selected rect', function () {

            itemOne.isSelected(true);

            var contextCalled = false;

            var context = {
                clearRect: function () {},
                save: function () {},
                beginPath: function () {},
                arc: function () {},
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

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layers);

            renderer.drawScene();

            expect(contextCalled).toBeTruthy();
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

            var renderer = new Renderer(null, context, CANVAS_WIDTH, CANVAS_HEIGHT, layers);

            renderer.drawScene();

            expect(contextCalled).toBeFalsy();
        });

        beforeEach(function () {
            layers = ko.observableArray([
                new Layer('layerOne', ko.observableArray([new Item('onlyItem', 100, 100, 100, 100)]))
            ]);
            itemOne = layers()[0].items()[0];
            CANVAS_WIDTH = 500;
            CANVAS_HEIGHT = 500;
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
    });
});