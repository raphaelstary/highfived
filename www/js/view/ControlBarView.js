define(['lib/knockout'], function (ko) {
    function ControlBarView(showLayerTool) {
        var self = this;
        this.isPlay = ko.observable(false);

        this.isPause = ko.computed(function () {
            return !self.isPlay();
        });
        this.isPlayPointerActive = ko.observable(true);
        this.isBuildPointerActive = ko.observable(false);
        this.isGhostMappingActive = ko.observable(false);
        this.showLayerTool = showLayerTool;
    }

    ControlBarView.prototype.playPointer = function () {
        this.isPlayPointerActive(true);
        this.isBuildPointerActive(false);
    };

    ControlBarView.prototype.buildPointer = function () {
        this.isBuildPointerActive(true);
        this.isPlayPointerActive(false);
    };

    ControlBarView.prototype.togglePlay = function () {
        this.isPlay(!this.isPlay());
    };

    ControlBarView.prototype.toggleGhostMapping = function () {
        this.isGhostMappingActive(!this.isGhostMappingActive());
    };

    ControlBarView.prototype.toggleShowLayerTool = function () {
        this.showLayerTool(!this.showLayerTool());
    };

    ControlBarView.prototype.exportStuff = function () {
        console.log("export the stuff");
    };

    return ControlBarView;
});