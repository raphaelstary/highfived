define(['view/LayerItemFilter', 'lib/knockout'], function (LayerItemFilter, ko) {

    describe('filter the entities with their items (view model) with a given input filter term (text)', function () {

        var layers;
        beforeEach(function() {
            layers = ko.observableArray([
                {
                    id: 'l0',
                    name: 'layerOne',
                    items: ko.observableArray([
                        {
                            id: 0,
                            name: function () {
                                return 'itemOne';
                            }
                        },
                        {
                            id: 1,
                            name: function () {
                                return 'itemTwo';
                            }
                        }
                    ])
                }
            ]);
        });

        it('should filter nothing,' +
            'when input is no string,' +
            'given a layer model', function () {

            var filter = new LayerItemFilter({entities: layers});
            filter.handle(null);

            expect(layers()[0].items().length).toBe(2);
        });

        it('should remove one,' +
            'when input matches one item,' +
            'given a layer model', function () {

            var filter = new LayerItemFilter({entities: layers});
            filter.handle('Two');

            expect(layers()[0].items().length).toBe(1);
            expect(layers()[0].items()[0].name()).toBe('itemTwo');
        });

        it('should remove no item,' +
            'when input matches all,' +
            'given a layer model', function () {

            var filter = new LayerItemFilter({entities: layers});
            filter.handle('item');

            expect(layers()[0].items().length).toBe(2);
            expect(layers()[0].items()[0].name()).toBe('itemOne');
            expect(layers()[0].items()[1].name()).toBe('itemTwo');
        });

        it('should add one item,' +
            'when input matches item again,' +
            'given one was removed before & there is a layer model', function () {

            var filter = new LayerItemFilter({entities: layers});
            filter.handle('Two');

            expect(layers()[0].items().length).toBe(1);
            expect(layers()[0].items()[0].name()).toBe('itemTwo');

            filter.handle('');

            expect(layers()[0].items().length).toBe(2);
        });

        it('should sort items,' +
            'when items were added again because input matches,' +
            'given one was removed before & there is a layer model', function () {

            var filter = new LayerItemFilter({entities: layers});
            filter.handle('Two');

            expect(layers()[0].items().length).toBe(1);
            expect(layers()[0].items()[0].name()).toBe('itemTwo');

            filter.handle('item');

            expect(layers()[0].items().length).toBe(2);
            expect(layers()[0].items()[0].name()).toBe('itemOne');
            expect(layers()[0].items()[1].name()).toBe('itemTwo');
        });

        it('should handle multiple entities with items, ' +
            'when items are added again, ' +
            'given items were removed & there is a layer model upfront with multiple entities', function () {

            layers.push({
                id: 'l1',
                name: 'layerTwo',
                items: ko.observableArray([
                    {
                        id: 2,
                        name: function () {
                            return 'itemThree';
                        }
                    },
                    {
                        id: 3,
                        name: function () {
                            return 'itemFour';
                        }
                    }
                ])
            });

            var filter = new LayerItemFilter({entities: layers});
            filter.handle('Four');

            expect(layers()[0].items().length).toBe(0);
            expect(layers()[1].items().length).toBe(1);
            expect(layers()[1].items()[0].name()).toBe('itemFour');

            filter.handle('');

            expect(layers()[0].items().length).toBe(2);
            expect(layers()[0].items()[0].name()).toBe('itemOne');
            expect(layers()[0].items()[1].name()).toBe('itemTwo');
            expect(layers()[1].items().length).toBe(2);
            expect(layers()[1].items()[0].name()).toBe('itemThree');
            expect(layers()[1].items()[1].name()).toBe('itemFour');
        });
    });
});