define(function () {
    function EntityBucket(entities) {
        this.entities = entities;

        this.activeItem = null;
        this.activeEntity = null;
    }

    EntityBucket.prototype.deactivateActiveItem = function () {
        if (this.activeItem != null) {
            this.activeItem.isActive(false);
        }
    };

    EntityBucket.prototype.activateItem = function (item) {
        this.activeItem = item;
        item.isActive(true);
        item.isSelected(true);
    };

    EntityBucket.prototype.deactivateActiveEntity = function () {
        if (this.activeEntity != null) {
            this.activeEntity.isActive(false);
        }
    };

    EntityBucket.prototype.activateEntity = function (entity) {
        this.activeEntity = entity;
        entity.isActive(true);
        entity.isSelected(true);
    };

    return EntityBucket;
});