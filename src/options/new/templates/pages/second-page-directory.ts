export const SECOND_HTML = 
`<div  class="second-page">
    <span>🤪</span><br>
    Second page rendered!
</div>`;

export const SECOND_SCSS = 
`.second-page {
    padding: 15px;
    text-align: center;

    > span  {
        font-size: 50px;
    }
}`;

export const SECOND_TS = 
`import { Page, PreparePage } from '@nimble-ts/core';

@PreparePage({
    template: require('./second.page.html'),
    style: require('./second.page.scss'),
    title: 'Nimble - First Page'
})
export default class SecondPage extends Page {

}`;