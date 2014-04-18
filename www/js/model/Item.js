define(['lib/knockout'], function (ko) {
    function Item(type) {
        this.type = ko.observable(type);
        this.isSelected = ko.observable(false);
        this.isActive = ko.observable(false);
        this.showControls = ko.observable(false);
        this.isHidden = ko.observable(false);

        var self = this;
        this.showHide = ko.computed(function () {
            return self.showControls() || self.isHidden();
        });
    }

    return Item;
});