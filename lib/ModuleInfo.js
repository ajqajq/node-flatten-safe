/**
 * Created by weagle08 on 10/21/2015.
 */
'use strict';    

const path = require('path');
const fs = require('fs');
const q = require('q_1.4.1');
const jsonfile = require('jsonfile');

//PRIVATE MEMBER VARIABLES
const PKG_FILE = Symbol();
const PATH = Symbol();

module.exports = class ModuleInfo {
    constructor(npath) {
        this[PATH] = npath;
    }

    get name(){
        if(this[PKG_FILE] == null) {
            this[PKG_FILE] = _getPackageFile.bind(this)(this[PATH]);
        }
        return this[PKG_FILE].name;
    }

    get version() {
        if(this[PKG_FILE] == null) {
            this[PKG_FILE] = _getPackageFile.bind(this)(this[PATH]);
        }
        return this[PKG_FILE].version;
    }

    get path() {
        return this[PATH];
    }

    /**
     * this method compares two modules to see if they are a) same module and b) same module and version
     * @param moduleInfo - module info to compare to
     * @returns number -  0 - modules are not the same, 1 - modules are same but different versions, 2 - modules are the exact same
     */
    compare(moduleInfo) {
        if(moduleInfo instanceof ModuleInfo) {
            if(this.name == moduleInfo.name) {
                if(this.version == moduleInfo.version) {
                    return 2;
                } else {
                    return 1;
                }
            }
        }

        return 0;
    }

    toString(){
        return this.name + ': ' + this.version;
    }
};

function _getPackageFile(filePath){
    try {
        var pkgFile = path.join(filePath, 'package.json');
        var stats = fs.statSync(pkgFile);
        return jsonfile.readFileSync(pkgFile, {throws: true});
    } catch(e) {
        //do nothing
    }
}