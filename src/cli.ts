import 'reflect-metadata';
import fs from 'fs-extra';
import path from 'path';
import * as cp from 'child_process';
import { Container } from 'inversify';
import { DependencyRegister } from './dependency-register';
import { NB } from './nb';

export class CLI {
    public static container = new Container();
    public static nb: NB;
    public static package: any;
	
	private static _nimbleVersion: string;
	public static get nimbleVersion(): string {
		if (!this._nimbleVersion) {
			this._nimbleVersion = cp.execSync('npm show @nimble-ts/core version').toString('utf8').replace(/(\r\n|\n|\r)/gm, "");
		}
		return this._nimbleVersion;
	}

    public static get version() { return this.package ? this.package.version : '1.0.0'; }
    public static get globalVersion(): string {
		if (this.workingInLocalProject()) {
			try {
				if (process.mainModule) {
					let globalPath = path.join(process.mainModule['path'], '../package.json');
					if (fs.existsSync(globalPath)) {
						let packgeJson = JSON.parse(fs.readFileSync(globalPath, 'utf8'));
						return packgeJson ? packgeJson.version : this.version;
					}
				}
			}
			catch { return this.version; }
		}
		return this.version;
	}

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

    public static hasGlobalInstalled(): boolean {
		if (this.workingInLocalProject()) {
			try {
				let packgeJson = require("../package.json");
				return true;
			}
			catch {
				return false;
			}
		}
		return true;
	}

    public static workingInLocalProject() {
		let projectRootPath = path.join(__dirname, '../../../../');
		return fs.existsSync(`${projectRootPath}/nimble.json`);
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
        
        let rootPath = path.parse(parent).root;

        while(parent && parent !== rootPath) {
            if (this.worksPathIsRootProject(parent))
                return true;
            parent = this.getParentPath(parent);
        }
        return false;
    }

    public static getNimbleProjectRootPath() {
        let parent = this.worksPath;
        let rootPath = path.parse(parent).root;

        while(parent && parent !== rootPath) {
            if (this.worksPathIsRootProject(parent))
                return parent;
            parent = this.getParentPath(parent);
        }
        return parent;
    }

    public static getParentPath(completePath: string) {
        let parentPath = path.join(completePath + '/..');
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