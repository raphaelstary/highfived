export default class Layers {
    constructor(layers, root, circleTemplate, lineTemplate, rectangleTemplate, textTemplate, imageTemplate,
        folderClosedTemplate, folderOpenTemplate) {
        this.__layers = layers;
        this.__rootNode = root;
        this.__circleTemplate = circleTemplate;
        this.__lineTemplate = lineTemplate;
        this.__rectangleTemplate = rectangleTemplate;
        this.__textTemplate = textTemplate;
        this.__imageTemplate = imageTemplate;
        this.__folderClosedTemplate = folderClosedTemplate;
        this.__folderOpenTemplate = folderOpenTemplate;
    }

    initHtml() {
        this.__layers.forEach(item => {

            let node;
            let itemNameNode;
            if (item.type == 'text') {
                node = this.__textTemplate.content.cloneNode(true);
                itemNameNode = node.querySelector('.editor-item-name');
                itemNameNode.innerText = item.msg;

            } else if (item.type == 'image') {
                node = this.__imageTemplate.content.cloneNode(true);
                itemNameNode = node.querySelector('.editor-item-name');
                itemNameNode.innerText = item.filename;

            } else if (item.type == 'rectangle') {
                node = this.__rectangleTemplate.content.cloneNode(true);
                if (item.viewId) {
                    itemNameNode = node.querySelector('.editor-item-name');
                    itemNameNode.innerText = item.viewId;
                }

            } else if (item.type == 'line') {
                node = this.__lineTemplate.content.cloneNode(true);
                if (item.viewId) {
                    itemNameNode = node.querySelector('.editor-item-name');
                    itemNameNode.innerText = item.viewId;
                }

            } else if (item.type == 'circle') {
                node = this.__circleTemplate.content.cloneNode(true);
                if (item.viewId) {
                    itemNameNode = node.querySelector('.editor-item-name');
                    itemNameNode.innerText = item.viewId;
                }
            } else if (item.type == 'folder') {
                node = this.__folderClosedTemplate.content.cloneNode(true);
                if (item.name) {
                    itemNameNode = node.querySelector('.editor-item-name');
                    itemNameNode.innerText = item.name;
                }
            }

            this.__rootNode.appendChild(node);
        });
    }
}