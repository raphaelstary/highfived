define(function () {
    function LayerBucket(layers) {
        this.layers = layers;

        this.activeItem = null;
        this.activeLayer = null;
    }

    LayerBucket.prototype.deactivateActiveItem = function () {
        if (this.activeItem != null) {
            this.activeItem.isActive(false);
        }
    };

    LayerBucket.prototype.activateItem = function (item) {
        this.activeItem = item;
        item.isActive(true);
        item.isSelected(true);
    };

    LayerBucket.prototype.deactivateActiveLayer = function () {
        if (this.activeLayer != null) {
            this.activeLayer.isActive(false);
        }
    };

    LayerBucket.prototype.activateLayer = function (layer) {
        this.activeLayer = layer;
        layer.isActive(true);
        layer.isSelected(true);
    };

    return LayerBucket;
});