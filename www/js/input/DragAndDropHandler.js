define(['model/StaticImage'], function (StaticImage) {
    function DragAndDropHandler(layerBucket) {
        this.layerBucket = layerBucket;

        var self = this;
        layerBucket.layers.forEach(function (layer) {
            if (layer.name() === 'static image')
                self.staticLayer = layer;
        });
    }

    DragAndDropHandler.prototype.handleDrop = function (event) {
        event.preventDefault();

        var file = event.dataTransfer.files[0];

        var img = new Image();
        var self = this;
        img.onload = function () {
            self.layerBucket.deactivateActiveLayer();
            self.layerBucket.activateLayer(self.staticLayer);

            var item = new StaticImage(file.name, event.clientX, event.clientY, img.width, img.height, img);

            self.layerBucket.deactivateActiveItem();
            self.layerBucket.activateItem(item);

            self.layerBucket.activeLayer.items.push(item);
        };
        img.src = window.URL.createObjectURL(file);
    };

    return DragAndDropHandler;
});