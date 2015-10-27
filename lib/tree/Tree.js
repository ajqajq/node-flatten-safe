'use strict';

var _flattenSiblings = Symbol();
var _dftVisitNode = Symbol();

var Node = require('./TreeNode.js');

//Represents a tree with its corresponding nodes.  NOTE: The tree can only have one root. 
//This means the tree will only flatten up to the level just below the root.  This may
//require the addition of an artificial root if the consumer wishes to flatten 'all the way to the top'.
class Tree {
    constructor(root) {
        if (typeof root != 'undefined') this.root = root;

        //Private methods

        //Moves the node up to its parent unless there is a conflict in which case it 
        //does nothing.
        function moveUp(node) {
            var parent = node.parent;
            if (parent == null) {
                return;
            } //Nothing to do
            if (parent == root) return; // There can only be one root, we can't move up any more.
            if (containsId(parent.getSiblings(), node.id) == false) {
                parent.removeChild(node);
                parent.parent.addChild(node); // Make us a child of our grandparent instead of our parent (move up 1 level).
            }
        }

        function containsId(nodes, id) {
            for (let node of nodes) {
                if (node.id == id) return true;
            }
            return false;
        }

        //Flattens a group of siblings and then recursively flattens their children.
        //Does a breadth first traversal, with top-down flattening.
        this[_flattenSiblings] = function (siblings) {

            //Break the recursion if there are no siblings.
            if (siblings.length == 0) return;

            var children = new Array();
            for (let node of siblings) {

                //Get the next generation (all of the siblings children)
                //This is used for the breadth-first traversal.
                for (let child of node.children) {
                    children.push(child);
                }

                //Now move all of the siblings up (unless there are conflicts)
                moveUp(node);
            }
            this[_flattenSiblings](children);
        }

        this[_dftVisitNode] = function (node, visitFunction) {
            for (let child of node.children) {
                this[_dftVisitNode](child, visitFunction);
            }
            visitFunction(node);
        }
    }

    //A public method that flattens the tree while looking for conflicts.
    //The default algorithm for flattening is a BFT, top-down approach where
    //all nodes at the same level are moved up (if no conflicts exist) simultaneously.
    //Derived classes can modify this behavior if desired.
    flatten() {
        //To start, we just use the root, with no siblings.
        var siblings = [this.root];
        this[_flattenSiblings](siblings);
    }

    //Performs a depth-first-traversal and executes the visit function
    //on each node.  visitFunction signature should match: function visitFunction (node) { return err; }
    dftVisit(visitFunction) {
        this[_dftVisitNode](this.root, visitFunction);
    }

    print() {
        this.dftVisit((node) => {
            if (node.parent != null)
                console.log('Parent (' + node.parent.id + ')' + '=>' + node.id);
            else console.log('root = ' + node.id);
        });
}



}
module.exports = Tree;