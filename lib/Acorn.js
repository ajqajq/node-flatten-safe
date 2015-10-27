/**
 * Created by weagle08 on 10/21/2015.
 */
'use strict';

const fs = require('fs');
const q = require('q');
const path = require('path');
const ModuleInfo = require('./ModuleInfo');
const TreeNode = require ('./tree/TreeNode.js')
const Tree = require('./tree/Tree.js');

//private member variables
const PATH = Symbol();
const TREE = Symbol();

module.exports = class Acorn {
    constructor(rootPath) {
        this[PATH] = rootPath;
        this[TREE] = null;
    }

    grow(){
        var deferred = q.defer();

        if(this[TREE] == null) {
            let moduleInfo = new ModuleInfo(this[PATH]);
            let root = new TreeNode(moduleInfo.name + moduleInfo.version, moduleInfo);
            var tree = new Tree(root);
            this[TREE] = tree;
            _getModules.bind(this)(this.path, root).then(function(){
                deferred.resolve(tree);
            }, function(){
                deferred.resolve(tree);
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    get path() {
        return this[PATH];
    }

    get tree() {
        return this[TREE];
    }


};

function _getModules(mpath, parent) {
    var deferred = q.defer();

    var moduleDir = path.join(mpath, 'node_modules'); //TODO: pull actual modules directory from .npmrc file
    fs.readdir(moduleDir, function(error, results) {
        if(error) {
            //probably not a directory, just return normally
            deferred.resolve();
        } else {
            if(results.length < 1) {
                //there were no modules, return
                deferred.resolve();
            } else {
                let count = results.length;
                let current = 0;
                for(let j = 0; j < results.length; j++) {
                    let fpath = path.resolve(moduleDir, results[j]);

                    _processModule.bind(this)(fpath, parent).then(function(treeNode){
                        _getModules.bind(this)(treeNode.value.path, treeNode).then(function(){
                            current++;
                            if(current === count){
                                deferred.resolve();
                            }
                        }, function(error){
                            current++;
                            if(current === count){
                                deferred.resolve();
                            }
                        });
                    }.bind(this), function(err){
                        current++;
                        if(current === count){
                            deferred.resolve();
                        }
                    });
                }
            }
        }
    }.bind(this));

    return deferred.promise;
}

function _processModule(fpath, parent) {
    var deferred = q.defer();

    try{
        var stats = fs.statSync(fpath);
        if(stats.isDirectory()) {
            //we need to check that this is a valid node module by checking for the package.json file
            let pkgPath = path.join(fpath, 'package.json');
            fs.stat(pkgPath, function(err, stats){
                if(err) {
                    //this is not a valid node module, return normally
                    deferred.reject();
                } else {
                    let mod = new ModuleInfo(fpath);
                    let treeNode = new TreeNode (mod.name + mod.version,mod);
                    parent.addChild(treeNode);
                    deferred.resolve(treeNode);
                }
            }.bind(this));
        } else {
            deferred.reject();
        }
    } catch(e){
        deferred.reject();
    }

    return deferred.promise;
}
