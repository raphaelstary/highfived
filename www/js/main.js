require(['view/MainView', 'input/ToolMouseHandler', 'input/RectCollisionDetector', 'input/RectActionInterpreter',
    'input/CircleCollisionDetector', 'input/CircleActionInterpreter', 'input/checkLineCollision',
    'input/LineActionInterpreter', 'render/getRequestAnimationFrame', 'render/Loop', 'render/Renderer',
        'render/ResizeBus', 'render/ResizeHandler', 'render/ScreenSizer', 'input/DragAndDropHandler',
    'lib/domReady', 'lib/bootstrap', 'lib/jquery'],
    function (MainView, ToolMouseHandler, RectCollisionDetector, RectActionInterpreter, CircleCollisionDetector,
              CircleActionInterpreter, checkLineCollision, LineActionInterpreter, getAnimFrame, Loop, Renderer,
              ResizeBus, ResizeHandler, ScreenSizer, DragAndDropHandler) {


        $('#tool-menu a').tooltip();

        var layerData = new MainView().init();
        var layerModel = layerData.entityBucket;
        var zoomLevel = layerData.zoomLevel;

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

        var toolMouseHandler = new ToolMouseHandler(layerModel, collisionDetector, actionInterpreter, zoomLevel);

        canvas.addEventListener('mousedown', toolMouseHandler.handleDown.bind(toolMouseHandler));
        canvas.addEventListener('mousemove', toolMouseHandler.handleMove.bind(toolMouseHandler));
        canvas.addEventListener('mouseup', toolMouseHandler.handleUp.bind(toolMouseHandler));

        var context = canvas.getContext('2d');
        var renderer = new Renderer(canvas, context, canvas.width, canvas.height, layerModel, zoomLevel);
        renderer.resize(window.innerWidth, window.innerHeight);

        var resizeBus = new ResizeBus();
        resizeBus.add('renderer', renderer.resize.bind(renderer));
        var resizeHandler = new ResizeHandler(new ScreenSizer(resizeBus), getAnimFrame(window));

        window.addEventListener('resize', resizeHandler.handleResize.bind(resizeHandler));

        canvas.addEventListener('dragenter', function () {
            event.preventDefault();
        });
        canvas.addEventListener('dragover', function () {
            event.preventDefault();
        });

        var dropHandler = new DragAndDropHandler(layerModel, zoomLevel);
        canvas.addEventListener('drop', dropHandler.handleDrop.bind(dropHandler));

        var loop = new Loop(getAnimFrame(window), renderer);
        loop.start();
    }
);
