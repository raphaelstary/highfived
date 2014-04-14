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
    }

    Path.prototype = Object.create(Item.prototype);

    return Path;
});