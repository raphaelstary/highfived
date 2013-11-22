define(['lib/knockout', 'model/Item'], function (ko, Item) {
    /**
     *
     * @param name
     * @param xPoint
     * @param yPoint
     * @param width
     * @param height
     * @constructor
     */
    function Rectangle(name, xPoint, yPoint, width, height) {
        Item.call(this, name);

        this.xPoint = ko.observable(xPoint).extend({integer: null});
        this.yPoint = ko.observable(yPoint).extend({integer: null});
        this.width = ko.observable(width).extend({integer: null});
        this.height = ko.observable(height).extend({integer: null});

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

    Rectangle.prototype = Object.create(Item.prototype);

    return Rectangle;
});