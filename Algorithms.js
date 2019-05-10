/**
 * @class Abstract algorithm
 * 
 * @constructor
 * @abstract
 * @protected
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Boolean} [isSubalgorithm] Set true if this algorithm is part of another algorithm.
 */
btv.AbstractAlgorithm = function(tree, visualiser, isSubalgorithm) {
    /**
     * @protected
     * @type {btv.BinaryTree}
     */
    this.tree = tree;
    
    /**
     * @protected
     * @type {btv.BinaryTree}
     */
    this.treeCopy = btv.AbstractAlgorithm.copyTree(this.tree);
    // assistant variables; reset for new call
    this.tree.selectedNode = undefined;

    /**
     * @protected
     * @type {btv.Visualiser}
     */
    this.visualiser = visualiser;

    /**
     * True if algorithm is called from another algorithm.
     *
     * @protected
     * @type {Boolean}
     */
    this.isSubalgorithm = Boolean(isSubalgorithm);
    
    /**
     * Listeners that are invoked at the start of animation chain.
     *
     * @protected
     * @type {jsgl.util.ArrayList}
     */
    this.startAnimationListeners = new jsgl.util.ArrayList();
    
    /**
     * Listeners that are invoked at the end of animation chain.
     *
     * @protected
     * @type {jsgl.util.ArrayList}
     */
    this.endAnimationListeners = new jsgl.util.ArrayList();
    
    /**
     * @private
     * @type {Number}
     */
    this.redoCalls = 0;
}
//btv.AbstractAlgorithm.prototype.redoCalls = 0;

/**
 * Create a copy of given tree.
 * 
 * @protected
 * @param {btv.BinaryTree} tree
 * @returns {btv.BinaryTree}
 */
btv.AbstractAlgorithm.copyTree = function(tree) {
    if(tree == null) {
        return null;
    }
    
    var treeCopy = new btv.BinaryTree("copy");
    
    if(tree.getRoot() !== null) { // not null => not an empty tree
    
        // copy of a root node
        treeCopy.setRoot(new btv.BinaryTreeNode(tree.getRoot().getValue())); 
    
        // recursively copy the rest of tree - preorder
        btv.AbstractAlgorithm.copyNodeRec(tree.getRoot().getLeft(), tree.getRoot().getRight(), treeCopy.getRoot());
    }
    
    /*   
    // copy of an inserted node
    if(tree.insertedNode != null) { // undefined or null
        treeCopy.insertedNode = new btv.BinaryTreeNode(tree.insertedNode.getValue()); 
    } else {
        treeCopy.insertedNode = null;
    }
    */  
    
    // copy of reference to selected node
    if(tree.selectedNode != null) { // null or undefined
        var index = tree.selectedNode.getIndex();
        treeCopy.selectedNode = treeCopy.getNode(index);
    } else {
        treeCopy.selectedNode = null;
    }
    
    return treeCopy;
}

/**
 * Copy given node recursively.
 * 
 * @protected
 * @param {btv.BinaryTreeNode} leftChildSource
 * @param {btv.BinaryTreeNode} rightChildSource
 * @param {btv.BinaryTreeNOde} parentCopy
 */
btv.AbstractAlgorithm.copyNodeRec = function(leftChildSource, rightChildSource, parentCopy) {
    
    if(leftChildSource != null) {
        // clone/copy
        parentCopy.setLeft(new btv.BinaryTreeNode(leftChildSource.getValue()));
        // recurse
        btv.AbstractAlgorithm.copyNodeRec(leftChildSource.getLeft(), leftChildSource.getRight(), parentCopy.getLeft());
    }
    
    if(rightChildSource != null) {
        // clone/copy
        parentCopy.setRight(new btv.BinaryTreeNode(rightChildSource.getValue()));
        // recurse
        btv.AbstractAlgorithm.copyNodeRec(rightChildSource.getLeft(), rightChildSource.getRight(), parentCopy.getRight());
    }
}

/**
 * Routine at start of each redo function.
 *
 * @protected
 */
btv.AbstractAlgorithm.prototype.redoStart = function() {
    
    this.redoCalls++;
    
    // fire start animation listeners
    this.visualiser.animateStart(this);
    
    if(!this.isSubalgorithm) {
        // remove arrayElement
        this.visualiser.animateRemoveArrayElem();
    }

    if(this.treeCopy.selectedNode != null) { // select selected node
        // get index of selected node
        var selectedIndex = this.treeCopy.selectedNode.getIndex();
        
        // get selected node
        var selectedNode = this.tree.getNode(selectedIndex);
        
        // if not selected select and show tree, othervise no selection nor showing is needed
        if(this.visualiser.selectedNode !== selectedNode) {
            this.visualiser.animateShowSelectNode(selectedNode);
        }
        
        this.node = selectedNode;
    } else { // this algorithm does not have a node as input value
        
        this.visualiser.animateSelectNode(null);
        this.node = null;
    }
}

/**
 * Routine at end of each redo function.
 *
 * @protected
 * @param {Boolean} [show]
 */
