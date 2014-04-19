define(['lib/knockout', 'model/Item'], function (ko, Item) {
    function Frame() {
        Item.call(this, 'frame');

        this.fileName = ko.observable();
    }

    Frame.prototype = Object.create(Item.prototype);

    return Frame;
});