define(['lib/knockout', 'model/EntityBucket'], function (ko, EntityBucket) {
    function Factory() {
    }

    Factory.prototype.createEntityModel = function () {
        function forEach(fn) {
            ko.utils.arrayForEach(this(), fn);
        }

        var result = ko.observableArray();
        result.forEach = forEach;

        return new EntityBucket(result);
    };

    return Factory;
});
