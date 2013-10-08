define(['lib/knockout'], function (ko) {
    function Factory() {

    }

    Factory.prototype.createLayerModel = function () {
        return ko.observableArray();
    };

    return Factory;
});
