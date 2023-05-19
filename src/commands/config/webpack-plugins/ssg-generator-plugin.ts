import Prerenderer from '@prerenderer/prerenderer';
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer';
import minify from 'html-minifier';
import path from 'path';
import fs from 'fs';
import { Compiler } from 'webpack';

export class SsgGeneratorPlugin {
    _options: Partial<{
        staticDir: string,
        outputDir: string,
        routes: string[],
        renderer: PuppeteerRenderer,
        postProcess: (renderedRoute: any) => any,
        postProcessHtml: (renderedRoute: any) => any,
        server: Partial<{}>,
        minify: boolean
    }>;

    constructor(...args) {
        this._options = {};

        if (args.length === 1) {
            this._options = args[0] || {}
        } else {
            console.warn("[prerender-spa-plugin] You appear to be using the v2 argument-based configuration options. It's recommended that you migrate to the clearer object-based configuration system.\nCheck the documentation for more information.");
            let staticDir, routes;

            args.forEach(arg => {
                if (typeof arg === 'string') staticDir = arg;
                else if (Array.isArray(arg)) routes = arg;
                else if (typeof arg === 'object') this._options = arg;
            })

            staticDir ? this._options.staticDir = staticDir : null;
            routes ? this._options.routes = routes : null;
        }

        this._options.server = this._options.server || {}
        this._options.renderer = this._options.renderer;
    }

    apply(compiler: Compiler): void {
        const compilerFS = compiler.outputFileSystem;

        const mkdirp = function (dir) {
            return new Promise<any>((resolve, reject) => {
                compilerFS.mkdir(
                    dir,
                    (made) => {
                        resolve(made) === null ? resolve(made) : reject(made);
                    }
                );
            })
        }

        const afterEmit = (compilation, done) => {
            const PrerendererInstance = new Prerenderer(this._options as any)

            PrerendererInstance.initialize()
                .then(() => {
                    return PrerendererInstance.renderRoutes(this._options.routes || [])
                })
                // Backwards-compatibility with v2 (postprocessHTML should be migrated to postProcess)
                .then(renderedRoutes => this._options.postProcessHtml
                    ? renderedRoutes.map(renderedRoute => {
                        const processed = this._options.postProcessHtml!(renderedRoute);
                        if (typeof processed === 'string') renderedRoute.html = processed
                        else renderedRoute = processed

                        return renderedRoute
                    })
                    : renderedRoutes
                )
                // Run postProcess hooks.
                .then(renderedRoutes => this._options.postProcess
                    ? Promise.all(renderedRoutes.map(renderedRoute => this._options.postProcess!(renderedRoute)))
                    : renderedRoutes
                )
                // Check to ensure postProcess hooks returned the renderedRoute object properly.
                .then(renderedRoutes => {
                    const isValid = renderedRoutes.every(r => typeof r === 'object')
                    if (!isValid) {
                        throw new Error('[prerender-spa-plugin] Rendered routes are empty, did you forget to return the `context` object in postProcess?')
                    }

                    return renderedRoutes
                })
                // Minify html files if specified in config.
                .then(renderedRoutes => {
                    if (!this._options.minify) return renderedRoutes

                    renderedRoutes.forEach(route => {
                        route.html = minify(route.html, this._options.minify)
                    })

                    return renderedRoutes
                })
                // Calculate outputPath if it hasn't been set already.
                .then(renderedRoutes => {
                    renderedRoutes.forEach(rendered => {
                        if (!rendered.outputPath) {
                            rendered.outputPath = path.join(this._options.outputDir ?? this._options.staticDir ?? '', rendered.route, 'index.html')
                        }
                    })

                    return renderedRoutes
                })
                // Create dirs and write prerendered files.
                .then(processedRoutes => {
                    const promises = Promise.all(processedRoutes.map(processedRoute => {
                        return mkdirp(path.dirname(processedRoute.outputPath))
                            .then(() => {
                                return new Promise<void>((resolve, reject) => {
                                    compilerFS.writeFile(processedRoute.outputPath, processedRoute.html.trim(), err => {
                                        if (err) reject(`[prerender-spa-plugin] Unable to write rendered route to file "${processedRoute.outputPath}" \n ${err}.`)
                                        else resolve()
                                    })
                                })
                            })
                            .catch(err => {
                                if (typeof err === 'string') {
                                    err = `[prerender-spa-plugin] Unable to create directory ${path.dirname(processedRoute.outputPath)} for route ${processedRoute.route}. \n ${err}`
                                }

                                throw err
                            })
                    }))

                    return promises
                })
                .then(r => {
                    PrerendererInstance.destroy()
                    done()
                })
                .catch(err => {
                    PrerendererInstance.destroy()
                    const msg = '[prerender-spa-plugin] Unable to prerender all routes!'
                    console.error(msg)
                    compilation.errors.push(new Error(msg))
                    done()
                })
        }

        if (compiler.hooks) {
            const plugin = { name: 'SsgGeneratorPlugin' }
            compiler.hooks.afterEmit.tapAsync(plugin, afterEmit)
        } else {
            // compiler.plugin('after-emit', afterEmit)
        }
    }
}