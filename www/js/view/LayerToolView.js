define(['lib/knockout'], function(ko) {

    function LayerToolView(layers, showLayerTool) {

        this.layers = layers;
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
        ko.utils.arrayForEach(this.layers(), function (layer) {
            layer.isSelected(false);
        });
    };

    LayerToolView.prototype.toggleSelectAllItems = function () {
        ko.utils.arrayForEach(this.layers(), function (layer) {
            ko.utils.arrayForEach(layer.items(), function (item) {
                item.isSelected(false);
            });
        });
    };

    LayerToolView.prototype.linkItem = function (item) {
        console.log('link item');
    };

    return LayerToolView;
});