btv.AbstractAlgorithm.prototype.redoEnd = function(show) {
    
    if(show == null || show == true) {
        // show resultant tree
        this.visualiser.animateShowTree();
    }
    
    // add animator that fire end animation listeners
    this.visualiser.animateEnd(this); 
}

/**
 * Adds a listener function to be invoked when the chain of animations starts.
 *
 * @public
 * @param {Function}
 */
btv.AbstractAlgorithm.prototype.addStartAnimationListener = function(listener) {
    this.startAnimationListeners.add(listener);
}

/**
 * Removes a listener function.
 *
 * @public
 * @param {Function}
 */
btv.AbstractAlgorithm.prototype.removeStartAnimationListener = function(listener) {
    this.startAnimationListeners.remove(listener);
}

/**
 * Invokes all registered listener functions.
 *
 * @protected
 */
btv.AbstractAlgorithm.prototype.fireStartAnimationListeners = function() {
    
    var count = this.startAnimationListeners.getCount();
    for(var i = 0; i < count; i++) {
        this.startAnimationListeners.get(i)();
    }
}

/**
 * Adds a listener function to be invoked when the chain of animations ends.
 *
 * @public
 * @param {Function}
 */
btv.AbstractAlgorithm.prototype.addEndAnimationListener = function(listener) {
    this.endAnimationListeners.add(listener);
}

/**
 * Removes a listener function.
 *
 * @public
 * @param {Function}
 */
btv.AbstractAlgorithm.prototype.removeEndAnimationListener = function(listener) {
    this.endAnimationListeners.remove(listener);
}

/**
 * Invokes all registered listener functions.
 *
 * @protected
 */
btv.AbstractAlgorithm.prototype.fireEndAnimationListeners = function() {
    
    var count = this.endAnimationListeners.getCount();
    for(var i = 0; i < count; i++) {
        this.endAnimationListeners.get(i)();
    }
}

/**
 * Makes changes on the tree (do the algoritm) and fill the animatorsArray.
 * 
 * @abstract
 * @protected
 */
btv.AbstractAlgorithm.prototype.redo = function() {
    throw new btv.AlgorithmException("Abstract function");
}

/**
 * Makes changes on the tree (undo the algoritm) - set the tree to state before this algorithm was done (executed).
 * 
 * @protected
 */
