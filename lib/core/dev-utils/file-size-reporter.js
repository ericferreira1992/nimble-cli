"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs_1 = tslib_1.__importDefault(require("fs"));
var path_1 = tslib_1.__importDefault(require("path"));
var chalk_1 = tslib_1.__importDefault(require("chalk"));
var filesize_1 = tslib_1.__importDefault(require("filesize"));
var recursive_readdir_1 = tslib_1.__importDefault(require("recursive-readdir"));
var strip_ansi_1 = tslib_1.__importDefault(require("strip-ansi"));
var gzip_size_1 = require("gzip-size");
function canReadAsset(asset) {
    return (/\.(js|css)$/.test(asset) &&
        !/service-worker\.js/.test(asset) &&
        !/precache-manifest\.[0-9a-f]+\.js/.test(asset));
}
// Prints a detailed summary of build files.
function printFileSizesAfterBuild(webpackStats, previousSizeMap, buildFolder, maxBundleGzipSize, maxChunkGzipSize) {
    var root = previousSizeMap.root;
    var sizes = previousSizeMap.sizes;
    var assets = (webpackStats.stats || [webpackStats])
        .map(function (stats) {
        return stats
            .toJson({ all: false, assets: true })
            .assets.filter(function (asset) { return canReadAsset(asset.name); })
            .map(function (asset) {
            var fileContents = fs_1.default.readFileSync(path_1.default.join(root, asset.name));
            var size = gzip_size_1.sync(fileContents);
            var previousSize = sizes[removeFileNameHash(root, asset.name)];
            var difference = getDifferenceLabel(size, previousSize);
            return {
                folder: path_1.default.join(path_1.default.basename(buildFolder), path_1.default.dirname(asset.name)),
                name: path_1.default.basename(asset.name),
                size: size,
                sizeLabel: filesize_1.default(size) + (difference ? ' (' + difference + ')' : ''),
            };
        });
    })
        .reduce(function (single, all) { return all.concat(single); }, []);
    assets.sort(function (a, b) { return b.size - a.size; });
    var longestSizeLabelLength = Math.max.apply(null, assets.map(function (a) { return strip_ansi_1.default(a.sizeLabel).length; }));
    var suggestBundleSplitting = false;
    assets.forEach(function (asset) {
        var sizeLabel = asset.sizeLabel;
        var sizeLength = strip_ansi_1.default(sizeLabel).length;
        if (sizeLength < longestSizeLabelLength) {
            var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
            sizeLabel += rightPadding;
        }
        var isMainBundle = asset.name.indexOf('main.') === 0;
        var maxRecommendedSize = isMainBundle
            ? maxBundleGzipSize
            : maxChunkGzipSize;
        var isLarge = maxRecommendedSize && asset.size > maxRecommendedSize;
        if (isLarge && path_1.default.extname(asset.name) === '.js') {
            suggestBundleSplitting = true;
        }
        console.log('  ' +
            (isLarge ? chalk_1.default.yellow(sizeLabel) : sizeLabel) +
            '  ' +
            chalk_1.default.dim(asset.folder + path_1.default.sep) +
            chalk_1.default.cyan(asset.name));
    });
    if (suggestBundleSplitting) {
        console.log();
        console.log(chalk_1.default.yellow('The bundle size is significantly larger than recommended.'));
        console.log(chalk_1.default.yellow('Consider reducing it with code splitting: https://goo.gl/9VhYWB'));
        console.log(chalk_1.default.yellow('You can also analyze the project dependencies: https://goo.gl/LeUzfb'));
    }
}
function removeFileNameHash(buildFolder, fileName) {
    return fileName
        .replace(buildFolder, '')
        .replace(/\\/g, '/')
        .replace(/\/?(.*)(\.[0-9a-f]+)(\.chunk)?(\.js|\.css)/, function (match, p1, p2, p3, p4) { return p1 + p4; });
}
// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
    var FIFTY_KILOBYTES = 1024 * 50;
    var difference = currentSize - previousSize;
    var fileSize = !Number.isNaN(difference) ? filesize_1.default(difference) : 0;
    if (difference >= FIFTY_KILOBYTES) {
        return chalk_1.default.red('+' + fileSize);
    }
    else if (difference < FIFTY_KILOBYTES && difference > 0) {
        return chalk_1.default.yellow('+' + fileSize);
    }
    else if (difference < 0) {
        return chalk_1.default.green(fileSize);
    }
    else {
        return '';
    }
}
function measureFileSizesBeforeBuild(buildFolder) {
    return new Promise(function (resolve) {
        recursive_readdir_1.default(buildFolder, function (err, fileNames) {
            var sizes;
            if (!err && fileNames) {
                sizes = fileNames.filter(canReadAsset).reduce(function (memo, fileName) {
                    var contents = fs_1.default.readFileSync(fileName);
                    var key = removeFileNameHash(buildFolder, fileName);
                    memo[key] = gzip_size_1.sync(contents);
                    return memo;
                }, {});
            }
            resolve({
                root: buildFolder,
                sizes: sizes || {},
            });
        });
    });
}
exports.FileSizeReporter = {
    measureFileSizesBeforeBuild: measureFileSizesBeforeBuild,
    printFileSizesAfterBuild: printFileSizesAfterBuild,
};
//# sourceMappingURL=file-size-reporter.js.map