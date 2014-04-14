define(['model/StaticImage'], function (StaticImage) {
    function DragAndDropHandler(layerBucket) {
        this.entityBucket = layerBucket;

        var self = this;
        layerBucket.entities.forEach(function (layer) {
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
            self.entityBucket.deactivateActiveEntity();
            self.entityBucket.activateEntity(self.staticLayer);

            var item = new StaticImage(file.name, event.clientX, event.clientY, img.width, img.height, img);

            self.entityBucket.deactivateActiveItem();
            self.entityBucket.activateItem(item);

            self.entityBucket.activeEntity.items.push(item);
        };
        img.src = window.URL.createObjectURL(file);
    };

    return DragAndDropHandler;
});