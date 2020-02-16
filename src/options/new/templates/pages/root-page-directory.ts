export const ROOT_HTML = 
`<div  class="root-page">
    <header>
        <div>Nimble</div>
        <ul>
            <li [class]="{ 'actived': routePath === 'first' }">
                <a href="first">First Page</a>
            </li>
            <li [class]="{ 'actived': routePath === 'second' }">
                <a href="second">Second Page</a>
            </li>
        </ul>
    </header>
    <nimble-router class="root-content"></nimble-router>
</div>`;

export const ROOT_SCSS = 
`@import 'src/scss/variables';

.root-page {
    
    > header {
        width: 100%;
        display: table;
        background: $primaryColor;
        
        > div {
            display: table-cell;
            vertical-align: middle;
            width: 100px;
            color: #FFF;
            font-size: 22px;
            padding-left: 15px;
            color: #FFF;
            background: $secondaryColor;
            font-weight: bold;
        }

        > ul {
            display: table-cell;
            vertical-align: middle;
            margin: 0;
            padding: 0;

            > li {
                display: inline-block;

                > a {
                    font-size: 14px;
                    text-decoration: none;
                    color: #404040;
                    display: block;
                    padding: 12px 15px;
                }

                &.actived {
                    background: #FFF;

                    > a {
                        color: $secondaryColor;
                    }
                }
            }
        }
    }

    .root-content {
        display: block;
        padding: 15px;
    }
}`;

export const ROOT_TS = 
`import { Page, PreparePage, Router } from '@nimble-ts/core';

@PreparePage({
    template: require('./root.page.html'),
    style: require('./root.page.scss')
})
export class RootPage extends Page {
    public get routePath() { return Router.currentPath; }
}`;