define(['lib/knockout'], function (ko) {
    function Base() {
        this.add = ko.observable();
        this.delay = ko.observable().extend({integer: null});
        this.remove = ko.observable();
        this.trigger = ko.observable();
    }

    return Base;
});