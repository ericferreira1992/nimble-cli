export const SECOND_HTML = 
`<div  class="second-page">
	<span>🤪</span><br>
	<p>
		Second page rendered!
	</p>

	<p>
		Now look at this (drag the box):
	</p>

	<div class="page-example">
		<div [style]="{ 'top': (boxPositioned.Y + 'px'), 'left': (boxPositioned.X + 'px') }"
			(mousedown)="onMouseDownChange($event, true)"
			(mouseup)="onMouseDownChange($event, false)">
		</div>
	</div>
</div>`;

export const SECOND_SCSS = 
`@import 'src/scss/variables';

.second-page {
    padding: 15px;
    text-align: center;

    > span  {
        font-size: 50px;
	}
	
	.page-example {
		position: relative;
		width: calc(100% + 60px);
		margin: 0 -30px;
		
		> div {
			position: absolute;
			background: #FFF;
			border-radius: 6px;
			width: 200px;
			height: 200px;
			border: 3px solid lighten($primaryColor, 5);
			box-shadow: 2px 2px 10px rgba(#000, .2);
			transform: translateX(-50%);
		}
	}
}`;

export const SECOND_TS = 
`import { Page, PreparePage, Listener } from '@nimble-ts/core';

@PreparePage({
    template: require('./second.page.html'),
    style: require('./second.page.scss'),
    title: 'Nimble - First Page'
})
export class SecondPage extends Page {

	public mouseDown = false;
	public mousePrevPosition = { X: 0, Y: 0 };
	public boxPositioned = { X: 0, Y: 0 };

    constructor(
		private listener: Listener
	) {
		super();
		this.mousePrevPosition.X = window.innerWidth / 2;
		this.boxPositioned.X = window.innerWidth / 2;
	}

	onInit() {
		this.listener.listen(window, 'mousemove', this.onMouseMove.bind(this))
	}

	public onMouseDownChange(event: MouseEvent, down: boolean) {
		this.render(() => {
			this.mousePrevPosition.X = event.clientX;
			this.mousePrevPosition.Y = event.clientY;
			this.mouseDown = down;
		});
	}

	public onMouseMove(event: MouseEvent) {
		event.preventDefault();
		if (this.mouseDown) {
			this.render(() => {
				this.boxPositioned.X += event.clientX - this.mousePrevPosition.X;
				this.boxPositioned.Y += event.clientY - this.mousePrevPosition.Y;
				this.mousePrevPosition.X = event.clientX;
				this.mousePrevPosition.Y = event.clientY;
			});
		}
	}
}`;