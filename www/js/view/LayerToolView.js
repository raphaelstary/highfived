define(['lib/knockout'], function(ko) {

    function LayerToolView(layerBucket, showLayerTool) {
        this.layerBucket = layerBucket;
        this.showLayerTool = showLayerTool;
        this.filter = ko.observable();

        this.MAX_RANGE = 1000;
    }

    LayerToolView.prototype.toggleLayerControls = function (layer) {
        layer.showControls(!layer.showControls());
    };

    LayerToolView.prototype.toggleSelectLayer = function (layer) {
        layer.isSelected(!layer.isSelected());

        if (layer.isSelected()) {

            if (this.activeLayer != null) {
                this.activeLayer.isActive(false);
            }

            layer.isActive(true);

            this.activeLayer = layer;
        }
    };

    LayerToolView.prototype.toggleHideLayer = function (layer) {
        layer.isHidden(!layer.isHidden());
    };

    LayerToolView.prototype.toggleItemControls = function (item) {
        item.showControls(!item.showControls());
    };

    LayerToolView.prototype.toggleSelectItem = function (item) {
        item.isSelected(!item.isSelected());

        if (item.isSelected()) {
            this.activateItem(item);
        }
    };

    LayerToolView.prototype.toggleEditItemName = function (item) {
        item.isEditOn(!item.isEditOn());
    };

    LayerToolView.prototype.toggleHideItem = function (item) {
        item.isHidden(!item.isHidden());
    };

    LayerToolView.prototype.toggleSelectAllLayers = function () {
        this.layerBucket.layers.forEach(function (layer) {
            layer.isSelected(false);
        });
    };

    LayerToolView.prototype.toggleSelectAllItems = function () {
        this.layerBucket.layers.forEach(function (layer) {
            layer.items.forEach(function (item) {
                item.isSelected(false);
            });
        });
    };

    LayerToolView.prototype.linkItem = function (item) {
        console.log('link item');
    };

    LayerToolView.prototype.activateItem = function (item) {
        if (this.layerBucket.activeItem != null) {
            this.layerBucket.activeItem.isActive(false);
        }

        item.isActive(true);

        this.layerBucket.activeItem = item;
    };

    return LayerToolView;
});
