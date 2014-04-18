define(['lib/knockout', 'model/Entity', 'model/Image', 'model/Path', 'model/TouchArea', 'model/Target',
'model/Sprite', 'model/Frame'], function(ko, Entity, Image, Path, TouchArea, Target, Sprite, Frame) {

    function EntityToolView(entityBucket, showEntityTool) {
        this.entityBucket = entityBucket;
        this.showEntityTool = showEntityTool;
        this.filter = ko.observable();

        this.showImages = ko.observable(true);
        this.showSprites = ko.observable(true);
        this.showPaths = ko.observable(true);
        this.showTouchAreas = ko.observable(true);
        this.showTargets = ko.observable(true);

        this.MAX_RANGE = 1000;
        this.counter = 0;
    }

    EntityToolView.prototype.toggleControls = function (item) {
        item.showControls(!item.showControls());
    };

    EntityToolView.prototype.toggleSelectEntity = function (entity) {
        entity.isSelected(!entity.isSelected());

        if (entity.isSelected()) {
            this.activateEntity(entity);
        }
    };

    EntityToolView.prototype.activateEntity = function (entity) {
        this.entityBucket.deactivateActiveEntity();
        this.entityBucket.activateEntity(entity);
    };

    EntityToolView.prototype.toggleSelectItem = function (item) {
        item.isSelected(!item.isSelected());

        if (item.isSelected()) {
            this.activateItem(item);
        }
    };

    EntityToolView.prototype.activateItem = function (item) {
        this.entityBucket.deactivateActiveItem();
        this.entityBucket.activateItem(item);
    };

    EntityToolView.prototype.toggleEditEntityName = function (entity) {
        entity.isEditOn(!entity.isEditOn());
    };

    EntityToolView.prototype.toggleHide = function (item) {
        item.isHidden(!item.isHidden());
    };

    EntityToolView.prototype.deselectAllEntities = function () {
        this.entityBucket.entities.forEach(function (entity) {
            entity.isSelected(false);
        });
    };

    EntityToolView.prototype.addEntity = function () {
        this.entityBucket.entities.push(new Entity('unknown ' + this.counter++, 100, 100));
    };

    EntityToolView.prototype.removeEntity = function (entity) {
    };

    EntityToolView.prototype.createImage = function (entity) {
        entity.image = new Image();
        entity.hasImage(true);
    };

    EntityToolView.prototype.createPath = function () {

    };

    EntityToolView.prototype.createTouchArea = function () {

    };

    EntityToolView.prototype.createTarget = function () {

    };

    EntityToolView.prototype.createSprite = function () {

    };

    EntityToolView.prototype.createFrame = function () {

    };

    EntityToolView.prototype.removeItem = function (item) {
    };

    EntityToolView.prototype.toggleShowImages = function () {
        this.showImages(!this.showImages());
    };

    EntityToolView.prototype.toggleShowSprites = function () {
        this.showSprites(!this.showSprites());
    };

    EntityToolView.prototype.toggleShowPaths = function () {
        this.showPaths(!this.showPaths());
    };

    EntityToolView.prototype.toggleShowTouchAreas = function () {
        this.showTouchAreas(!this.showTouchAreas());
    };

    EntityToolView.prototype.toggleShowTargets = function () {
        this.showTargets(!this.showTargets());
    };

    EntityToolView.prototype.toggleEditEvents = function () {
    };

    EntityToolView.prototype.isImage = function (item) {
        return item instanceof Image;
    };

    EntityToolView.prototype.isPath = function (item) {
        return item instanceof Path;
    };

    EntityToolView.prototype.isSprite = function (item) {
        return item instanceof Sprite;
    };

    EntityToolView.prototype.isTouchArea = function (item) {
        return item instanceof TouchArea;
    };

    EntityToolView.prototype.isTarget = function (item) {
        return item instanceof Target;
    };

    EntityToolView.prototype.isFrame = function (item) {
        return item instanceof Frame;
    };

    return EntityToolView;
});
