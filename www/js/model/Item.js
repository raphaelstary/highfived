define(['lib/knockout'], function (ko) {
    /**
     *
     * @param {string} name
     * @constructor
     * @public
     */
    function Item(name) {
        this.name = ko.observable(name);

        this.isSelected = ko.observable(false);
        this.isActive = ko.observable(false);
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