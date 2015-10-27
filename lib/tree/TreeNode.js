'use strict';

//Represents a node in a tree.  Has the following public members:
//id -  a string used to detect conflicts when flattening.
//value - anything you want it to be (optional)
//parent - the parent to this node (optional)
//children - children of this node (optional)
class TreeNode {
    constructor(id, value) {
        if (id == null || typeof id == 'undefined') throw 'TreeNode constructor was called without an id';
        this.id = id;
        if (typeof value === 'undefined') this.value = null;
        else this.value = value;
        this.parent = null; // you always create nodes independently and then add them as a child to their parent.
        this.children = new Array();
    }

    addChild(node) {
        this.children.push(node);
        node.parent = this;
    }

    removeChild(node) {
        var index = this.children.indexOf(node);
        if (index != -1) {
            this.children.splice(index, 1);
            node.parent = null;
        }
    }

    getSiblings() {
        if (this.parent != null) return this.parent.children;
        else return new Array(); // Return an empty array if we are the root.
    }
}

module.exports = TreeNode;