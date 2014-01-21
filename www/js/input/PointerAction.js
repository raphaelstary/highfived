define(function () {

    //noinspection UnnecessaryLocalVariableJS
    /**
     * Enum for possible actions using shapes in the editor in edit mode
     *
     * @enum {number}
     * @readonly
     */
     var PointerAction = {
        NOTHING: -1,
        RESIZE_TOP_AND_LEFT: 0,
        RESIZE_TOP: 1,
        RESIZE_TOP_AND_RIGHT: 2,
        RESIZE_LEFT: 3,
        MOVE: 4,
        RESIZE_RIGHT: 5,
        RESIZE_BOTTOM_AND_LEFT: 6,
        RESIZE_BOTTOM: 7,
        RESIZE_BOTTOM_AND_RIGHT: 8,
        CREATE_NEW: 9,
        RESIZE_RADIUS: 10,
        CHANGE_POINT_A: 11,
        CHANGE_POINT_B: 12,
        CHANGE_POINT_C: 13,
        CHANGE_POINT_D: 14,
        TRANSFORM_FROM_POINT_A: 15,
        TRANSFORM_FROM_POINT_B: 16
    };

    return PointerAction;
});