export const THIRD_HTML = 
`<div  class="third-page">
	<span>✌🏼</span><br>
	<p>
		Third page rendered!
	</p>

	<div class="page-example-1">
		<p>
			Look that select dropdown:
		</p>

		<div class="drop-down">
			<div (click)="toggleShow()">
				<span>
					{{dropDown.selected ? dropDown.selected.text : '🥺 Select a fruit'}}
				</span>
			</div>
			<ul @if="dropDown.show">
				<li @for="item of dropDown.items" (click)="selectItem(item)" [class]="{'selected': dropDown.selected === item}">
					{{item.text}}
				</li>
			</ul>
		</div>
	</div>
</div>`;

export const THIRD_SCSS = 
`@import 'src/scss/variables';

.third-page {
    padding: 15px;
    text-align: center;

    > span  {
        font-size: 50px;
	}
	
	.page-example-1 {
		border-top: dashed 2px rgba(#FFF, .25);
		margin: auto;
		margin-top: 25px;
		max-width: 300px;

		> .drop-down {
			position: relative;
			width: 100%;
			max-width: 250px;
			text-align: left;
			margin: auto;

			> div {
				position: relative;
				cursor: pointer;
				background: #FFF;
				box-shadow: 2px 2px 5px rgba(#000, .5);
				border-radius: 5px;
				padding: 10px 30px 10px 12px;
				color: #777;
				width: inherit;

				> span {
					vertical-align: middle;
				}
			
				&::after {
					content: '';
					position: absolute;
					right: 12px;
					top: calc(50% - 2px);
					border-top: 6px solid rgba(#000, .4);
					border-left: 6px solid transparent;
					border-right: 6px solid transparent;
					border-bottom: 0 solid transparent;
				}

				&:not(:only-child) {
					&::after {
						border-top: 0 solid transparent;
						border-bottom: 6px solid rgba(#000, .4);
					}
				}
			}

			> ul {
				position: absolute;
				top: 50px;
				width: inherit;
				box-shadow: 2px 2px 5px rgba(#000, .5);
				border-radius: 5px;
				list-style: none;
				margin: 0;
				padding: 0;

				> li {
					list-style: none;
					cursor: pointer;
					padding: 12px 14px;
					background: #FFF;
					color: #777;
					font-size: 14px;

					&:not(:last-child) {
						border-bottom: 1px solid #EEE;
					}

					&:first-child {
						border-radius: 5px 5px 0 0;
					}

					&:last-child {
						border-radius: 0 0 5px 5px;
					}

					&:not(.selected):hover {
						background: #FAFAFA;
						color: $primaryColor;
					}

					&.selected {
						cursor: default;
						color: $primaryColor;
					}
				}
			}
		}
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

	public dropDown = {
		selected: '',
		show: false,
		items: [
			{ id: 1, text: '🍏 Apple' },
			{ id: 2, text: '🍓 Strawberry' },
			{ id: 3, text: '🍉 Watermelon' },
		]
	}

	constructor() {
		super()
	}

	onInit() {
	}

	public toggleShow() {
		this.render(() => {
			this.dropDown.show = !this.dropDown.show;
		});
	}

	public selectItem(item) {
		this.render(() => {
			this.dropDown.selected = item;
			this.dropDown.show = false;
		});
	}

	onDestroy() {
	}
}`;