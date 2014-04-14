define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Sprite() {
        Item.call(this);
        Base.call(this);

        this.frames = ko.observableArray();
        this.loop = ko.observable(false);
        this.duration = ko.observable().extend({integer: null});
        this.zIndex = ko.observable().extend({integer: null});
    }

    Sprite.prototype = Object.create(Item.prototype);

    return Sprite;
});