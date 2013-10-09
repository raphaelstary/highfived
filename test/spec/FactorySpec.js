define(['view/Factory', 'lib/knockout', 'view/Layer'], function (Factory, ko, Layer) {

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


    });
});
