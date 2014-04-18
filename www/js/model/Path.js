define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Path() {
        Item.call(this);
        Base.call(this);

        this.endX = ko.observable().extend({integer: null});
        this.endY = ko.observable().extend({integer: null});
        this.duration = ko.observable().extend({integer: null});
        this.length = ko.observable().extend({integer: null});
        this.transition = ko.observable();
        this.loop = ko.observable(false);

        this.toggleRangeEndX = function () {
            self.focusOnEndX(!self.focusOnEndX());
        };
        this.focusOnEndX = ko.observable(false);
        this.showRangeEndX = ko.computed(function () {
            return self.focusOnEndX() && self.isActive();
        });

        this.toggleRangeEndY = function () {
            self.focusOnEndY(!self.focusOnEndY());
        };
        this.focusOnEndY = ko.observable(false);
        this.showRangeEndY = ko.computed(function () {
            return self.focusOnEndY() && self.isActive();
        });
    }

    Path.prototype = Object.create(Item.prototype);

    return Path;
});