export const THIRD_HTML = 
`<div  class="third-page">
    <span>✌🏼</span><br>
    Third page rendered!
</div>`;

export const THIRD_SCSS = 
`.third-page {
    padding: 15px;
    text-align: center;

    > span  {
        font-size: 50px;
    }
}`;

export const THIRD_TS = 
`import { Page, PreparePage } from '@nimble-ts/core';

@PreparePage({
    template: require('./third.page.html'),
    style: require('./third.page.scss'),
    title: 'Nimble - Third Page'
})
export class ThirdPage extends Page {

	constructor() {
		super();
	}

	onInit() {
	}
}`;