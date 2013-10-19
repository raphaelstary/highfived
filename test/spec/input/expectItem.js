define(function () {
    function expectItem(item) {
        var that = this;

        this.fn = function (prop) {

            this.toBe = function (value) {

                expect(item[prop]()).toBe(value);

                return that;
            };

            return this;
        };

        return this;
    }

    return expectItem;
});