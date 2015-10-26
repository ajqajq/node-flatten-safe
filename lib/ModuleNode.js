/**
 * Created by weagle08 on 10/21/2015.
 */
'use strict';    

const path = require('path');
const fs = require('fs');
const q = require('q');
const jsonfile = require('jsonfile');

//PRIVATE MEMBER VARIABLES
const PARENT = Symbol();
const PKG_FILE = Symbol();
const PATH = Symbol();
const CHILDREN = Symbol();

module.exports = class ModuleNode {
    constructor(npath) {
        this[PATH] = npath;
        this[CHILDREN] = [];
        this.level = -1;
    }

    get name(){
        if(this[PKG_FILE] == null) {
            _getNodeInfo.bind(this)();
        }
        return this[PKG_FILE].name;
    }

    get version() {
        if(this[PKG_FILE] == null) {
            _getNodeInfo.bind(this)();
        }
        return this[PKG_FILE].version;
    }

    get parent() {
        return this[PARENT];
    }

    get path() {
        return this[PATH];
    }

    /**
     * returns a copy of this modules children
     * @returns {Array.<ModuleNode>}
     */
    get children() {
        return this[CHILDREN].slice();
    }

    size() {
        var count = this[CHILDREN].length;
        for(var i = 0; i < count; i++) {
            count += this[CHILDREN][i].size();
        }
        return count;
    }

    addChild(node) {
        if(node instanceof ModuleNode) {
            node[PARENT] = this;
            node.level = this.level + 1;
            this[CHILDREN].push(node);
        }
    }

    /**
     * this method compares two module nodes to see if they are a) same module and b) same module and version
     * @param node - module node to compare to
     * @returns number -  0 - modules are not the same, 1 - modules are same but different versions, 2 - modules are the exact same
     */
    compare(node) {
        if(node instanceof ModuleNode) {
            if(this.name == node.name) {
                if(this.version == node.version) {
                    return 2;
                } else {
                    return 1;
                }
            }
        }

        return 0;
    }



    print(){
        console.log(this.toString());
        if(this[CHILDREN].length > 0) {
            console.log('********************' + this.name + ' CHILDREN********************************');
            for(var i = 0; i < this[CHILDREN].length; i++) {
                this[CHILDREN][i].print();
            }

            console.log('********************' + this.name + ' CHILDREN END*************************************');
        }
    }

    toString(){
        return this.name + ': ' + this.version;
    }
};

function _getNodeInfo(){
    try {
        var pkgFile = path.join(this[PATH], 'package.json');
        var stats = fs.statSync(pkgFile);
        this[PKG_FILE] = jsonfile.readFileSync(pkgFile, {throws: true});
    } catch(e) {
        //do nothing
    }
}