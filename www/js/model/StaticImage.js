define(['model/Rectangle'], function (Rectangle) {
    function StaticImage(name, xPoint, yPoint, width, height, img) {
        Rectangle.call(this, name, xPoint, yPoint, width, height);

        this.img = img;
    }

    StaticImage.prototype = Object.create(Rectangle.prototype);

    return StaticImage;
});