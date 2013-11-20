define(['lib/knockout'], function(ko) {

    function LayerToolView(layerBucket, showLayerTool) {
        this.layerBucket = layerBucket;
        this.showLayerTool = showLayerTool;
        this.filter = ko.observable();
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

            if (this.activeItem != null) {
                this.activeItem.isActive(false);
            }

            item.isActive(true);

            this.activeItem = item;
            //todo have to change to iterate over every item and deactivate it, or find data-model
            // in common with renderer/tool mouse handler
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

    return LayerToolView;
});
