define(['lib/knockout', 'view/ControlBarView', 'view/LayerToolView', 'model/Factory', 'view/LayerItemFilter'],
    function (ko, ControlBarView, LayerToolView, Factory, LayerItemFilter) {

        function MainView(inputLayers) {
            this.inputLayers = inputLayers;
        }

        MainView.prototype.init = function () {
            var showLayerTool = ko.observable(false);
            var layers = new Factory(this.inputLayers).createLayerModel();

            var controlBarView = new ControlBarView(showLayerTool);
            ko.applyBindings(controlBarView, document.getElementById('control-bar'));

            var layerToolView = new LayerToolView(layers, showLayerTool);
            ko.applyBindings(layerToolView, document.getElementById('layers-tool'));

            var itemFilter = new LayerItemFilter(layers);
            layerToolView.filter.subscribe(itemFilter.handle.bind(itemFilter));

            return layers;
        };

        return MainView;
    }
);