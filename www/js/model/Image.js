define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Image() {
        Item.call(this, 'Image');
        Base.call(this);

        this.fileName = ko.observable();
        this.zIndex = ko.observable().extend({integer: null});
    }

    Image.prototype = Object.create(Item.prototype);

    return Image;
});