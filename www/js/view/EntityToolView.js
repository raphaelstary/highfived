define(['lib/knockout'], function(ko) {

    function EntityToolView(entityBucket, showEntityTool) {
        this.entityBucket = entityBucket;
        this.showEntityTool = showEntityTool;
        this.filter = ko.observable();

        this.MAX_RANGE = 1000;
    }

    EntityToolView.prototype.toggleEntityControls = function (entity) {
        entity.showControls(!entity.showControls());
    };

    EntityToolView.prototype.toggleSelectEntity = function (entity) {
        entity.isSelected(!entity.isSelected());

        if (entity.isSelected()) {

            this.entityBucket.deactivateActiveEntity();
            this.entityBucket.activateEntity(entity);
        }
    };

    EntityToolView.prototype.toggleHideEntity = function (entity) {
        entity.isHidden(!entity.isHidden());
    };

    EntityToolView.prototype.toggleItemControls = function (item) {
        item.showControls(!item.showControls());
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

    EntityToolView.prototype.toggleHideItem = function (item) {
        item.isHidden(!item.isHidden());
    };

    EntityToolView.prototype.toggleSelectAllEntities = function () {
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

    return EntityToolView;
});
