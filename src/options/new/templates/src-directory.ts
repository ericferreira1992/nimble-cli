export const CONFIGURATION_JSON = 
`{
    "pre-render": {
        "enabled": true,
        "routes": [
        ]
    },
    "vendors": {
        "js": [],
        "css": []
    }
}`;

export const INDEX_TS =
`import { NimbleApp } from '@nimble-ts/core';
import { ROUTES } from './app/routes';
import './style.scss';

NimbleApp.config({
    routes: ROUTES,
    directives: [],
    providers: []
}).start();`;

export const STYLE_SCSS =
`@import '~@nimble-ts/core/style.scss';
@include nimble-core();

@import 'scss/reset';
`;