btv.AbstractAlgorithm.prototype.undo = function() {

    // create copy of treeCopy to set as the tree
    var copy = btv.AbstractAlgorithm.copyTree(this.treeCopy);
    
    // set copy of treeCopy as the tree
    this.tree.setRoot(copy.getRoot());
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @private
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Number} min
 * @param {Number} max
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.RandomBSTreeAlg = function(tree, visualiser, min, max, isSubalgorithm) {
    
    /*
     * @private
     * @type {Number}
     */
    this.min = min;
    
    /*
     * @private
     * @type {Number}
     */
    this.max = max;

    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.RandomBSTreeAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.RandomBSTreeAlg.prototype.redo = function() {

    // routine
    this.redoStart();

    if(this.redoCalls > 1) { // repeated call - dont generate new random tree
        
        var copy = btv.AbstractAlgorithm.copyTree(this.randomtreeCopy);
        this.tree.setRoot(copy.getRoot());
        
    } else { // first call

        var epsilon = (this.max - this.min)/4;
        this.tree.setRoot(new btv.BinaryTreeNode(btv.getRandomInt(Math.floor(this.min+epsilon), Math.ceil(this.max-epsilon))));
    
        this.rec(this.tree.getRoot(), 1, this.min, this.max);
        
        this.randomtreeCopy = btv.AbstractAlgorithm.copyTree(this.tree);

    }
    
    this.visualiser.redrawTree(this.tree);
                
    // routine
    this.redoEnd();    
}   

/**
 * @private
 */
btv.bst.RandomBSTreeAlg.prototype.rec = function(node, level, min, max) {

    if(min >= node.getValue() - 1 || node.getValue() + 1 >= max) { // safety
        return;
    }
    
    var chance;
    
    if(level <= 3 && Math.random() < 0.5) { // make both child - generated tree is fuller
        chance = 1.0;
    } else {
        switch(level) {
            case 1:
                chance = 0.95;
                break;
            case 2:
                chance = 0.7;
                break; 
            case 3:
                chance = 0.4;
                break;
            case 4:
                chance = 0.2;
                break;            
            default:
                chance = 0.0; // no node at higher levels
                break;            
        }
    }

    var epsilon;

    // left child
    if(chance > Math.random()) {
        //node.setLeft(new btv.BinaryTreeNode(btv.getRandomInt(Math.floor(min + epsilon), Math.ceil(node.getValue() - epsilon))));
        epsilon = Math.round((node.getValue() - min)/2);
        node.setLeft(new btv.BinaryTreeNode(btv.getRandomInt(min + epsilon, node.getValue() - 1)));
        if(node.getLeft().getValue() == min) {
            min += 1;
        }
        this.rec(node.getLeft(), level + 1, min, node.getValue() - 1);
    }
    
    // right child
    if(chance > Math.random()) {
        //node.setRight(new btv.BinaryTreeNode(btv.getRandomInt(Math.floor(node.getValue() + epsilon), Math.ceil(max - epsilon))));
        epsilon = Math.round((max - node.getValue())/2);
        node.setRight(new btv.BinaryTreeNode(btv.getRandomInt(node.getValue() + 1, max - epsilon )));
        if(node.getRight().getValue() == max) {
            max -= 1;
        }
        this.rec(node.getRight(), level + 1, node.getValue() + 1, max);
    }
}

/**
 * @override
 * @public
 */
btv.bst.RandomBSTreeAlg.prototype.toString = function() {
    var array = this.tree.toArray();
    var str = "randomBSTree(";
    
    for(var i = 0; i < array.length; i++) {
        if(i != 0) {
            str += ", ";
        }
        if(array[i] == null) {
            str += "n";
        } else {
            str += array[i].getValue();
        }
    }
    str += ")"
        
    return str;
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @public
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Number} value
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.InsertAlg = function(tree, visualiser, value, isSubalgorithm) {
   
    /**
     * @private
     * @type {Number}
     */
    this.value = value;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);    
}
btv.bst.InsertAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.InsertAlg.prototype.redo = function() {
    
    // routine
    this.redoStart();   

    // remove grapgic node - necessary if skip backward and the graphic was already added
    this.visualiser.animateRemoveNode(this.node);

    this.node = new btv.BinaryTreeNode(this.value);

    // show the new graphic node
    this.visualiser.animateShowNodeElemNextTo(this.node, 0);
    
    var node = this.tree.getRoot();
    if(node === null) { // root is null -> empty tree -> insert root
        // logic
        this.tree.setRoot(this.node);
        
        // move the graphic node
        // has no parent, not needed edgeElement
        this.visualiser.animateMoveTo(this.node, 0);
    } else {
        while(true) {
            if(this.node.getValue() >= node.getValue()) { // right
                // visualisation of comparison
                this.visualiser.animateShowComparSign(this.node, true, node);
                
                if(node.getRight() === null) { // insert
                    node.setRight(this.node);
                    // move the graphic node
                    this.visualiser.animateMoveTo(this.node, 2*node.getIndex() + 2);
                    // show the graphic node parent edge 
                    this.visualiser.animateAddEdgeElem(this.node);
                    break;
                } else { // next comparison
                    node = node.getRight();
                    // move the graphic node
                    this.visualiser.animateMoveNextTo(this.node, node);
                }
            } else { // left
                // visualisation of comparison
                this.visualiser.animateShowComparSign(this.node, false, node);
                
                if(node.getLeft() === null) { // insert
                    node.setLeft(this.node);
                    // move the graphic node
                    this.visualiser.animateMoveTo(this.node, 2*node.getIndex() + 1);
                    // show the graphic node parent edge
                    this.visualiser.animateAddEdgeElem(this.node);                    
                    break;
                } else { // next comparison
                    node = node.getLeft();
                    // move the graphic node
                    this.visualiser.animateMoveNextTo(this.node, node);
                }
            }
        }
    }
    
    this.visualiser.animateSelectNode(null);
    
    // routine
    this.redoEnd();   
}

/**
 * @override
 * @public
 */
