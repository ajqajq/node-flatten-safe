/**
 * Created by weagle08 on 10/21/2015.
 */
var ModuleTree = require('./lib/ModuleTree');
var ChainSaw = require('./lib/ChainSaw');

var tree = new ModuleTree('/home/ben/dev/flattent-test/');
tree.grow().then(function(){
    tree.print();
    //ChainSaw.grindItDown(tree);
});