/**
 * Created by weagle08 on 10/25/15.
 */
'use strict';

const ModuleNode = require('./ModuleNode');

//local member variables
const NAME = Symbol();
const VERSIONS = Symbol();
const VERSION_COUNT = Symbol();

module.exports = class ModuleSurvey {
    constructor(name){
        this[NAME] = name;
        this[VERSIONS] = {};
        this[VERSION_COUNT] = 0;
    }

    get name() {
        return this[NAME];
    }

    get versionCount() {
        return this[VERSION_COUNT];
    }

    addModule(module) {
        if(module instanceof ModuleNode) {
            let name = module.name;
            if(module.name === this[NAME]) {
                if(this[VERSIONS][module.version] == null) {
                    this[VERSIONS][module.version] = [];
                    this[VERSION_COUNT]++;
                }

                this[VERSIONS][module.version].push(module);
            }
        }
    }

    print(){
        console.log(this.name);
        console.log('unique versions: ' + this[VERSION_COUNT]);
    }
};