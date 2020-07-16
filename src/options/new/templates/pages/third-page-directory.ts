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
			<span [class]="{ 'selected': dropDown.selected }">
				{{dropDown.selected ? dropDown.selected.text : '🥺 Select a fruit'}}
			</span>
		</div>
		<ul @if="dropDown.show">
			<li @for="item of dropDown.items" (click)="selectItem(item)" [class]="{ 'selected': dropDown.selected === item }">
				{{item.text}}
			</li>
		</ul>
	</div>
</div>

<div class="page-example-2">
	<p>
		And this <strong>two way data binding</strong> using a simple form:
	</p>

	<form [form]="myForm">
		<input type="text" form-field-name="anyText" placeholder="Type something"/>
	</form>

	<p @if="myForm.value.anyText">
		😱 {{myForm.value.anyText}}
	</p>

	<button @if="myForm.value.anyText && !needShowFormData" (click)="showFormData()">
		Print form data as <strong>JSON</strong>
	</button>
	<span @if="myForm.value.anyText && needShowFormData">
		{{JSON.stringify(myForm.value, null, 2)}}
	</span>
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
	
	.page-example-1,
	.page-example-2 {
		border-top: dashed 2px rgba(#FFF, .25);
		margin: auto;
		padding-top: 5px;
		max-width: 300px;
	}
	
	.page-example-1 {
		margin-top: 25px;

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
				box-shadow: 2px 2px 5px rgba(#000, .25);
				border-radius: 5px;
				padding: 10px 30px 10px 12px;
				color: #777;
				width: inherit;

				> span {
					vertical-align: middle;

					&:not(.selected) {
						color: #999;
					}
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
				box-shadow: 2px 2px 5px rgba(#000, .25);
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

	.page-example-2 {
		margin-top: 40px;

		input {
			background: #FFF;
			box-shadow: 2px 2px 5px rgba(#000, .25);
			border: none;
			border-radius: 5px;
			height: 46px;
			padding: 0 12px;
			color: #777;
			width: 100%;
			max-width: 250px;
			outline: 0;
			font-size: 16px;
		}

		*:nth-child(3) {
			margin: auto;
			display: block;
			text-align: left;
			max-width: 250px;
			margin-top: 10px;
		}

		> button{
			cursor: pointer;
			margin-top: 20px;
			border: solid 2px #FFF;
			padding: 8px 14px;
			color: #FFF;
			background: transparent;
			border-radius: 17px;
			outline: 0;
		}
		> span {
			display: block;
			margin-top: 25px;
			font-size: 13px;
		}
	}
}


::placeholder {
	color: #999;
	opacity: 1;
}

:-ms-input-placeholder {
	color: #999;
}

::-ms-input-placeholder {
	color: #999;
}`;

export const THIRD_TS = 
`import { Page, PreparePage, Form } from '@nimble-ts/core';

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

	public myForm: Form;
	public needShowFormData: boolean = false;

	constructor() {
		super();

		this.myForm = new Form({
			anyText: { value: '' }
		});
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

	public showFormData() {
		this.render(() => {
			this.needShowFormData = true;
		});
	}

	onDestroy() {
	}
}`;