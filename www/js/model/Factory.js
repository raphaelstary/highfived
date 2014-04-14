define(['lib/knockout', 'EntityBucket'], function (ko, LayerBucket) {
    function Factory() {
    }

    Factory.prototype.createLayerModel = function () {
        function forEach(fn) {
            ko.utils.arrayForEach(this(), fn);
        }

        var result = ko.observableArray();
        result.forEach = forEach;

        return new EntityBucket(result);
    };

    return Factory;
});
