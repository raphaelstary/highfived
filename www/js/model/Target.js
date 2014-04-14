define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Target() {
        Item.call(this);
        Base.call(this);

        this.radius = ko.observable().extend({integer: null});
    }

    Target.prototype = Object.create(Item.prototype);

    return Target;
});