require(['view/MainView', 'input/ToolMouseHandler', 'input/RectCollisionDetector', 'input/RectActionInterpreter',
    'input/CircleCollisionDetector', 'input/CircleActionInterpreter', 'input/checkLineCollision',
    'input/LineActionInterpreter', 'render/getRequestAnimationFrame', 'render/Loop', 'render/Renderer',
    'lib/domReady', 'lib/bootstrap'],
    function (MainView, ToolMouseHandler, RectCollisionDetector, RectActionInterpreter, CircleCollisionDetector,
              CircleActionInterpreter, checkLineCollision, LineActionInterpreter, getAnimFrame, Loop, Renderer) {

        var inputLayers = [
            {
                id: 'event',
                name: 'event area',
                items: [],
                type: 'rectangle'
            },
            {
                id: 'physic',
                name: 'physics body',
                type: 'rectangle'
            },
            {
                id: 'collision',
                name: 'collision area',
                type: 'rectangle'
            },
            {
                id: 'animated',
                name: 'animated object',
                type: 'rectangle'
            },
            {
                id: 'transition',
                name: 'transition path',
                type: 'line'
            },
            {
                id: 'ai',
                name: 'AI point',
                type: 'circle'
            },
            {
                id: 'static',
                name: 'static image',
                type: 'rectangle'
            },
            {
                id: 'vector',
                name: 'vector field',
                type: 'rectangle'
            },
            {
                id: 'touch',
                name: 'touch area',
                type: 'rectangle'
            }
        ];

        var layerModel = new MainView(inputLayers).init();

        var canvas = document.getElementById('editor-ui');

        var rectActionInterpreter = new RectActionInterpreter(RectCollisionDetector.checkFilledRectangle);
        var lineActionInterpreter = new LineActionInterpreter(CircleCollisionDetector.checkFilledCircle);
        var circleActionInterpreter = new CircleActionInterpreter(CircleCollisionDetector.checkFilledCircle);

        var actionInterpreter = {
            interpretRect: rectActionInterpreter.interpret.bind(rectActionInterpreter),
            interpretLine: lineActionInterpreter.interpret.bind(lineActionInterpreter),
            interpretCircle: circleActionInterpreter.interpret.bind(circleActionInterpreter)
        };

        var collisionDetector = {
            checkRect: RectCollisionDetector.checkRectangle,
            checkLine: checkLineCollision,
            checkCircle: CircleCollisionDetector.checkCircle
        };

        var toolMouseHandler = new ToolMouseHandler(layerModel, collisionDetector, actionInterpreter);

        canvas.addEventListener('mousedown', toolMouseHandler.handleDown.bind(toolMouseHandler));
        canvas.addEventListener('mousemove', toolMouseHandler.handleMove.bind(toolMouseHandler));
        canvas.addEventListener('mouseup', toolMouseHandler.handleUp.bind(toolMouseHandler));

        var renderer = new Renderer(canvas, canvas.getContext('2d'), canvas.width, canvas.height, layerModel);
        var loop = new Loop(getAnimFrame(window), renderer);
        loop.start();

    }
);
