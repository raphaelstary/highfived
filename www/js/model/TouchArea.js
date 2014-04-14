define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function TouchArea() {
        Item.call(this);
        Base.call(this);

        this.width = ko.observable().extend({integer: null});
        this.height = ko.observable().extend({integer: null});
    }

    TouchArea.prototype = Object.create(Item.prototype);

    return TouchArea;
});