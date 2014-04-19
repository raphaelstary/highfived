define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Sprite() {
        Item.call(this, 'sprite');
        Base.call(this);

        this.frames = ko.observableArray();
        this.frames.forEach = forEach;

        this.loop = ko.observable(false);
        this.duration = ko.observable().extend({integer: null});
        this.zIndex = ko.observable().extend({integer: null});
    }

    function forEach(fn) {
        ko.utils.arrayForEach(this(), fn);
    }

    Sprite.prototype = Object.create(Item.prototype);

    return Sprite;
});