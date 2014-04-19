define(['lib/knockout', 'model/Item', 'model/BaseImage'], function (ko, Item, BaseImage) {
    function Frame() {
        Item.call(this, 'frame');
        BaseImage.call(this);
    }

    Frame.prototype = Object.create(Item.prototype);

    return Frame;
});