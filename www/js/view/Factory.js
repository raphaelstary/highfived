define(['lib/knockout', 'view/Layer', 'view/Item'], function (ko, Layer, Item) {
    function Factory(list) {
        this.list = list;
    }

    Factory.prototype.createLayerModel = function () {
        var result = ko.observableArray();

        if (this.list === undefined || this.list === null || this.list.length === 0) {
            return result;
        }

        this.list.forEach(function (layer) {
            var items = ko.observableArray();

            if (layer.items !== undefined && layer.items !== null && layer.items.length > 0) {

                layer.items.forEach(function(item) {
                    items.push(new Item(item.id, item.name, item.xPoint, item.yPoint, item.width, item.height));
                });
            }

            result.push(new Layer(layer.id, layer.name, items));
        });

        return result;
    };

    return Factory;
});