btv.bst.InsertAlg.prototype.toString = function() {
    return "insert(value: " + this.value + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @throws {btv.AlgorithmException} Throws an exception if BinaryTreeNode wasn't created - invalid value.
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Number} value
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.FindAlg = function(tree, visualiser, value, isSubalgorithm) {

    /**
     * @private
     * @type {Number}
     */
    this.value = value;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.FindAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.FindAlg.prototype.redo = function() {
    
    // routine
    this.redoStart();   
    
    // remove grapgic node - necessary if skip backward and the graphic was already added
    this.visualiser.animateRemoveNode(this.node);

    this.node = new btv.BinaryTreeNode(this.value);    
    
    // show the new graphic node
    //this.visualiser.animateShowAssistNodeElemNextTo(this.node, 0);
    this.node.selectable = false;
    this.visualiser.animateShowNodeElemNextTo(this.node, 0);
    
    var node = this.tree.getRoot();
    if(node === null) { // root is null -> empty tree -> not found
        
        this.visualiser.animateShowRemoveNode(this.node);
        this.visualiser.animateSelectNode(null); // deselect all
                
        // routine
        this.redoEnd();                  
                
        return null;
    } else {
        
        while(true) {
            if(this.node.getValue() == node.getValue()) { // found
                this.visualiser.animateShowComparSign(this.node, 0, node);
                this.visualiser.animateMoveTo(this.node, node.getIndex());
                this.visualiser.animateRemoveNode(this.node);
                this.visualiser.animateSelectNode(node); // select founded
                
                // routine
                this.redoEnd();   
                
                return node; 
            }
            
            if(this.node.getValue() > node.getValue()) { // right
                // visualisation of comparison
                this.visualiser.animateShowComparSign(this.node, 1, node);
                
                if(node.getRight() === null) { // not found
                    this.visualiser.animateMoveNextTo(this.node, node.getIndex()*2 + 2);
                    
                    break;
                } else { // next comparison
                    node = node.getRight();
                    // move the graphic node
                    this.visualiser.animateMoveNextTo(this.node, node);
                }
            } else { // left
                // visualisation of comparison
                this.visualiser.animateShowComparSign(this.node, -1, node);
                
                if(node.getLeft() === null) { // not found
                    this.visualiser.animateMoveNextTo(this.node, node.getIndex()*2 + 1);

                    break;
                } else { // next comparison
                    node = node.getLeft();
                    // move the graphic node
                    this.visualiser.animateMoveNextTo(this.node, node);
                }
            }
        }   
    
        // after break - not found
        this.visualiser.animateShowRemoveNode(this.node);
        this.visualiser.animateSelectNode(null); // deselect all
        
        // routine
        this.redoEnd();   
        
        return null;
    }
}

/**
 * @override
 * @public
 */
btv.bst.FindAlg.prototype.toString = function() {
    return "find(value: " + this.value + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {btv.BinaryTreeNode} node
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.DeleteAlg = function(tree, visualiser, node, isSubalgorithm) {
    
    /**
     * @private
     * @type {btv.BinaryTreeNode}
     */
    this.node = node;
    
    // copy of this reference will be created in the parent constructor - copy of given tree
    tree.selectedNode = this.node;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.DeleteAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.DeleteAlg.prototype.redo = function() {

    // routine
    this.redoStart();   

    if(this.node.getLeft() !== null  && this.node.getRight() !== null) { // both children
        
        // use getSuccessor() algorithm
        var getSuccessorAlg = new btv.bst.GetSuccessorAlg(this.tree, this.visualiser, this.node, true);
        var successor = getSuccessorAlg.redo();

        // swap this.node with successor
        this.tree.swapNodes(this.node, successor);
        this.visualiser.animateSwapNodeElems(this.node, successor);

    } // continue normally - delete node
    
    // now just one or no child
    if(this.node.getLeft() !== null) { // just left child

        var leftSubtreeRoot = this.node.getLeft();
    
        // grapgic - delete
        this.visualiser.animateShowRemoveNode(this.node);
        this.visualiser.animateRemoveElement(leftSubtreeRoot.edgeElement);
        
        if(this.node.isRoot()) {
            // logic
            this.node.setLeft(null);
            this.tree.setRoot(leftSubtreeRoot);
        } else {
            
            if(this.node.getParent().getLeft() == this.node) { // left child
                // logic
                this.node.getParent().setLeft(leftSubtreeRoot);
            } else { // right child
                // logic
                this.node.getParent().setRight(leftSubtreeRoot); 
            }
        }
        var leftSubtreePreorderArray = btv.BinaryTree.toInorderArrayRec(leftSubtreeRoot);
            
        // grapgic - move subtree
        this.visualiser.animateMoveToIndexLoc(leftSubtreePreorderArray);
            
        // graphic - add edge
        this.visualiser.animateAddEdgeElem(leftSubtreeRoot, leftSubtreeRoot.getParent());
    }
    
    else if(this.node.getRight() !== null) { // just right child
        
        var rightSubtreeRoot = this.node.getRight();
        
        // grapgic - delete
        this.visualiser.animateShowRemoveNode(this.node);
        this.visualiser.animateRemoveElement(rightSubtreeRoot.edgeElement);
        
        if(this.node.isRoot()) {
            // logic
            this.node.setRight(null);
            this.tree.setRoot(rightSubtreeRoot);
        } else {
            
            if(this.node.getParent().getLeft() == this.node) { // left child
                // logic
                this.node.getParent().setLeft(rightSubtreeRoot);
            } else { // right child
                // logic
                this.node.getParent().setRight(rightSubtreeRoot); 
            }
        }
        var rightSubtreePreorderArray = btv.BinaryTree.toInorderArrayRec(rightSubtreeRoot);
            
        // grapgic - move subtree
        this.visualiser.animateMoveToIndexLoc(rightSubtreePreorderArray);
            
        // graphic - add edge
        this.visualiser.animateAddEdgeElem(rightSubtreeRoot, rightSubtreeRoot.getParent());
    }
    
    else { // no child
        if(this.node.isRoot()) {
            // logic
            this.tree.setRoot(null);
        } else {
            // logic
            if(this.node.getParent().getLeft() === this.node) { // left child
                this.node.getParent().setLeft(null);
            } else { // right child
                this.node.getParent().setRight(null);
            }
        }
        // graphics
        this.visualiser.animateShowRemoveNode(this.node);
    }
    
    this.visualiser.animateSelectNode(null);
    
    // routine
    this.redoEnd();   
}

/**
 * @override
 * @public
 */
btv.bst.DeleteAlg.prototype.toString = function() {
    return "delete(value: " + this.treeCopy.selectedNode.getValue() + ", index: " + this.treeCopy.selectedNode.getIndex() + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////




/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {btv.BinaryTreeNode} node
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.GetMaxAlg = function(tree, visualiser, node, isSubalgorithm) {
    
    /**
     * @private
     * @type {btv.BinaryTreeNode}
     */
    this.node = node;
    
    // copy of this reference will be created in the parent constructor - copy of given tree
    tree.selectedNode = this.node;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);   
}
btv.bst.GetMaxAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 * 
 * @returns {btv.BinaryTreeNode} maximum
 */
btv.bst.GetMaxAlg.prototype.redo = function() {

    if(!this.isSubalgorithm) {
        // routine
        this.redoStart();  
    } else { // is called from another algorithm
        
        this.redoCalls++;
    
        // add animator that fire start animation listeners
        this.visualiser.animateStart(this);
    
        // select selected node
        // get index of selected node
        var selectedIndex = this.treeCopy.selectedNode.getIndex();
        
        // get selected node
        var selectedNode = this.tree.getNode(selectedIndex);
        
        this.node = selectedNode;
    }  
    
    var node;
    var searchNode;
    
    searchNode = new btv.BinaryTreeNode(String.fromCharCode(8664));
    this.visualiser.animateAddAssistNodeElemNextTo(searchNode, this.node);
                
    // find the most right node - maximum
    node = this.node;
    if(node.getRight() === null) { // to show that I try ro go right
        this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8664), false);
    }
    while(node.getRight() !== null) {
        node = node.getRight();
        this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8664), false);
        this.visualiser.animateMoveNextTo(searchNode, node);
    }
        
    
    // no more right children
    this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8664), false);
    this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8664), true);
    this.visualiser.animateMoveTo(searchNode, node.getIndex());
    this.visualiser.animateRemoveNode(searchNode);
    // select predecessor
    this.visualiser.animateSelectNode(node);
                
    if(!this.isSubalgorithm) {
        // routine
        this.redoEnd();  
    } else {
        // routine, but not show
        this.redoEnd(false);          
    }

    return node; // max found
}

