'use strict';
var Flattener = require ('./lib/folderFlattener.js');
var Tree = require ('./lib/bftTopDownFlatteningTree.js');
var FOLDER_ARG_OFFSET = 2;
var DEFAULT_FOLDER_ARG_OFFSET = 1;
var folderToFlatten = process.argv[FOLDER_ARG_OFFSET];
if (typeof folderToFlatten == 'undefined') {
    folderToFlatten = process.argv[DEFAULT_FOLDER_ARG_OFFSET];
}
var flattener = new Flattener(Tree);
flattener.flatten(folderToFlatten);