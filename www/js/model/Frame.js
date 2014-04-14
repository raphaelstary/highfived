define(['lib/knockout', 'model/Item'], function (ko, Item) {
    function Frame() {
        Item.call(this);

        this.fileName = ko.observable();
    }

    Frame.prototype = Object.create(Item.prototype);

    return Frame;
});