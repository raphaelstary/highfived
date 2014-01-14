define(['model/Factory', 'model/Layer', 'model/Rectangle'], function (Factory, Layer, Rectangle) {

    describe('view model creation, method call of createLayerModel', function () {

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given undefined', function () {
            var factory = new Factory();

            var actual = factory.createLayerModel().layers;

            expect(actual().length).toBe(0);
        });

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given null', function () {
            var factory = new Factory(null);

            var actual = factory.createLayerModel().layers;

            expect(actual().length).toBe(0);
        });

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given an empty array', function () {
            var factory = new Factory([]);

            var actual = factory.createLayerModel().layers;

            expect(actual().length).toBe(0);
        });

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given undefined', function () {
            var factory = new Factory();

            var actual = factory.createLayerModel().layers;

            expect(actual().length).toBe(0);
        });

        it('should create an observable array containing one layer, ' +
            'when I call create, ' +
            'given an array with one layer', function () {

            var input = [
                {
                    name: 'one',
                    type: 'testType'
                }
            ];

            var factory = new Factory(input);

            var actual = factory.createLayerModel().layers();

            expect(actual.length).toBe(1);
            var layer = actual[0];
            expect(layer).toBeDefined();
            expect(layer instanceof Layer).toBeTruthy();

            expect(layer.name()).toBe('one');
            expect(layer.type).toBe('testType');
        });

        it('should create an observable array containing two layers, ' +
            'when I call create, ' +
            'given an array with two layers', function () {

            var input = [
                {
                    name: 'one'
                },
                {
                    name: 'two'
                }
            ];

            var factory = new Factory(input);

            var actual = factory.createLayerModel().layers;

            expect(actual().length).toBe(2);

            expect(actual()[0] instanceof Layer).toBeTruthy();
            expect(actual()[0].name()).toBe('one');

            expect(actual()[1] instanceof Layer).toBeTruthy();
            expect(actual()[1].name()).toBe('two');
        });

        it('should create an observable array containing one layer with an empty observable array for items,' +
            'when I call create, ' +
            'given an array with one layer and undefined items', function () {
            var input = [
                {
                    name: 'one'
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers;
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(0);
        });

        it('should create an observable array containing one layer with an empty observable array for items,' +
            'when I call create, ' +
            'given an array with one layer and null items', function () {
            var input = [
                {
                    name: 'one',
                    items: null
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers;
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(0);
        });

        it('should create an observable array containing one layer with an empty observable array for items,' +
            'when I call create, ' +
            'given an array with one layer and an empty item list', function () {
            var input = [
                {
                    name: 'one',
                    items: []
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers;
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(0);
        });

        it('should create an observable array containing one layer with an observable array containing one item,' +
            'when I call create, ' +
            'given an array with one layer and one item', function () {
            var input = [
                {
                    name: 'one',
                    items: [{
                        name: 'itemOne'
                    }]
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers;
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(1);

            var item = layer.items()[0];
            expect(item instanceof Rectangle).toBeTruthy();
            expect(item.name()).toBe('itemOne');

        });

        it('should create an observable array containing one layer with an observable array containing two items,' +
            'when I call create, ' +
            'given an array with one layer and two items', function () {
            var input = [
                {
                    name: 'one',
                    items: [
                        {
                            name: 'itemOne'
                        },
                        {
                            name: 'itemTwo'
                        }
                    ]
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers;
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(2);

            var item = layer.items()[0];
            expect(item instanceof Rectangle).toBeTruthy();
            expect(item.name()).toBe('itemOne');

            var item2 = layer.items()[1];
            expect(item2 instanceof Rectangle).toBeTruthy();
            expect(item2.name()).toBe('itemTwo');
        });
    });

    describe("as a user I want to iterate over the created domain model like a normal array", function () {

        it('should get a forEach method, ' +
            'when I call create, ' +
            'given an array with one layer', function () {

            var input = [
                {
                    name: 'one'
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers;

            expect(actual.forEach).toBeDefined();

            var called = false;
            actual.forEach(function (layer) {
                called = true;
                expect(layer.name()).toBe('one');
            });

            expect(called).toBeTruthy();
        });

        it('should get a forEach method, ' +
            'when I call create, ' +
            'given an array with one layer and one item', function () {

            var input = [
                {
                    name: 'one',
                    items: [{
                        name: 'itemOne'
                    }]
                }
            ];
            var factory = new Factory(input);
            var actual = factory.createLayerModel().layers()[0].items;

            expect(actual.forEach).toBeDefined();

            var called = false;
            actual.forEach(function (item) {
                called = true;
                expect(item.name()).toBe('itemOne');
            });

            expect(called).toBeTruthy();
        });
    });
});
