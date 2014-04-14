define(['lib/knockout', 'model/Item'], function (ko, Item) {
    function Entity(name, x, y) {
        Item.call(this);

        this.name = ko.observable(name);

        this.x = ko.observable(x).extend({integer: null});
        this.y = ko.observable(y).extend({integer: null});

        this.isEditOn = ko.observable(false);

        var self = this;

        this.showEdit = ko.computed(function () {
            return (self.isSelected() && self.showControls()) || self.isEditOn();
        });

        this.toggleRangeX = function () {
            self.focusOnX(!self.focusOnX());
        };
        this.focusOnX = ko.observable(false);
        this.showRangeX = ko.computed(function () {
            return self.focusOnX() && self.isActive();
        });

        this.toggleRangeY = function () {
            self.focusOnY(!self.focusOnY());
        };
        this.focusOnY = ko.observable(false);
        this.showRangeY = ko.computed(function () {
            return self.focusOnY() && self.isActive();
        });
    }

    Entity.prototype = Object.create(Item.prototype);

    return Entity;
});