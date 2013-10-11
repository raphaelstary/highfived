require(['lib/knockout', 'view/ControlBarView', 'view/LayerToolView', 'view/Factory', 'view/LayerItemFilter',
    'lib/domReady', 'lib/bootstrap'],
    function (ko, ControlBarView, LayerToolView, Factory, LayerItemFilter) {

        var inputLayers = [
            {
                id: 'event',
                name: 'event area',
                items: [
                    {id: '0', name: 'entry explosion', xPoint: 1, yPoint: 2, width: 3, height: 4},
                    {id: '1', name: 'trap', xPoint: 1, yPoint: 2, width: 3, height: 4},
                    {id: '2', name: 'another event', xPoint: 1, yPoint: 2, width: 3, height: 4}
                ]
            },
            {
                id: 'physic',
                name: 'physics body'
            },
            {
                id: 'collision',
                name: 'collision area'
            },
            {
                id: 'animated',
                name: 'animated object'
            },
            {
                id: 'transition',
                name: 'transition path'
            },
            {
                id: 'ai',
                name: 'AI point'
            },
            {
                id: 'static',
                name: 'static image'
            },
            {
                id: 'vector',
                name: 'vector field'
            },
            {
                id: 'touch',
                name: 'touch area'
            }
        ];

        var showLayerTool = ko.observable(false);
        var layers = new Factory(inputLayers).createLayerModel();

        var controlBarView = new ControlBarView(showLayerTool);
        ko.applyBindings(controlBarView, document.getElementById('control-bar'));

        var layerToolView = new LayerToolView(layers, showLayerTool);
        ko.applyBindings(layerToolView, document.getElementById('layers-tool'));

        var itemFilter = new LayerItemFilter(layers);
        layerToolView.filter.subscribe(itemFilter.handle.bind(itemFilter));
    }
);
