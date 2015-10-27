/**
 * Created by weagle08 on 10/21/2015.
 * Forked by ajqajq 10/27/2015
 */
'use strict';

var Acorn = require ('./lib/Acorn.js');
var acorn = new Acorn ('C:/testData/flattenTest');
acorn.grow().then((tree)=>{
    console.log ('here');
    console.log('tree = ' + tree);
    tree.print();
//    var ljack = new Lumberjack(tree);
//    ljack.survey(tree);
//    let surveys = ljack.surveys;
//    ljack.printSurveyResults();
});