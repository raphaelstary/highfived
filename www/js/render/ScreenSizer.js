define(function () {
    function ScreenSizer(resizeBus) {
        this.resizeBus = resizeBus;
        this.currentWidth = 0;
        this.currentHeight = 0;
    }

    ScreenSizer.prototype.init = function (width, height) {
        this._notifyBus(width, height);
        this.currentWidth = width;
        this.currentHeight = height;
    };

    ScreenSizer.prototype.resize = function (width, height) {
        var factorWidth = width / this.currentWidth;
        var factorHeight = height / this.currentHeight;
        this._notifyBus(width, height, factorWidth, factorHeight);

        this.currentWidth = width;
        this.currentHeight = height;
    };

    ScreenSizer.prototype._notifyBus = function (width, height, factorWidth, factorHeight) {
        this.resizeBus.callResize(width, height, factorWidth, factorHeight);
    };

    return ScreenSizer;
});