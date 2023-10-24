export const INDEX_HTML = ''+
`<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
        <title>[[ProjectFriendlyName]]</title>
        <link rel="icon" type="image/x-icon" href="favicon.ico">
		<link rel="manifest" href="manifest.json">
		<base href="/">
    </head>
    <body>
        <nimble-root></nimble-root>
    </body>
</html>`;

export const MANIFEST_JSON = ''+
`{
	"lang": "pt",
	"dir": "ltr",
	"name": "Nimble Demo Page",
	"short_name": "NimbleDemoPage",
	"icons": [
		{
			"src": "\/assets\/img\/icon_100x100.png",
			"sizes": "100x100",
			"type": "image\/png"
		}
	],
	"theme_color": "#5D2EE6",
	"background_color": "#5D2EE6",
	"start_url": "/",
	"display": "standalone",
	"orientation": "natural"
}`;