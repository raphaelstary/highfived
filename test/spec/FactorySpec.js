define(['view/Factory', 'lib/knockout', 'view/Layer', 'view/Item'], function (Factory, ko, Layer, Item) {

    describe('view model creation', function () {

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given undefined', function () {
            var factory = new Factory();

            var actual = factory.createLayerModel();

            expect(actual().length).toBe(0);
        });

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given null', function () {
            var factory = new Factory(null);

            var actual = factory.createLayerModel();

            expect(actual().length).toBe(0);
        });

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given an empty array', function () {
            var factory = new Factory([]);

            var actual = factory.createLayerModel();

            expect(actual().length).toBe(0);
        });

        it('should create an empty observable array, ' +
            'when I call create, ' +
            'given undefined', function () {
            var factory = new Factory();

            var actual = factory.createLayerModel();

            expect(actual().length).toBe(0);
        });

        it('should create an observable array containing one layer, ' +
            'when I call create, ' +
            'given an array with one layer', function () {

            var input = [
                {
                    name: 'one'
                }
            ];

            var factory = new Factory(input);

            var actual = factory.createLayerModel();

            expect(actual().length).toBe(1);
            expect(actual()[0]).toBeDefined();
            expect(actual()[0] instanceof Layer).toBeTruthy();
            expect(actual()[0].name()).toBe('one');
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

            var actual = factory.createLayerModel();

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
            var actual = factory.createLayerModel();
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
            var actual = factory.createLayerModel();
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
            var actual = factory.createLayerModel();
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
            var actual = factory.createLayerModel();
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(1);

            var item = layer.items()[0];
            expect(item instanceof Item).toBeTruthy();
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
            var actual = factory.createLayerModel();
            var layer = actual()[0];

            expect(layer.items).toBeDefined();
            expect(layer.items().length).toBe(2);

            var item = layer.items()[0];
            expect(item instanceof Item).toBeTruthy();
            expect(item.name()).toBe('itemOne');

            var item2 = layer.items()[1];
            expect(item2 instanceof Item).toBeTruthy();
            expect(item2.name()).toBe('itemTwo');
        });
    });
});
