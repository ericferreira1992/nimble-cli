export const ROOT_HTML = 
`<div  class="root-page">
	<header>
		<img src="/assets/img/logo.svg#white"/>
		<ul>
			<li @for="let item of menuItems" [class]="{ 'actived': routePath === item.path }">
				<a href="/{{item.path}}">{{item.text}}</a>
			</li>
		</ul>
	</header>

	<nimble-router class="root-content"></nimble-router>

	<div @if="loading" class="root-loaing">Loading page...</div>

	<div class="root-alert">
		⚠️ This sample Nimble project does not contain any third party code or script, everything was done using native resources of HTML and of framework itself.
	</div>
</div>`;

export const ROOT_SCSS = 
`@import 'src/scss/variables';

.root-page {
	background: linear-gradient(to bottom, darken($primaryColor, 15) 10%, $primaryColor 85%, lighten($primaryColor, 5) 100%);
	width: 100%;
	height: 100%;
    
    > header {
		width: 100%;
		padding: 25px;
		text-align: center;

		> img {
			width: auto;
			height: 66px;
			padding: 15px 0 25px 0;
            animation: root-logo-beating 1.5s ease-in-out infinite;
		}

        > ul {
            display: table;
            margin: 0 auto;
			padding: 0;
			border-radius: 24px;
			box-shadow: 1px 1px 5px rgba(#000, .25);

            > li {
				display: inline-block;
				vertical-align: middle;
				background: #FFF;

                > a {
                    font-size: 15px;
                    text-decoration: none;
                    color: #888;
                    display: block;
					padding: 15px 15px;
				}
				
				&:first-child {
					> a {
						padding-left: 20px;
					}
					border-radius: 24px 0 0 24px;
				}

				&:last-child {
					> a {
						padding-right: 20px;
					}
					border-radius: 0 24px 24px 0;
				}
				
				&:not(:last-child) {
					border-right: 1px solid rgba($primaryColor, .15);
				}

                &:not(.actived):hover {
                    background: #FAFAFA;

                    > a {
                        color: $primaryColor;
                    }
                }

                &.actived {
                    background: #FAFAFA;

                    > a {
                        color: $primaryColor;
                    }
                }
            }
        }
	}
	
	.root-alert {
		text-align: center;
		font-size: 11px;
		display: block;
		margin: auto;
		max-width: 500px;
		border-top: 1px dashed rgba(#FFF, 0.2);
		margin-top: 10px;
		padding-top: 20px;
		color: #FFF;
	}

    .root-content {
        display: block;
		padding: 15px;
		color: #FFF;
	}
	
	.root-loaing {
		text-align: center;
		color: #FFF;
	}
}

@keyframes root-logo-beating {
	0% {
		transform: translateY(0);
	}
	25% {
		transform: translateY(2px);
	}
	50% {
		transform: translateY(0);
	}
	75% {
		transform: translateY(-2px);
	}
	100% {
		transform: translateY(0);
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

    public loading = false;
    public menuItems = [
        { text: 'First page', path: '' },
        { text: 'Second page', path: 'second' },
        { text: 'Third page', path: 'third' },
    ];

    private cancelListeners: (() => void)[] = [];

    onInit() {
        this.cancelListeners = [
            Router.addListener('STARTED_CHANGE', () => {
                this.render(() => this.loading = true);
            }),
            Router.addListener(['FINISHED_CHANGE', 'CHANGE_REJECTED', 'CHANGE_ERROR'], () => {
				this.render(() => this.loading = false);
            })
        ]
	}

    onDestroy() {
        this.cancelListeners.forEach(unlistener => {
			unlistener();
		});
    }
}`;