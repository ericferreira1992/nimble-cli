export const ROUTES_TS = 
`import { RouteBase } from '@nimble-ts/core';

export const ROUTES: RouteBase[] = [
    { path: '', redirect: 'first' },
    {
        path: '',
        page: () => import('./pages/root/root.page').then(x => x.RootPage),
        children: [
            {
                path: 'first',
                page: () => import('./pages/first/first.page').then(x => x.FirstPage)
            },
            {
                path: 'second',
                page: () => import('./pages/second/second.page').then(x => x.SecondPage)
            }   
        ]
    }
];`;