/**
 * @override
 * @public
 */
btv.bst.GetMaxAlg.prototype.toString = function() {
    return "getMax(value: " + this.treeCopy.selectedNode.getValue() + ", index: " + this.treeCopy.selectedNode.getIndex() + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {btv.BinaryTreeNode} node
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.GetMinAlg = function(tree, visualiser, node, isSubalgorithm) {
    
    /**
     * @private
     * @type {btv.BinaryTreeNode}
     */
    this.node = node;
    
    // copy of this reference will be created in the parent constructor - copy of given tree
    tree.selectedNode = this.node;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);  
}
btv.bst.GetMinAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 * 
 * @returns {btv.BinaryTreeNode} minimum
 */
btv.bst.GetMinAlg.prototype.redo = function() {
    
    if(!this.isSubalgorithm) {
        // routine
        this.redoStart();  
    } else { // is called from another algorithm
            
        this.redoCalls++;
    
        // add animator that fire start animation listeners
        this.visualiser.animateStart(this);
    
        // select selected node
        // get index of selected node
        var selectedIndex = this.treeCopy.selectedNode.getIndex();
        
        // get selected node
        var selectedNode = this.tree.getNode(selectedIndex);
        
        this.node = selectedNode;
    }
   
    var node;
    var searchNode;
    
    searchNode = new btv.BinaryTreeNode(String.fromCharCode(8665));
    this.visualiser.animateAddAssistNodeElemNextTo(searchNode, this.node);
    
    node = this.node;
    if(node.getLeft() === null) { // to show that I try ro go left
        this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8665), false);
    }
    while(node.getLeft() !== null) {
        node = node.getLeft();
        this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8665), false);
        this.visualiser.animateMoveNextTo(searchNode, node);
    }
        
    // no more left children
    this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8665), false);
    this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8665), true);
    this.visualiser.animateMoveTo(searchNode, node.getIndex());
    this.visualiser.animateRemoveNode(searchNode);
    // select predecessor
    this.visualiser.animateSelectNode(node);
                
    // this.redoEnd(!this.isSubalgorithm); 
    if(!this.isSubalgorithm) {                
        // routine
        this.redoEnd();       
    } else {
        // routine but not show
        this.redoEnd(false);       
    }
                
    return node; // founded min    
}   

/**
 * @override
 * @public
 */
btv.bst.GetMinAlg.prototype.toString = function() {
    return "getMin(value: " + this.treeCopy.selectedNode.getValue() + ", index: " + this.treeCopy.selectedNode.getIndex() + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {btv.BinaryTreeNode} node
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.GetPredecessorAlg = function(tree, visualiser, node, isSubalgorithm) {
    
    /**
     * @private
     * @type {btv.BinaryTreeNode}
     */
    this.node = node;
    
    // copy of this reference will be created in the parent constructor - copy of given tree
    tree.selectedNode = this.node;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);  
}
btv.bst.GetPredecessorAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 * 
 * @returns {btv.BinaryTreeNode} predecessor
 */
