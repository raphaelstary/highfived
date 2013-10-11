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
