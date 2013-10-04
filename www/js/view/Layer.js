define(['lib/knockout', 'view/Item'], function (ko, Item) {
    function Layer(id, name, items) {
        this.id = id;
        this.name = ko.observable(name);
        this.items = ko.observableArray();

        var self = this;
        if (items !== undefined) {

            items.forEach(function (item) {
                self.items.push(new Item(item.id, item.name, item.xPoint, item.yPoint, item.width, item.height));
            });
        }

        this.isSelected = ko.observable(false);
        this.showControls = ko.observable(false);
        this.isHidden = ko.observable(false);

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