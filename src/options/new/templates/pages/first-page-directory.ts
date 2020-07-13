export const FIRST_HTML = 
`<div  class="first-page">
	<span>😎</span><br>
	<div>
		Wellcome to <strong>Nimble framework</strong>
	</div>

	<p>
		Look what to do:
	</p>

	<div class="page-example">
		<button (click)="decrease()">-</button>
		<button (click)="increase()">+</button>
		<div class="line-bar">
			<div [style]="{ 'width': (width + '%') }"></div>
		</div>
	</div>
</div>`;

export const FIRST_SCSS = 
`@import 'src/scss/variables';

.first-page {
    padding: 15px;
    text-align: center;

    > span  {
        font-size: 50px;
	}
	
	.page-example {
		padding-top: 10px;
		max-width: 300px;
		margin: auto;

		> button {
			outline: 0;
			margin: 0 5px;
			cursor: pointer;
			background: transparent;
			border-radius: 50%;
			width: 35px;
			height: 35px;
			font-size: 25px;
			font-weight: bold;
			border: 3px solid #FFF;
			color: #FFF;
		}

		.line-bar {
			position: relative;
			height: 30px;
			margin: 20px auto 0 auto;
			border-radius: 6px;
			border: 2px solid #FFF;
			overflow: hidden;

			> div {
				position: absolute;
				height: 100%;
				background: #FFF;
				transition-duration: 200ms;
				transition-delay: 50ms;
			}
		}
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

	public width: number = 10;

    constructor() {
        super();
	}
	
	public increase() {
		this.render(() => {
			this.width  = Math.min((this.width + 10), 100);
		});
	}
	public decrease() {
		this.render(() => {
			this.width = Math.max((this.width - 15), 0);
		});
	}
}`;