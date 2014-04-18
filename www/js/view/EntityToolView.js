define(['lib/knockout', 'model/Entity'], function(ko, Entity) {

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

    EntityToolView.prototype.activateItem = function (item) {
        if (this.entityBucket.activeItem != null) {
            this.entityBucket.activeItem.isActive(false);
        }

        item.isActive(true);

        this.entityBucket.activeItem = item;
    };

    EntityToolView.prototype.addEntity = function () {
        this.entityBucket.entities.push(new Entity('unknown ' + this.counter++, 100, 100));
    };

    EntityToolView.prototype.removeEntity = function (entity) {
    };

    EntityToolView.prototype.addItem = function () {
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

    return EntityToolView;
});
