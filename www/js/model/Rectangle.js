define(['lib/knockout', 'model/Item'], function (ko, Item) {
    /**
     *
     * @param name
     * @param xPoint
     * @param yPoint
     * @param width
     * @param height
     * @constructor
     */
    function Rectangle(name, xPoint, yPoint, width, height) {
        Item.call(this, name);

        this.xPoint = ko.observable(xPoint);
        this.yPoint = ko.observable(yPoint);
        this.width = ko.observable(width);
        this.height = ko.observable(height);
    }

    Rectangle.prototype = Object.create(Item.prototype);

    return Rectangle;
});