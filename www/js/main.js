require(['lib/knockout', 'view/ControlBarView', 'view/LayerToolView', 'lib/domReady', 'lib/bootstrap'],
    function (ko, ControlBarView, LayerToolView) {

    ko.applyBindings(new ControlBarView(), document.getElementById('control-bar'));
    ko.applyBindings(new LayerToolView(), document.getElementById('layers-tool'));

});
