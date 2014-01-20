define(['model/Item', 'lib/knockout'], function (Item, ko) {
    function Line(name, xPointA, yPointA, xPointB, yPointB) {
        Item.call(this, name);

        this.xPointA = ko.observable(xPointA);
        this.yPointA = ko.observable(yPointA);
        this.xPointB = ko.observable(xPointB);
        this.yPointB = ko.observable(yPointB);

        var self = this;
        this.toggleRangeXPointA = function () {
            self.focusOnXPointA(!self.focusOnXPointA());
        };
        this.focusOnXPointA = ko.observable(false);
        this.showRangeXPointA = ko.computed(function () {
            return self.focusOnXPointA() && self.isActive();
        });

        this.toggleRangeYPointA = function () {
            self.focusOnYPointA(!self.focusOnYPointA());
        };
        this.focusOnYPointA = ko.observable(false);
        this.showRangeYPointA = ko.computed(function () {
            return self.focusOnYPointA() && self.isActive();
        });

        this.toggleRangeXPointB = function () {
            self.focusOnXPointB(!self.focusOnXPointB());
        };
        this.focusOnXPointB = ko.observable(false);
        this.showRangeXPointB = ko.computed(function () {
            return self.focusOnXPointB() && self.isActive();
        });

        this.toggleRangeYPointB = function () {
            self.focusOnYPointB(!self.focusOnYPointB());
        };
        this.focusOnYPointB = ko.observable(false);
        this.showRangeYPointB = ko.computed(function () {
            return self.focusOnYPointB() && self.isActive();
        });
    }

    Line.prototype = Object.create(Item.prototype);

    return Line;
});