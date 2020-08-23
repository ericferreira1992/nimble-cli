"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SW_JS = exports.MANIFEST_JSON = exports.INDEX_HTML = void 0;
exports.INDEX_HTML = '' +
    "<!doctype html>\n<html lang=\"en\">\n    <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, minimum-scale=1.0\">\n        <title>[[ProjectFriendlyName]]</title>\n        <link rel=\"icon\" type=\"image/x-icon\" href=\"favicon.ico\">\n\t\t<link rel=\"manifest\" href=\"manifest.json\">\n\t\t<script>\n\t\t\tif ('serviceWorker' in navigator) {\n\t\t\t\tnavigator.serviceWorker.register('sw.js', { scope: '/' });\n\t\t\t}\n\t\t</script>\n    </head>\n    <body>\n        <nimble-root></nimble-root>\n    </body>\n</html>";
exports.MANIFEST_JSON = '' +
    "{\n\t\"lang\": \"pt\",\n\t\"dir\": \"ltr\",\n\t\"name\": \"Nimble Demo Page\",\n\t\"short_name\": \"NimbleDemoPage\",\n\t\"icons\": [\n\t\t{\n\t\t\t\"src\": \"/assets/img/icon_100x100.png\",\n\t\t\t\"sizes\": \"100x100\",\n\t\t\t\"type\": \"image/png\"\n\t\t}\n\t],\n\t\"theme_color\": \"#5D2EE6\",\n\t\"background_color\": \"#5D2EE6\",\n\t\"start_url\": \"/\",\n\t\"display\": \"standalone\",\n\t\"orientation\": \"natural\"\n}";
exports.SW_JS = '' +
    "self.addEventListener('install', e => {\n\te.waitUntil(\n\t\tcaches.open('app-cache').then(cache => {\n\t\t\treturn cache.addAll([\n\t\t\t\t'/'\n\t\t\t]);\n\t\t})\n\t);\n});";
//# sourceMappingURL=public-directory.js.map