btv.bst.GetPredecessorAlg.prototype.redo = function() {
   
    // routine
    this.redoStart();   
   
    var parent;
    var node;

    var searchNode = new btv.BinaryTreeNode(String.fromCharCode(8665));
    this.visualiser.animateShowAssistNodeElemNextTo(searchNode, this.node);

    node = this.node.getLeft();
    if(node !== null) { // has left subtree

        // move next to left child
        this.visualiser.animateMoveNextTo(searchNode, node);
        this.visualiser.animateRemoveNode(searchNode);
               
        // use getMax algoritm as part of that algorithm
        var getMaxAlg = new btv.bst.GetMaxAlg(this.tree, this.visualiser, node, true);
        var returnedValue = getMaxAlg.redo();
        
        // routine
        this.redoEnd();
        
        return returnedValue;
        
    }
    else {
        // no left subtree
        this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8665), true);
        
        // for first parent to that arrives from right
        node = this.node;
        parent = this.node.getParent();
        while(true) {
            
            if(parent === null) { // no predecessor
                // try to go to the top
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8657), false);
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8657), true);
                // hide searchNode
                this.visualiser.animateShowRemoveNode(searchNode);
                // unselect all
                this.visualiser.animateSelectNode(null);
                
                // routine
                this.redoEnd();  
                
                return null; // no predecessor found
            }
            
            // have to search at the top
            this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8657), false);
            
            // move nextTo parent if exists
            this.visualiser.animateMoveNextTo(searchNode, parent);

            if(parent.getRight() === node) { // arrived from right
                // from right
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8598), false);        
                // moveTo
                this.visualiser.animateMoveTo(searchNode, parent.getIndex());
                this.visualiser.animateRemoveNode(searchNode);
                // select predecessor
                this.visualiser.animateSelectNode(parent);
                
                // routine
                this.redoEnd();  
                
                return parent; // predecessor found
            } else {
                // not from right
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8598), true);
            }
            
            // next loop
            node = parent;
            parent = parent.getParent();
        }
    }
}   

/**
 * @override
 * @public
 */
btv.bst.GetPredecessorAlg.prototype.toString = function() {
    return "getPredecessor(value: " + this.treeCopy.selectedNode.getValue() + ", index: " + this.treeCopy.selectedNode.getIndex() + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {btv.BinaryTreeNode} node
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.GetSuccessorAlg = function(tree, visualiser, node, isSubalgorithm) {
    
    /**
     * @private
     * @type {btv.BinaryTreeNode}
     */
    this.node = node;
    
    // copy of this reference will be created in the parent constructor - copy of given tree
    tree.selectedNode = this.node;
    
    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.GetSuccessorAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 * 
 * @returns {btv.BinaryTreeNode} successor
 */
btv.bst.GetSuccessorAlg.prototype.redo = function() {
   
    // routine
    this.redoStart();  
   
    var parent;
    var node;

    var searchNode = new btv.BinaryTreeNode(String.fromCharCode(8664));
    this.visualiser.animateShowAssistNodeElemNextTo(searchNode, this.node);

    node = this.node.getRight();
    if(node !== null) { // has right subtree
        
        // move next to left child
        this.visualiser.animateMoveNextTo(searchNode, node);
        this.visualiser.animateRemoveNode(searchNode);
               
        // use getMin algoritm as part of that algorithm
        var getMinAlg = new btv.bst.GetMinAlg(this.tree, this.visualiser, node, true);
       
        // and do it // add EndAnimator
        var returnedValue = getMinAlg.redo();
        
        // routine
        this.redoEnd();
        
        return returnedValue;
        
    } else {
        // no rigt subtree
        this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8664), true);
       
        // for first parent to that arrives from left
        node = this.node;
        parent = this.node.getParent();
        while (true) {
            if(parent === null) { // no parent
                // no node at the top
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8657), false);            
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8657), true);
                // hide searchNode
                this.visualiser.animateShowRemoveNode(searchNode);
                // unselect all
                this.visualiser.animateSelectNode(null);
                
                // routine
                this.redoEnd();  
                
                return null; // no successor found
            }
            
            // have to search at the top
            this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8657), false);
            
            // move nextTo parent if exists
            this.visualiser.animateMoveNextTo(searchNode, parent);

            if(parent.getLeft() === node) { // arrived from left
                // from left
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8599), false);        
                // moveTo
                this.visualiser.animateMoveTo(searchNode, parent.getIndex());
                this.visualiser.animateRemoveNode(searchNode);
                // select successor
                this.visualiser.animateSelectNode(parent);
                
                // routine
                this.redoEnd();  
                
                return parent; // successor found
            } else {
                // not from right
                this.visualiser.animateShowChangeAssistNode(searchNode, String.fromCharCode(8599), true);
            }
            
            // next loop
            node = parent;
            parent = parent.getParent();
        }
    }
}   

/**
 * @override
 * @public
 */
