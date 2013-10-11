require(['lib/knockout', 'view/ControlBarView', 'view/LayerToolView', 'view/Factory', 'lib/domReady', 'lib/bootstrap'],
    function (ko, ControlBarView, LayerToolView, Factory) {

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
        ko.applyBindings(new ControlBarView(showLayerTool), document.getElementById('control-bar'));
        ko.applyBindings(new LayerToolView(layers, showLayerTool), document.getElementById('layers-tool'));

    }
);
