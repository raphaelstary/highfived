define(['lib/knockout', 'view/ControlBarView', 'view/EntityToolView', 'model/Factory', 'view/EntityFilter',
    'input/DragAndDropHandler'],
    function (ko, ControlBarView, EntityToolView, Factory, EntityFilter, DragAndDropHandler) {

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

        var dropHandler = new DragAndDropHandler();

        ko.bindingHandlers.drop = {
            init: function(element, valueAccessor) {
                element.addEventListener('dragenter', function (event) {
                    event.preventDefault();
                });
                element.addEventListener('dragover', function (event) {
                    event.preventDefault();
                });
                element.addEventListener('drop', dropHandler.handleDrop.bind(dropHandler, valueAccessor(), element));
            }
        };

        function MainView() {
        }

        MainView.prototype.init = function () {
            var showLayerTool = ko.observable(true);
            var entityBucket = new Factory().createEntityModel();

            var zoomLevel = ko.observable(100).extend({integer: null});
            var controlBarView = new ControlBarView(showLayerTool, zoomLevel);
            ko.applyBindings(controlBarView, document.getElementById('control-bar'));

            var entityToolView = new EntityToolView(entityBucket, showLayerTool);
            ko.applyBindings(entityToolView, document.getElementById('entity-tool'));

            var itemFilter = new EntityFilter(entityBucket);
            entityToolView.filter.subscribe(itemFilter.handle.bind(itemFilter));

            return {
                entityBucket: entityBucket,
                zoomLevel: zoomLevel
            };
        };

        return MainView;
    }
);