btv.bst.GetSuccessorAlg.prototype.toString = function() {
    return "getSuccessor(value: " + this.treeCopy.selectedNode.getValue() + ", index: " + this.treeCopy.selectedNode.getIndex() + ")";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.ToPreorderArrayAlg = function(tree, visualiser, isSubalgorithm) {
    
    /**
     * Assistant graphic node acceessable from all functions.
     *
     * @private
     */
    this.moveNode = null;

    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.ToPreorderArrayAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.ToPreorderArrayAlg.prototype.redo = function() {
    var array = new Array();

    // routine
    this.redoStart();  

    // add array element
    this.visualiser.animateAddArrayElem(this.tree.getCount());

    // create moveNode
    this.moveNode = new btv.BinaryTreeNode(String.fromCharCode(8659));
    
    
    this.visualiser.animateShowAssistNodeElemNextTo(this.moveNode, 0);

    var node = this.tree.getRoot();
    if(node === null) {
        
        // show struck through move node
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8659), true);
        
        // hide move node
        this.visualiser.animateShowRemoveNode(this.moveNode);
    
        // routine
        this.redoEnd(); 
        
        return array;
    } 
    
    
    this.rec(node, array);
    
    
    // leave tree - change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
    
    // remove move node
    this.visualiser.animateRemoveNode(this.moveNode);            
              
    // routine
    this.redoEnd();   
    
    return array;
}

/**
 * @private
 */
btv.bst.ToPreorderArrayAlg.prototype.recLeft = function (node, array) {
    
    // change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8665));

    if(node === null) {    
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8665), true);
        
        return;
    }
    
    // move
    this.visualiser.animateMoveNextTo(this.moveNode, node);    
    
    this.rec(node, array);
}

/**
 * @private
 */
btv.bst.ToPreorderArrayAlg.prototype.recRight = function (node, array) {
    // change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8664));
    
    if(node === null) {
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8664), true);
        
        return;
    }

    // move
    this.visualiser.animateMoveNextTo(this.moveNode, node);
    
    this.rec(node, array);
}

/**
 * @private
 */
btv.bst.ToPreorderArrayAlg.prototype.rec = function (node, array) {
    
    // change label
    this.visualiser.animateChangeAssistNode(this.moveNode, "");

    // show index node
    var toArrayNode = new btv.BinaryTreeNode(node.getValue());
    toArrayNode.selectable = false;
    this.visualiser.animateShowNodeElemAt(toArrayNode, node);
    
    // move index node to arrayElem
    this.visualiser.animateMoveNextToArrayElem(toArrayNode);
        
    // hide index node
    this.visualiser.animateShowTree(0.25);
    this.visualiser.animateRemoveNode(toArrayNode);
        
    // show in array
    array.push(node);
    this.visualiser.animateShowInsertToArrayElem(node, array.length - 1);

    
    this.recLeft(node.getLeft(), array);
    
    
    // go up
    if(node.getLeft() !== null) { // only if has left child, otherwise moveNode is still here
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
        
        // move
        this.visualiser.animateMoveNextTo(this.moveNode, node);
    }
    
    
    this.recRight(node.getRight(), array);
    
    
    // go up
    if(node.getRight() !== null) { // only if has right child, otherwise moveNode is still here
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
        
        // move    
        this.visualiser.animateMoveNextTo(this.moveNode, node);
    }
}

/**
 * @override
 * @public
 */
btv.bst.ToPreorderArrayAlg.prototype.toString = function() {
    return "toPreorderArray()";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Boolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.ToInorderArrayAlg = function(tree, visualiser, isSubalgorithm) {
    
    /**
     * Assistant graphic node acceessable from all functions.
     *
     * @private
     */
    this.moveNode = null;

    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.ToInorderArrayAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.ToInorderArrayAlg.prototype.redo = function() {
    // reset states if play again etc
    var array = new Array();

    // routine
    this.redoStart();  

    // add array element
    this.visualiser.animateAddArrayElem(this.tree.getCount());

    // create moveNode
    this.moveNode = new btv.BinaryTreeNode(String.fromCharCode(8659));
    this.visualiser.animateShowAssistNodeElemNextTo(this.moveNode, 0);

    var node = this.tree.getRoot();
    if(node === null) {
        
        // show struck through move node
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8659), true);
        
        // hide move node
        this.visualiser.animateShowRemoveNode(this.moveNode);
    
        // routine
        this.redoEnd(); 
        
        return array;
        
    }
    
    
    this.rec(node, array);
    
    
    // leave tree - change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
    
    // remove move node
    this.visualiser.animateRemoveNode(this.moveNode);            
              
    // routine
    this.redoEnd();   
    
    return array;
}   

/**
 * @private
 */
btv.bst.ToInorderArrayAlg.prototype.recLeft = function (node, array) {
    
    // change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southWestDoubleArrow);

    if(node === null) {    
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southWestDoubleArrow, true);
        
        return;
    }
    
    // move
    this.visualiser.animateMoveNextTo(this.moveNode, node);
    
    this.rec(node, array);
}

/**
 * @private
 */
btv.bst.ToInorderArrayAlg.prototype.recRight = function (node, array) {
    // change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southEastDoubleArrow);
    
    if(node === null) {
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southEastDoubleArrow, true);
        
        return;
    }
    
    // move
    this.visualiser.animateMoveNextTo(this.moveNode, node);
    
    this.rec(node, array);
}

/**
 * @private
 */
