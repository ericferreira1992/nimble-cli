import 'reflect-metadata';
import fs from 'fs-extra';
import path from 'path';
import { Container } from 'inversify';
import { DependencyRegister } from './dependency-register';
import { NB } from './nb';

export class CLI {
    public static container = new Container();
    public static nb: NB;
    public static package: any;
    public static nimbleVersion: string = '1.2.5';

    public static get version() { return this.package ? this.package.version : '1.0.0'; }

    public static get worksPath() { return process.cwd(); }
    
    public static start() {
        this.getInformation();
        DependencyRegister.register(this.container);

        this.nb = this.container.get<NB>('NB');
        this.nb.setArgurments(process.argv.slice(2));
        this.nb.start();
    }

    public static inject<T>(type: string) {
        return this.container.get<T>(type);
    }

    public static worksPathIsRootProject(path?: string) {
        if (!path) path = this.worksPath;
        if(!path.endsWith('/')) path += '/';

        if (!fs.pathExistsSync(`${path}src`) || !fs.existsSync(`${path}package.json`)) {
            return false
        }
        if (!fs.existsSync(`${path}nimble.json`)) {
            return false;
        }

        let packageFile = null;
        try { packageFile = require(`${path}package.json`); } catch {}
        if (!packageFile || !packageFile['dependencies'] || !packageFile['dependencies']['@nimble-ts/core'])
            return false;

        return true;
    }

    public static worksPathIsSourceDir() {
        let dirName = this.worksPath.split(path.sep).pop();
        return dirName === 'src';
    }

    public static isNimbleProject() {
        let parent = this.worksPath;
        while(parent && parent !== path.sep) {
            if (this.worksPathIsRootProject(parent))
                return true;
            parent = this.getParentPath(parent);
        }
        return false;
    }

    public static getNimbleProjectRootPath() {
        let parent = this.worksPath;
        while(parent && parent !== path.sep) {
            if (this.worksPathIsRootProject(parent))
                return parent;
            parent = this.getParentPath(parent);
        }
        return '';
    }

    public static getParentPath(completePath: string) {
        let parentPath = path.normalize(completePath + '/..');
        return parentPath;
    }

    private static getInformation() {
        try {
            this.package = require('package.json');
        }
        catch {
            this.package = require('../package.json');
        }
    }
    
}

CLI.start();