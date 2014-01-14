define(['lib/knockout', 'model/Layer', 'model/Rectangle', 'model/LayerBucket'], function (ko, Layer, Rectangle,
    LayerBucket) {
    function Factory(list) {
        this.list = list;
    }

    Factory.prototype.createLayerModel = function () {
        function forEach(fn) {
            ko.utils.arrayForEach(this(), fn);
        }

        var result = ko.observableArray();
        result.forEach = forEach;

        if (this.list === undefined || this.list === null || this.list.length === 0) {
            return new LayerBucket(result);
        }

        this.list.forEach(function (layer) {
            var items = ko.observableArray();
            items.forEach = forEach;

            if (layer.items !== undefined && layer.items !== null && layer.items.length > 0) {

                layer.items.forEach(function(item) {
                    items.push(new Rectangle(item.name, item.xPoint, item.yPoint, item.width, item.height));
                });
            }

            result.push(new Layer(layer.name, items, layer.type));
        });

        return new LayerBucket(result);
    };

    return Factory;
});
