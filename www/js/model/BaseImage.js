define(['lib/knockout'], function (ko) {
    function BaseImage() {
        this.fileName = ko.observable();

        var self = this;
        this.shortFileName = ko.computed(function () {
            if (self.fileName() && self.fileName().length > 13)
                return self.fileName().substr(0, 13) + " ...";
            return self.fileName();
        });

        this.img = {};
        this.imgReady = ko.observable(false);
    }

    return BaseImage;
});