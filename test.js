'use strict';

var Tree = require('./lib/tree/Tree.js');
var Node = require('./lib/tree/TreeNode.js');
var Acorn = require('./lib/Acorn.js');

function TreeWithNoConflictsShouldCompletelyFlatten() {

    var root = new Node('root');
    var a = new Node('a');
    var b = new Node('b');
    var c = new Node('c');
    var d = new Node('d');
    root.addChild(a);
    root.addChild(b);
    b.addChild(c);
    c.addChild(d);
    var tree = new Tree(root);
    console.log('\nRunning test TreeWithNoConflictsShouldCompletelyFlatten');
    tree.flatten();

    //Asserts:
    if (a.children.length != 0) console.log('Test Failed - a has children.');
    if (b.children.length != 0) console.log('Test Failed - b has children.');
    if (c.children.length != 0) console.log('Test Failed - c has children.');
    if (d.children.length != 0) console.log('Test Failed - d has children.');
    if (root.children.length != 4) console.log('Test Failed - root does not have 4 children.');

    tree.print();
    console.log('***Test Complete***\n');
}

function TreeWithConflictsShouldFlattenCorrectly() {

    var root = new Node('root');
    var a = new Node('a');
    var b = new Node('b');
    var c = new Node('c');
    var d = new Node('d');
    var d2 = new Node('d');
    root.addChild(a);
    root.addChild(b);
    root.addChild(d2);
    b.addChild(c);
    c.addChild(d);
    var tree = new Tree(root);
    console.log('\nRunning test TreeWithConflictsShouldFlattenCorrectly');
    tree.flatten();

    //Asserts:
    if (a.children.length != 0) console.log('Test Failed - a has children.');
    if (b.children.length != 0) console.log('Test Failed - b has children.');
    if (c.children.length != 1) console.log('Test Failed - c should have one child (d).');
    if (d.children.length != 0) console.log('Test Failed - d has children.');
    if (root.children.length != 4) console.log('Test Failed - root does not have 4 children.');
    tree.print();
    console.log('***Test Complete***\n');
}

function AcornShouldGrowTreeFromDirectoryAndFlattenCorrectly() {
    console.log('\nRunning test AcornShouldGrowTreeFromDirectoryAndFlattenCorrectly');
    var acorn = new Acorn('C:/testData/flattenTest');
    acorn.grow().then((tree) => {
        console.log('tree (unflattened) = ' + tree);
        tree.print();
        tree.flatten();
        console.log('tree (flattened) = ' + tree);
        tree.print();
        if (tree.root.children.length != 4) console.log("Test Failed - root does not have 4 children.");
        console.log('***Test Complete***\n');
    });
}

TreeWithNoConflictsShouldCompletelyFlatten();
TreeWithConflictsShouldFlattenCorrectly();
AcornShouldGrowTreeFromDirectoryAndFlattenCorrectly();