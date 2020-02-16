export const FIRST_HTML = 
`<div  class="first-page">
    <span>😎</span><br>
    <div>
        Wellcome to <strong>Nimble framework</strong>
    </div>
    First page rendered!
</div>`;

export const FIRST_SCSS = 
`.first-page {
    padding: 15px;
    text-align: center;

    > span  {
        font-size: 50px;
    }
}`;

export const FIRST_TS = 
`import { Page, PreparePage } from '@nimble-ts/core';

@PreparePage({
    template: require('./first.page.html'),
    style: require('./first.page.scss'),
    title: 'Nimble - First Page'
})
export class FirstPage extends Page {

}`;