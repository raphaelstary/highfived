define(function () {
    function LayerBucket(layers) {
        this.layers = layers;

        this.activeItem = null;
        this.activeLayer = null;
    }

    return LayerBucket;
});