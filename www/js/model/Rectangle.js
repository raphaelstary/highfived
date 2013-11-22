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

        this.xPoint = ko.observable(xPoint).extend({integer: null});
        this.yPoint = ko.observable(yPoint).extend({integer: null});
        this.width = ko.observable(width).extend({integer: null});
        this.height = ko.observable(height).extend({integer: null});
    }

    Rectangle.prototype = Object.create(Item.prototype);

    return Rectangle;
});