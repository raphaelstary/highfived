require(['view/MainView', 'lib/domReady', 'lib/bootstrap'],
    function (MainView) {

        var inputLayers = [
            {
                id: 'event',
                name: 'event area',
                items: [
                    {id: '0', name: 'entry explosion', xPoint: 1, yPoint: 2, width: 3, height: 4},
                    {id: '1', name: 'trap', xPoint: 1, yPoint: 2, width: 3, height: 4},
                    {id: '2', name: 'another event', xPoint: 1, yPoint: 2, width: 3, height: 4}
                ]
            },
            {
                id: 'physic',
                name: 'physics body'
            },
            {
                id: 'collision',
                name: 'collision area'
            },
            {
                id: 'animated',
                name: 'animated object'
            },
            {
                id: 'transition',
                name: 'transition path'
            },
            {
                id: 'ai',
                name: 'AI point'
            },
            {
                id: 'static',
                name: 'static image'
            },
            {
                id: 'vector',
                name: 'vector field'
            },
            {
                id: 'touch',
                name: 'touch area'
            }
        ];

        var layerModel = new MainView(inputLayers).init();

        // - rectangle screen entity
        // - normalize drawn rect data
        // - mouse pointer vs rect collision detection (resolution)
        // - mouse down event handler
        //   - drawing mode
        //   - resize & move mode
        //   - check mouse pointer collision with resize/move points of _active_rect_
        //      - set resize/move ACTION
        //      - set resize & move mode
        //   - check mouse pointer collision with any rect
        //      - call call MvR collision resolution
        //      - focus on rect if hit
        //      - draw complete scene
        //   - draw new rect
        //      - set drawing mode
        // - mouse move event handler
        //   - drawing mode
        //      - resize new rect
        //   - resize & move mode
        //      - resize Or move
        //         - map actions to resize calls
        //            - resize top
        //            - resize bottom
        //            - resize left
        //            - resize right
        // - mouse up event handler
        //   - draw mode
        //      - resize new rect
        //      - normalize rect
        //      - quit drawing mode
        //   - resize & move mode
        //      - resize Or move
        //      - normalize rect
        //      - quit resize & move mode
        // - draw loop
        //   - call draw loop
        //   - drawing mode
        //   - resize & move mode
        //      - draw complete scene
        // - draw complete scene
        //   - clear
        //   - draw normal rects
        //   - draw active rect
        //   - draw new rect
        // - draw active rect
        //   - draw rect
        //   - draw circle

    }
);
