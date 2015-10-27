'use strict';

var Acorn = require('./lib/Acorn.js');
var fs = require('fs');
var rimraf = require('rimraf');
var FOLDER_ARG_OFFSET = 2;
var DEFAULT_FOLDER_ARG_OFFSET = 1;
var folderToFlatten = process.argv[FOLDER_ARG_OFFSET];
if (typeof folderToFlatten == 'undefined') {
    folderToFlatten = process.argv[DEFAULT_FOLDER_ARG_OFFSET];
}
var acorn = new Acorn(folderToFlatten);
acorn.grow().then((tree) => {
    var allModules = {};

    //Note: should this be moved into the Tree class as a prune function?
    //Remove all duplicates and copy all modules into the root node_modules folder.
    tree.dftVisit((node) => {
        if (node == tree.root) return; // Don't try to move the root.
        //allModules is a dictionary of versions where name is the key. i.e. Dictionary<name,List<version>>
        if (allModules[node.value.name] == undefined) {
            allModules[node.value.name] = [node.value.version]; // This is the first instance of this module
            moveModuleToPath(getPath(folderToFlatten, node.value), node.value);
        } else if (contains(allModules[node.value.name], node.value.version)) {
            node.parent.removeChild(node); // Remove ourselves and don't copy, we're just a clone!
            node.children = new Array(); // Jettison all of my children.  This makes sure we don't traverse them.
            console.log("Removing duplicate - " + node.value.name + " version " + node.value.version);
            rimraf(node.value.path, (err) => {
                if (err) console.log(err);
            });
        } else {
            allModules[node.value.name].push(node.value.version);
            moveModuleToPath(getPath(folderToFlatten, node.value), node.value);
        }
    });

    function contains(names, name) {
        var index = names.indexOf(name);
        return index != -1;
    }

    function moveModuleToPath(path, moduleInfo) {
        console.log("Moving " + moduleInfo.path + " to " + path);
        fs.rename(moduleInfo.path, path, (err) => {
            if (err) console.log(err)
        });

    }

    function getPath(folderPath, moduleInfo) {
        return folderPath + "\\node_modules\\" + moduleInfo.name + "_" + moduleInfo.version;
    }
});