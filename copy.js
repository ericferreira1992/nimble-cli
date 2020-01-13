let cpx = require('cpx');

let fileTypes = [
    'ico',
    'png',
    'jpg',
    'svg'
];

// cpx.copy('./package.json', 'lib');
// cpx.copy('README.md', 'lib');
cpx.copy(`./src/**/*.{${fileTypes.join()}}`, 'lib');