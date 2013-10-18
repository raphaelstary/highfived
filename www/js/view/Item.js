define(['lib/knockout'], function (ko) {
    function Item(name, xPoint, yPoint, width, height) {
        this.name = ko.observable(name);
        this.xPoint = ko.observable(xPoint);
        this.yPoint = ko.observable(yPoint);
        this.width = ko.observable(width);
        this.height = ko.observable(height);

        this.isSelected = ko.observable(false);
        this.showControls = ko.observable(false);
        this.isHidden = ko.observable(false);
        this.isEditOn = ko.observable(false);

        var self = this;
        this.showHide = ko.computed(function () {
            return self.showControls() || self.isHidden();
        });

        this.showEdit = ko.computed(function () {
            return (self.isSelected() && self.showControls()) || self.isEditOn();
        });
    }

    return Item;
});