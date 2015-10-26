/**
 * Created by weagle08 on 10/21/2015.
 */

'use strict';

const del = require('del');
const ModuleSurvey = require('./ModuleSurvey');

//local member variables
const SURVEYS = Symbol();
const TREE = Symbol();

module.exports = class Lumberjack {
    constructor(tree){
        this[TREE] = tree;
    }

    get surveys() {
        return this[SURVEYS].slice();
    }

    survey() {
        //clear previous surveys
        this[SURVEYS] = [];
        for(let level = this[TREE].height - 1; level > 0; level--){
            var levelModules = this[TREE].levels[level];
            for(let module of levelModules){
                let found = false;
                for(let survey of this[SURVEYS]) {
                    if(survey.name === module.name) {
                        survey.addModule(module);
                        found = true;
                        break;
                    }
                }

                if(found === false) {
                    var s = new ModuleSurvey(module.name);
                    s.addModule(module);
                    this[SURVEYS].push(s);
                }
            }
        }
    }

    printSurveyResults() {
        console.log('unique modules: ' + this[SURVEYS].length);
        let collisions = 0;
        for(let s of this[SURVEYS]) {
            if(s.versionCount > 1) {
                collisions++;
            }
        }

        console.log('version collisions: ' + collisions);
    }

    chopItDown(){

    }

    /**
     * brings modules down to the lowest possible level
     * TODO: de-stink this heaping pile of poo (aka refactor)
     * @param tree
     */
    static grindItDown(tree){
        var evaluatedModules = [];
        var collisionModules = [];
        //start with lowest children and work way up to see if we can move up the tree
        for(var level = tree.height - 1; level > 0; level--) {
            var levelModules = tree.levels[level];
            var levelModulesLen = levelModules.length;
            for(var j = 0; j < levelModulesLen; j++) {
                var testModule = levelModules.pop();
                testModule.lastValidLevel = level;
                testModule.collisionDetected = false;

                //check to see if we have already processed this same module
                var completed = false;
                for(var k = 0; k < evaluatedModules.length; k++) {
                    if(evaluatedModules[k].compare(testModule) === 2) {
                        completed ^= evaluatedModules[k].collisionDetected;
                        break;
                    }
                }

                if(completed === false) {
                    //work way through tree checking for collisions of different version,
                    //if none are found go ahead and move this to the root modules directory

                    //check our current level first
                    for(var m = 0; m < levelModules.length; m++) {
                        if(levelModules[m].compare(testModule) === 1) {
                            testModule.collisionDetected = true;
                            collisionModules.push(testModule);
                            break;
                        }
                    }

                    //now check parent levels of tree
                    if(testModule.collisionDetected === false) {
                        for(var n = level - 1; n > 0; n--) {
                            var pLevels = tree.levels[n].slice();
                            for(var p = 0; p < pLevels.length; p++) {
                                if(pLevels[p].compare(testModule) === 1) {
                                    testModule.collisionDetected = true;
                                    collisionModules.push(testModule);
                                    testModule.lastValidLevel = n + 1;
                                    break;
                                }
                            }

                            if(testModule.collisionDetected === true) {
                                break;
                            }
                        }
                    }
                } else {
                    //no collisions were detected and the module should now be in base directory, it is ok to delete this one
                    var deletedFiles = del.sync(testModule.path);
                }
            }
        }

        console.log(collisionModules);
    }
};