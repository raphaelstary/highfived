define(['model/Item', 'lib/knockout'], function (Item, ko) {
    /**
     *
     * @param {string} name
     * @param {number} xPointA
     * @param {number} yPointA
     * @param {number} xPointB
     * @param {number} yPointB
     * @param {number} xPointC
     * @param {number} yPointC
     * @param {number} xPointD
     * @param {number} yPointD
     * @constructor
     */
    function Curve(name, xPointA, yPointA, xPointB, yPointB, xPointC, yPointC, xPointD, yPointD) {
        Item.call(this, name);

        this.xPointA = ko.observable(xPointA).extend({integer: null});
        this.yPointA = ko.observable(yPointA).extend({integer: null});
        this.xPointB = ko.observable(xPointB).extend({integer: null});
        this.yPointB = ko.observable(yPointB).extend({integer: null});
        this.xPointC = ko.observable(xPointC).extend({integer: null});
        this.yPointC = ko.observable(yPointC).extend({integer: null});
        this.xPointD = ko.observable(xPointD).extend({integer: null});
        this.yPointD = ko.observable(yPointD).extend({integer: null});
    }

    Curve.prototype = Object.create(Item.prototype);

    return Curve;
});