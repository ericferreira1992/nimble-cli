export const SECOND_HTML = 
`<div  class="second-page">
	<span>🤪</span><br>
	<p>
		Second page rendered!
	</p>

	<div class="page-example">
		<p>
			Now look at this (drag the box):
		</p>

		<div [style]="{ 'top': (boxPosition.Y + 'px'), 'left': (boxPosition.X + 'px') }"
			(mousedown)="onMouseDownChange($event, true)"
			(mouseup)="onMouseDownChange($event, false)"
		>
			<div [class]="{ 'dragged': draggedOnce }">
				👏🏼<br/>
				<span>Great!!</span>
			</div>
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
		margin-top: 70px;
		height: 200px;

		> p {
			margin-top: -35px;
		}

		&::before {
			position: relative;
			content: '';
			display: block;
			max-width: 300px;
			border-top: dashed 2px rgba(#FFF, .25);
			margin: auto;
			top: -50px;
		}
		
		> div {
			position: absolute;
			user-select: none;
			background: #FFF;
			border-radius: 6px;
			width: 200px;
			height: 200px;
			border: 3px solid lighten($primaryColor, 5);
			box-shadow: 2px 2px 10px rgba(#000, .2);
			transform: translateX(-50%);
			cursor: -webkit-grab;
			cursor: grab;

			&:active {
				cursor: -webkit-grabbing;
				cursor: grabbing;
			}

			> div {
				position: relative;
				display: block;
				text-align: center;
				top: 50%;
				font-size: 50px;
				transform: translateY(-50%);
				opacity: 0;
				transition-delay: 800ms;
				transition-duration: 300ms;
				
				> span {
					margin-top: -8px;
    				display: block;
					font-size: 25px;
					color: $primaryColor;
				}

				&.dragged {
					opacity: 1;
				}
			}
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

	public draggedOnce = false;
	public mouseDown = false;
	public mousePrevPosition = { X: 0, Y: 0 };
	public boxPosition = { X: 0, Y: 0 };

    constructor(
		private listener: Listener
	) {
		super();
		this.mousePrevPosition.X = window.innerWidth / 2;
		this.boxPosition.X = window.innerWidth / 2;
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
				this.draggedOnce = true;

				this.boxPosition.X += event.clientX - this.mousePrevPosition.X;
				this.boxPosition.Y += event.clientY - this.mousePrevPosition.Y;
				this.mousePrevPosition.X = event.clientX;
				this.mousePrevPosition.Y = event.clientY;
			});
		}
	}
}`;