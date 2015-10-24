/**
 * Created by weagle08 on 10/21/2015.
 */

'use strict';

module.exports = class ChainSaw {
    constructor(){

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
            var levelModules = tree.levels[level].slice();
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

                }
            }
        }

        console.log(collisionModules);
    }
};