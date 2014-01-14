define(['model/Item', 'lib/knockout'], function (Item, ko) {
    function Circle(name, xPoint, yPoint, radius) {
        Item.call(this, name);

        this.xPoint = ko.observable(xPoint);
        this.yPoint = ko.observable(yPoint);
        this.radius = ko.observable(radius);
    }

    Circle.prototype = Object.create(Item.prototype);

    return Circle;
});