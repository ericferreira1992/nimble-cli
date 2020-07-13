export const MAIN_TS =
`import { NimbleApp } from '@nimble-ts/core';
import { ROUTES } from './app/routes';

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