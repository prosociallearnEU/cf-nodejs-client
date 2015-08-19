/*jslint node: true */
"use strict";

function BuildPacks() {
    this.buildpackMap = {};
    this.buildpackMap['static'] = "https://github.com/cloudfoundry/staticfile-buildpack";
    this.buildpackMap['nodejs'] = "https://github.com/cloudfoundry/nodejs-buildpack";
}

/**
 * [description]
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
BuildPacks.prototype.get = function (key) {
    if (this.buildpackMap[key]) {
        return this.buildpackMap[key];
    }
    throw new Error('This Buildpack is not supported');
};

module.exports = BuildPacks;
