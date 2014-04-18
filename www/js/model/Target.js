define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Target() {
        Item.call(this, 'Targetnde');
        Base.call(this);

        this.radius = ko.observable().extend({integer: null});

        this.toggleRangeRadius = function () {
            self.focusOnRadius(!self.focusOnRadius());
        };
        this.focusOnRadius = ko.observable(false);
        this.showRangeRadius = ko.computed(function () {
            return self.focusOnRadius() && self.isActive();
        });
    }

    Target.prototype = Object.create(Item.prototype);

    return Target;
});