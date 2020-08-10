export const GUARD_TS = 
`import { RouteGuard, Route, Injectable } from '@nimble-ts/core';

@Injectable()
export class [[FriendlyName]]Guard extends RouteGuard {

    constructor(){
        super();
    }

    public doActivate(currentPath: string, nextPath: string, route: Route): boolean {
		// Code your restrict logic
        return true;
    }
}`;