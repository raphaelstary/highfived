define(['lib/knockout'], function(ko) {

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
    }

    EntityToolView.prototype.toggleControls = function (item) {
        item.showControls(!item.showControls());
    };

    EntityToolView.prototype.toggleSelectEntity = function (entity) {
        entity.isSelected(!entity.isSelected());

        if (entity.isSelected()) {

            this.entityBucket.deactivateActiveEntity();
            this.entityBucket.activateEntity(entity);
        }
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
        console.log("add entity");
    };

    EntityToolView.prototype.removeEntity = function (entity) {
        console.log("remove entity");
    };

    EntityToolView.prototype.addItem = function () {
        console.log("add item");
    };

    EntityToolView.prototype.removeItem = function (item) {
        console.log("remove item");
    };

    EntityToolView.prototype.toggleShowImages = function () {
        console.log('show/hide images');
    };

    EntityToolView.prototype.toggleShowSprites = function () {
        console.log('show/hide sprites');
    };

    EntityToolView.prototype.toggleShowPaths = function () {
        console.log('show/hide paths');
    };

    EntityToolView.prototype.toggleShowTouchAreas = function () {
        console.log('show/hide touch areas')
    };

    EntityToolView.prototype.toggleShowTargets = function () {
        console.log('show/hide targets');
    };

    EntityToolView.prototype.toggleEditEvents = function () {
        console.log('show event ')
    };

    return EntityToolView;
});
