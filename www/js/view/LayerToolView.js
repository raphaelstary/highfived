define(['lib/knockout', 'view/Layer'], function(ko, Layer) {

    function LayerToolView(layers, showLayerTool) {

        this.layers = layers;
        this.showLayerTool = showLayerTool;
        this.filter = ko.observable();

        var self = this;
        var tempLayers = {};
        this.filter.subscribe(function (newValue) {

            ko.utils.arrayForEach(self.layers(), function(layer) {

                if (tempLayers[layer.id] !== undefined) {

                    tempLayers[layer.id].forEach(function (item) {
                        layer.items.push(item);
                    });

                    layer.items.sort(function (left, right) {
                        return left.id < right.id ? -1 : 1;
                    });
                }

                tempLayers[layer.id] = layer.items.remove(function (item) {
                    return !(item.name().indexOf(self.filter()) != -1);
                });
            });
        });
    }

    LayerToolView.prototype.toggleLayerControls = function (layer) {
        layer.showControls(!layer.showControls());
    };

    LayerToolView.prototype.toggleSelectLayer = function (layer) {
        layer.isSelected(!layer.isSelected());
    };

    LayerToolView.prototype.toggleHideLayer = function (layer) {
        layer.isHidden(!layer.isHidden());
    };

    LayerToolView.prototype.toggleItemControls = function (item) {
        item.showControls(!item.showControls());
    };

    LayerToolView.prototype.toggleSelectItem = function (item) {
        item.isSelected(!item.isSelected());
    };

    LayerToolView.prototype.toggleEditItemName = function (item) {
        item.isEditOn(!item.isEditOn());
    };

    LayerToolView.prototype.toggleHideItem = function (item) {
        item.isHidden(!item.isHidden());
    };

    LayerToolView.prototype.linkItem = function (item) {
        console.log('link item');
    };

    return LayerToolView;
});
