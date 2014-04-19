define(['lib/knockout', 'model/Item', 'model/Base', 'model/BaseImage'], function (ko, Item, Base, BaseImage) {
    function Image() {
        Item.call(this, 'image');
        Base.call(this);
        BaseImage(this);

        this.zIndex = ko.observable().extend({integer: null});
    }

    Image.prototype = Object.create(Item.prototype);

    return Image;
});