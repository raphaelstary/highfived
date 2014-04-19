define(['lib/knockout', 'model/Item', 'model/Base'], function (ko, Item, Base) {
    function Image() {
        Item.call(this, 'image');
        Base.call(this);

        this.fileName = ko.observable();

        var self = this;
        this.shortFileName = ko.computed(function () {
            if (self.fileName() && self.fileName().length > 13)
                return self.fileName().substr(0, 13) + " ...";
            return self.fileName();
        });

        this.zIndex = ko.observable().extend({integer: null});
        this.img = {};
        this.imgReady = ko.observable(false);
    }

    Image.prototype = Object.create(Item.prototype);

    return Image;
});