define(['model/Item', 'lib/knockout'], function (Item, ko) {
    /**
     *
     * @param {string} name
     * @param {number} xPoint
     * @param {number} yPoint
     * @param {number} radius
     * @constructor
     */
    function Circle(name, xPoint, yPoint, radius) {
        Item.call(this, name);

        this.xPoint = ko.observable(xPoint).extend({integer: null});
        this.yPoint = ko.observable(yPoint).extend({integer: null});
        this.radius = ko.observable(radius).extend({integer: null});

        var self = this;
        this.toggleRangeXPoint = function () {
            self.focusOnXPoint(!self.focusOnXPoint());
        };
        this.focusOnXPoint = ko.observable(false);
        this.showRangeXPoint = ko.computed(function () {
            return self.focusOnXPoint() && self.isActive();
        });

        this.toggleRangeYPoint = function () {
            self.focusOnYPoint(!self.focusOnYPoint());
        };
        this.focusOnYPoint = ko.observable(false);
        this.showRangeYPoint = ko.computed(function () {
            return self.focusOnYPoint() && self.isActive();
        });

        this.toggleRangeRadius = function () {
            self.focusOnRadius(!self.focusOnRadius());
        };
        this.focusOnRadius = ko.observable(false);
        this.showRangeRadius = ko.computed(function () {
            return self.focusOnRadius() && self.isActive();
        });
    }

    Circle.prototype = Object.create(Item.prototype);

    return Circle;
});