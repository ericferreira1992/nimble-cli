let cpx = require('cpx');

let fileTypes = [
    'ico',
    'png',
    'jpg',
    'svg'
];

cpx.copy(`./src/**/*.{${fileTypes.join()}}`, 'lib');