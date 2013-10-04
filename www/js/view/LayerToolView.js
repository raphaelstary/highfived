define(['lib/knockout', 'view/Layer'], function(ko, Layer) {

    function LayerToolView(layers) {

        this.layers = ko.observableArray();

        var self = this;
        layers.forEach(function (layer) {
            self.layers.push(new Layer(layer.id, layer.name, layer.items));
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
