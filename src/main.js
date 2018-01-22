import initView from './view/initView.js';

const startScene = {
    'screen': {
        'width': 750,
        'height': 1334
    },
    'drawables': [
        {
            'type': 'rectangle',
            'x': 375,
            'y': 667,
            'width': 750,
            'height': 1334,
            'referenceId': 29,
            'filled': false,
            'lineWidth': 1,
            'color': '#000000'
        }, {
            'type': 'text',
            'x': 373,
            'y': 974,
            'width': 121,
            'height': 78,
            'referenceId': 6,
            'alpha': 0.4,
            'msg': 'play',
            'rotation': 0,
            'font': 'FFF Forward',
            'fontStyle': 'Regular',
            'size': 48,
            'color': '#f4f4f4'
        }, {
            'type': 'text',
            'x': 373,
            'y': 1172,
            'width': 367,
            'height': 39,
            'referenceId': 26,
            'alpha': 0.2,
            'msg': 'a game by raphael stary',
            'rotation': 0,
            'font': 'FFF Forward',
            'fontStyle': 'Regular',
            'size': 24,
            'color': '#f4f4f4'
        }, {
            'type': 'text',
            'x': 373,
            'y': 388,
            'width': 579,
            'height': 75,
            'referenceId': 5,
            'alpha': 0.8,
            'msg': 'PONGY PADDLE',
            'rotation': 0,
            'font': 'FFF Forward',
            'fontStyle': 'Regular',
            'size': 60,
            'color': '#f4f4f4'
        }
    ]
};
window.onload = () => initView(startScene);