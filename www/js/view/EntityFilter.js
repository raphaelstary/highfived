define(['lib/knockout'], function (ko) {
    function EntityFilter(entityBucket) {
        this.entityBucket = entityBucket;
        this.tempEntities = [];
    }

    EntityFilter.prototype.handle = function (newValue) {
        if (typeof newValue !== 'string')
            return;

        var self = this;
        this.tempEntities.forEach(function (entity) {
            self.entityBucket.entities.push(entity);
        });

        this.entityBucket.entities.sort(function (left, right) {
            return left.name < right.name ? -1 : 1;
        });

        this.tempEntities = this.entityBucket.entities.remove(function (entity) {
            return !(entity.name().indexOf(newValue) != -1);
        });
    };

    return EntityFilter;
});