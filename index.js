/**
 * Created by weagle08 on 10/21/2015.
 */
'use strict';

var ModuleTree = require('./lib/ModuleTree');
var Lumberjack = require('./lib/Lumberjack');

var tree = new ModuleTree('/home/ben/dev/flattent-test/');
tree.grow().then(function(){
    tree.print();
    var ljack = new Lumberjack(tree);
    ljack.survey(tree);
    let surveys = ljack.surveys;
    ljack.printSurveyResults();
});