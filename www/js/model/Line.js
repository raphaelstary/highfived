define(['model/Item', 'lib/knockout'], function (Item, ko) {
    function Line(name, xPointA, yPointA, xPointB, yPointB) {
        Item.call(this, name);

        this.xPointA = ko.observable(xPointA);
        this.yPointA = ko.observable(yPointA);
        this.xPointB = ko.observable(xPointB);
        this.yPointB = ko.observable(yPointB);
    }

    Line.prototype = Object.create(Item.prototype);

    return Line;
});