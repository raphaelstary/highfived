import initView from './view/initView.js';

window.onload = () => {
    let startScene;

    const canvas = document.getElementById('screen');
    const app = H5.Bootstrapper.build((services) => {
        const scenes = new H5.SceneMap();

        const testSceneKey = 'my-test';
        const scene = new H5.MVVMScene(services, services.startScene, {}, testSceneKey);

        scenes.put(testSceneKey, scene.show.bind(scene));
        scenes.next(testSceneKey);

        services.events.fire(H5.Event.RESIZE, {
            width: services.startScene.screen.width,
            height: services.startScene.screen.height,
            cssWidth: services.startScene.screen.width,
            cssHeight: services.startScene.screen.height,
            devicePixelRatio: 1
        });

        services.screen.style.width = services.startScene.screen.width + 'px';
        services.screen.style.height = services.startScene.screen.height + 'px';

        services.screen.style.backgroundColor = services.startScene.screen.color;

        initView(services.startScene);

    }, {
        load: (resourceLoader) => {
            startScene = resourceLoader.addJSON('../asset/scene/test.json');

        },
        process: (services) => {
            services.startScene = startScene;
        }
    }, canvas);

    app.start();

};