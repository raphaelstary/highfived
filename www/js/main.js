require(['view/MainView', 'input/ToolMouseHandler', 'input/CollisionDetector', 'input/ActionInterpreter',
    'render/getRequestAnimationFrame', 'render/Loop', 'render/Renderer',
    'lib/domReady', 'lib/bootstrap'],
    function (MainView, ToolMouseHandler, CollisionDetector, ActionInterpreter, getAnimFrame, Loop, Renderer) {

        var inputLayers = [
            {
                id: 'event',
                name: 'event area',
                items: [],
                item: 'rectangle'
            },
            {
                id: 'physic',
                name: 'physics body',
                item: 'rectangle'
            },
            {
                id: 'collision',
                name: 'collision area',
                item: 'rectangle'
            },
            {
                id: 'animated',
                name: 'animated object',
                item: 'rectangle'
            },
            {
                id: 'transition',
                name: 'transition path',
                item: 'line'
            },
            {
                id: 'ai',
                name: 'AI point',
                item: 'circle'
            },
            {
                id: 'static',
                name: 'static image',
                item: 'rectangle'
            },
            {
                id: 'vector',
                name: 'vector field',
                item: 'rectangle'
            },
            {
                id: 'touch',
                name: 'touch area',
                item: 'rectangle'
            }
        ];

        var layerModel = new MainView(inputLayers).init();

        var canvas = document.getElementById('editor-ui');

        var actionInterpreter = new ActionInterpreter(CollisionDetector.checkFilledRectangle);
        var toolMouseHandler = new ToolMouseHandler(layerModel, CollisionDetector.checkRectangle,
            actionInterpreter.interpret.bind(actionInterpreter));

        canvas.addEventListener('mousedown', toolMouseHandler.handleDown.bind(toolMouseHandler));
        canvas.addEventListener('mousemove', toolMouseHandler.handleMove.bind(toolMouseHandler));
        canvas.addEventListener('mouseup', toolMouseHandler.handleUp.bind(toolMouseHandler));

        var renderer = new Renderer(canvas, canvas.getContext('2d'), canvas.width, canvas.height, layerModel);
        var loop = new Loop(getAnimFrame(window), renderer);
        loop.start();

    }
);
