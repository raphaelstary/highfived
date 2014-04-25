define(['lib/knockout'], function (ko) {
    function Base() {
        this.add = ko.observableArray();
        this.delay = ko.observable().extend({integer: null});
        this.remove = ko.observableArray();
        this.trigger = ko.observableArray();
    }

    return Base;
});