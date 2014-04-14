define(['lib/knockout', 'view/ControlBarView', 'view/EntityToolView', 'model/Factory', 'EntityFilter'],
    function (ko, ControlBarView, LayerToolView, Factory, LayerItemFilter) {

        // filter for numeric input fields
        ko.extenders.integer = function(target) {
            //create a writeable computed observable to intercept writes to our observable
            var result = ko.computed({
                read: target,  //always return the original observables value
                write: function(newValue) {
                    var current = target(),
                        newValueAsNum = isNaN(newValue) ? 0 : parseInt(newValue);

                    //only write if it changed
                    if (newValueAsNum !== current) {
                        target(newValueAsNum);
                    } else {
                        //if the rounded value is the same, but a different value was written, force a notification for the current field
                        if (newValue !== current) {
                            target.notifySubscribers(newValueAsNum);
                        }
                    }
                }
            }).extend({ notify: 'always' });

            //initialize with current value to make sure it is rounded appropriately
            result(target());

            //return the new computed observable
            return result;
        };

        function MainView() {
        }

        MainView.prototype.init = function () {
            var showLayerTool = ko.observable(true);
            var layerBucket = new Factory().createLayerModel();

            var zoomLevel = ko.observable(100).extend({integer: null});
            var controlBarView = new ControlBarView(showLayerTool, zoomLevel);
            ko.applyBindings(controlBarView, document.getElementById('control-bar'));

            var layerToolView = new EntityToolView(layerBucket, showLayerTool);
            ko.applyBindings(layerToolView, document.getElementById('layers-tool'));

            var itemFilter = new EntityFilter(layerBucket);
            layerToolView.filter.subscribe(itemFilter.handle.bind(itemFilter));

            return {
                layerBucket: layerBucket,
                zoomLevel: zoomLevel
            };
        };

        return MainView;
    }
);