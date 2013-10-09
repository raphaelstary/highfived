define(['lib/knockout', 'view/Layer'], function (ko, Layer) {
    function Factory(list) {
        this.list = list;
    }

    Factory.prototype.createLayerModel = function () {
        var result = ko.observableArray();

        if (this.list === undefined || this.list === null || this.list.length === 0) {
            return result;
        }

        this.list.forEach(function (layer) {
            result.push(new Layer(layer.id, layer.name));
        });

        return result;
    };

    return Factory;
});
