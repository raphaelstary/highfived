import Layers from './Layers.js';

const layerListRoot = document.getElementById('root-items');
const circleTemplate = document.getElementById('item-circle');
const lineTemplate = document.getElementById('item-line');
const rectangleTemplate = document.getElementById('item-rectangle');
const textTemplate = document.getElementById('item-text');
const imageTemplate = document.getElementById('item-image');
const folderClosedTemplate = document.getElementById('item-folder-closed');
const folderOpenTemplate = document.getElementById('item-folder-open');

export default function initView(sceneData) {
    const layers = new Layers(sceneData.drawables, layerListRoot, circleTemplate, lineTemplate, rectangleTemplate,
        textTemplate, imageTemplate, folderClosedTemplate, folderOpenTemplate);
    layers.initHtml();
}