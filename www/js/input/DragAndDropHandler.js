define(function () {
    function DragAndDropHandler() {
    }

    DragAndDropHandler.prototype.handleDrop = function (image, domElem, event) {
        event.preventDefault();

        var file = event.dataTransfer.files[0];

        var img = new Image();
        var self = this;
        img.onload = function () {
            image.img = img;
            image.fileName(file.name);
            image.imgReady(true);
        };
        img.src = window.URL.createObjectURL(file);
        if (domElem.childElementCount > 1)
            domElem.removeChild(domElem.children[1]);
        domElem.appendChild(img);
    };

    return DragAndDropHandler;
});