define(['lib/knockout'], function (ko) {
    function Layer(name, items) {
        this.name = ko.observable(name);
        this.items = items;

        this.isSelected = ko.observable(false);
        this.isActive = ko.observable(false);
        this.showControls = ko.observable(false);
        this.isHidden = ko.observable(false);

        var self = this;
        this.showItems = ko.computed(function () {
            return self.items().length > 0 && self.isSelected();
        });

        this.itemCount = ko.computed(function () {
            return self.items().length;
        });

        this.showHide = ko.computed(function () {
            return self.showControls() || self.isHidden();
        });

        this.deleteItem = function (item) {
            self.items.remove(item);
        };
    }

    return Layer;
});