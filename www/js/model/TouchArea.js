define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function TouchArea() {
        Item.call(this, 'touchArea');
        Base.call(this);

        this.width = ko.observable().extend({integer: null});
        this.height = ko.observable().extend({integer: null});

        var self = this;
        this.toggleRangeWidth = function () {
            self.focusOnWidth(!self.focusOnWidth());
        };
        this.focusOnWidth = ko.observable(false);
        this.showRangeWidth = ko.computed(function () {
            return self.focusOnWidth() && self.isActive();
        });

        this.toggleRangeHeight = function () {
            self.focusOnHeight(!self.focusOnHeight());
        };
        this.focusOnHeight = ko.observable(false);
        this.showRangeHeight = ko.computed(function () {
            return self.focusOnHeight() && self.isActive();
        });
    }

    TouchArea.prototype = Object.create(Item.prototype);

    return TouchArea;
});