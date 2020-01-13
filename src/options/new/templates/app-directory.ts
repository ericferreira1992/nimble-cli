export const ROUTES_TS = 
`import { RouteBase } from '@nimble-ts/core';

export const ROUTES: RouteBase[] = [
    {
        path: '',
        page: () => import('./pages/root/root.page'),
        children: [
            {
                isPriority: true,
                path: 'first',
                page: () => import('./pages/first/first.page')
            },
            {
                path: 'second',
                page: () => import('./pages/second/second.page')
            }   
        ]
    }
];`;