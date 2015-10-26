/**
 * Created by weagle08 on 10/21/2015.
 */
'use strict';

const fs = require('fs');
const q = require('q');
const path = require('path');
const ModuleNode = require('./ModuleNode');

//private member variables
const PATH = Symbol();
const ROOT = Symbol();
const LEVELS = Symbol();

module.exports = class ModuleTree {
    constructor(rootPath) {
        this[PATH] = rootPath;
        this[ROOT] = null;
        this[LEVELS] = [];
    }

    grow(){
        var deferred = q.defer();

        if(this[ROOT] == null) {
            this[ROOT] = new ModuleNode(this[PATH]);
            this[ROOT].level = 0;
            this[LEVELS][0] = [];
            this[LEVELS][0].push(this[ROOT]);
            _getModules.bind(this)(this.path, this.root, this[LEVELS], 1).then(function(){
                deferred.resolve();
            }, function(){
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    get levels() {
        return this[LEVELS].slice();
    }

    get path() {
        return this[PATH];
    }

    get size() {
        if(this.root != null) {
            return this.root.size();
        }

        return 0;
    }

    get height(){
        return this[LEVELS].length;
    }

    get root() {
        return this[ROOT];
    }

    print(){
        if(this[ROOT] != null){
            this[ROOT].print();
        }
    }


};

function _getModules(mpath, parent, siblings, level) {
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

                    _processModule.bind(this)(fpath, parent, siblings, level).then(function(res){
                        _getModules.bind(this)(res.module.path, res.module, siblings, ++res.level).then(function(){
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

function _processModule(fpath, parent, siblings, level) {
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
                    let mod = new ModuleNode(fpath);
                    parent.addChild(mod);

                    if(siblings[level] == null) {
                        siblings[level] = [];
                    }

                    siblings[level].push(mod);
                    deferred.resolve({module: mod, level: level});
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