btv.bst.ToInorderArrayAlg.prototype.rec = function (node, array) {

    // recursively
    this.recLeft(node.getLeft(), array);
    
    // go up
    if(node.getLeft() !== null) { // only if has left child, otherwise moveNode is still here
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
        
        // move
        this.visualiser.animateMoveNextTo(this.moveNode, node);
    }
    
    
    // change label
    this.visualiser.animateChangeAssistNode(this.moveNode, "");

    // show index node
    var toArrayNode = new btv.BinaryTreeNode(node.getValue());
    toArrayNode.selectable = false;
    this.visualiser.animateShowNodeElemAt(toArrayNode, node);
    
    // move index node to arrayElem
    this.visualiser.animateMoveNextToArrayElem(toArrayNode);
        
    // hide index node
    this.visualiser.animateShowTree(0.25);
    this.visualiser.animateRemoveNode(toArrayNode);

    // show in array
    array.push(node);
    this.visualiser.animateShowInsertToArrayElem(node, array.length - 1);
    
    
    this.recRight(node.getRight(), array);
    
    
    // go up
    if(node.getRight() !== null) { // only if has right child, otherwise moveNode is still here
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
        
        // move    
        this.visualiser.animateMoveNextTo(this.moveNode, node);
    }
}

/**
 * @override
 * @public
 */
btv.bst.ToInorderArrayAlg.prototype.toString = function() {
    return "toInorderArray()";
}



////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////



/**
 * @class
 * 
 * @constructor
 * @param {btv.BinaryTree} tree
 * @param {btv.Visualiser} visualiser
 * @param {Bolean} [isSubalgorithm]
 * @extends btv.AbstractAlgorithm
 */
btv.bst.ToPostorderArrayAlg = function(tree, visualiser, isSubalgorithm) {
    
    /**
     * Assistant graphic node acceessable from all functions.
     *
     * @private
     */
    this.moveNode = null;

    // parent constructor
    btv.AbstractAlgorithm.call(this, tree, visualiser, isSubalgorithm);
}
btv.bst.ToPostorderArrayAlg.jsglExtend(btv.AbstractAlgorithm);

/**
 * @override
 * @public
 */
btv.bst.ToPostorderArrayAlg.prototype.redo = function() {
    var array = new Array();

    // routine
    this.redoStart();  

    // add array element
    this.visualiser.animateAddArrayElem(this.tree.getCount());

    // create moveNode
    this.moveNode = new btv.BinaryTreeNode(String.fromCharCode(8659));
    this.visualiser.animateShowAssistNodeElemNextTo(this.moveNode, 0);

    var node = this.tree.getRoot();
    if(node === null) {
        
        // show struck through move node
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8659), true);
        
        // hide move node
        this.visualiser.animateShowRemoveNode(this.moveNode);
    
        // routine
        this.redoEnd(); 
        
        return array;
        
    }
    
    
    this.rec(node, array);
    
    
    // leave tree - change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
    
    // remove move node
    this.visualiser.animateRemoveNode(this.moveNode);            
              
    // routine
    this.redoEnd();   
    
    return array;
}   

/**
 * @private
 */
btv.bst.ToPostorderArrayAlg.prototype.recLeft = function (node, array) {
    
    // change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southWestDoubleArrow);

    if(node === null) {    
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southWestDoubleArrow, true);
        
        return;
    }
    
    // move
    this.visualiser.animateMoveNextTo(this.moveNode, node);
    
    this.rec(node, array);
}

/**
 * @private
 */
btv.bst.ToPostorderArrayAlg.prototype.recRight = function (node, array) {
    // change label
    this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southEastDoubleArrow);
    
    if(node === null) {
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, btv.Visualiser.southEastDoubleArrow, true);
        
        return;
    }
    
    // move
    this.visualiser.animateMoveNextTo(this.moveNode, node);
    
    this.rec(node, array);
}

/**
 * @private
 */
btv.bst.ToPostorderArrayAlg.prototype.rec = function (node, array) {
    
    // recursively
    this.recLeft(node.getLeft(), array);
    
    
    // go up
    if(node.getLeft() !== null) { // only if has left child, otherwise moveNode is still here
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
        
        // move
        this.visualiser.animateMoveNextTo(this.moveNode, node);
    }


    this.recRight(node.getRight(), array);


    // go up
    if(node.getRight() !== null) { // only if has right child, otherwise moveNode is still here
        // change label
        this.visualiser.animateShowChangeAssistNode(this.moveNode, String.fromCharCode(8657));
        
        // move    
        this.visualiser.animateMoveNextTo(this.moveNode, node);
    }
    

    // change label
    this.visualiser.animateChangeAssistNode(this.moveNode, "");

    // show index node
    var toArrayNode = new btv.BinaryTreeNode(node.getValue());
    toArrayNode.selectable = false;
    this.visualiser.animateShowNodeElemAt(toArrayNode, node);
    
    // move index node to arrayElem
    this.visualiser.animateMoveNextToArrayElem(toArrayNode);
        
    // hide index node
    this.visualiser.animateShowTree(0.25);
    this.visualiser.animateRemoveNode(toArrayNode);
        
    // show in array
    array.push(node);
    this.visualiser.animateShowInsertToArrayElem(node, array.length - 1);
}

/**
 * @override
 * @public
 */
btv.bst.ToPostorderArrayAlg.prototype.toString = function() {
    return "toPostorderArrayAlg()";
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////