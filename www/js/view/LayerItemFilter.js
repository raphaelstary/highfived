define(['lib/knockout'], function (ko) {
    function LayerItemFilter(entityBucket) {
        this.entityBucket = entityBucket;
        this.tempLayers = {};
    }

    LayerItemFilter.prototype.handle = function (newValue) {
        if (typeof newValue !== 'string')
            return;

        var self = this;
        ko.utils.arrayForEach(this.entityBucket.entities(), function (layer) {

            if (self.tempLayers[layer.id] !== undefined) {

                self.tempLayers[layer.id].forEach(function (item) {
                    layer.items.push(item);
                });

                layer.items.sort(function (left, right) {
                    return left.id < right.id ? -1 : 1;
                });
            }

            self.tempLayers[layer.id] = layer.items.remove(function (item) {
                return !(item.name().indexOf(newValue) != -1);
            });
        });
    };

    return LayerItemFilter;
});