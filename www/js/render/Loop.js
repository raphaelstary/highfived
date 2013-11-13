define(function () {
    function Loop(requestAnimationFrame, renderer) {
        this.requestAnimationFrame = requestAnimationFrame;
        this.renderer = renderer;
    }

    Loop.prototype.start = function () {
        this.requestAnimationFrame(this.run.bind(this));

        this.renderer.drawScene();
    };

    return Loop;
});