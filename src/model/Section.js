// ----------------------------------------------------------------
// Text content
// ----------------------------------------------------------------

HTMLElement.prototype.sectionTextContent = function() {
	return this.firstChild.textContent;
};

HTMLElement.prototype.setSectionTextContent = function(text) {
	this.firstChild.textContent = text;
};

// ----------------------------------------------------------------
// Tree Structure
// ----------------------------------------------------------------

HTMLElement.prototype.parentSection = function() {
	var ul = this.parentNode;
	var p;
	
	if (ul != null) {
		p = ul.parentNode;
		if (p != null && p.nodeName == 'LI') {
			return p;
		}
	}
	
	return null;
};

HTMLElement.prototype.nextSectionSibling = function() {
	return this.nextSibling;
};

HTMLElement.prototype.previousSectionSibling = function() {
	return this.previousSibling;
};

function sectionChildrenUL(section, createIfNeeded) {
	var childrenUL = section.lastChild;
	if (childrenUL != null && childrenUL.nodeName == 'UL') {
		return childrenUL;
	} else if (createIfNeeded) {
		childrenUL = document.createElement('ul');
		section.appendChild(childrenUL);
		return childrenUL;
	}
	return null;
}

HTMLElement.prototype.firstSectionChild = function() {
	var childrenUL = sectionChildrenUL(this, false);
	if (childrenUL) return childrenUL.firstChild;
	return null;
};

HTMLElement.prototype.lastSectionChild = function() {
	var childrenUL = sectionChildrenUL(this, false);
	if (childrenUL) return childrenUL.lastChild;
	return null;
};

HTMLElement.prototype.sectionChildren = function() {
	var childrenUL = sectionChildrenUL(this, false);
	if (childrenUL) return childrenUL.childNodes;
	return null;
};

HTMLElement.prototype.treeOrderSectionNext = function () {
	var parent;
	var first;
	var next;

	first = this.firstSectionChild();
	if (first) return first;
	next = this.nextSectionSibling();
	if (next) next;
	
	parent = this.parentSection();
	while (parent) {
		next = parent.nextSectionSibling();
		if (next) {
			return next;
		}
		parent = parent.parentSection();
	}
	
	return null;
}

HTMLElement.prototype.treeOrderSectionPrevious = function() {
	var parent;
	var previous;
	
	previous = this.previousSectionSibling();
	if (previous) {
		return previous.leftmostSectionDescendantOrSelf();
	} else {
		parent = this.parentSection();
		
		if (parent == null || parent.isRoot()) {
			return null;
		} else {
			return parent;
		}
	}
}

HTMLElement.prototype.sectionDescendants = function() {
	var end = this.nextSectionSibling();
	var s = this.treeOrderSectionNext();
	var descendants = [];
	
	while (s != null && s != end) {
		descendants.push(s);
		s = s.treeOrderSectionNext();
	}
	
	return descendants;
}

HTMLElement.prototype.sectionDescendantsWithSelf = function() {
	return [this].concat(this.sectionDescendants());
}

HTMLElement.prototype.leftmostSectionDescendantOrSelf = function() {
	var last = this.lastSectionChild();
	if (last) return last.leftmostSectionDescendantOrSelf();
	return this;
}

HTMLElement.prototype.rightmostSectionDescendantOrSelf = function() {
	var first = this.firstSectionChild();
	if (first) return first.rightmostSectionDescendantOrSelf();
	return this;
}

HTMLElement.prototype.appendSectionChild = function(aSection) {
	sectionChildrenUL(this, true).appendChild(aSection);
}

HTMLElement.prototype.removeSectionChild = function(aSection) {
	var childrenUL = sectionChildrenUL(this, false);
	childrenUL.removeChild(aSection);
	if (!childrenUL.hasChildNodes()) {
		this.removeChild(childrenUL);
	}
}

HTMLElement.prototype.insertSectionChildBefore = function(insertedSection, adjacentSection) {
	sectionChildrenUL(this, true).insertBefore(insertedSection, adjacentSection);
}

// ----------------------------------------------------------------
// Tags have name and optional value
// ----------------------------------------------------------------

function sectionTagsSPAN(section, createIfNeeded) {
	var textContentDIV = section.firstChild;
	var tagsSPAN = textContentDIV.lastChild;
	if (tagsSPAN != null && tagsSPAN.className == "tags") {
		return tagsSPAN;
	} else if (createIfNeeded) {
		tagsSPAN = document.createElement("span");
		tagsSPAN.className = "tags";
		textContentDIV.appendChild(tagsSPAN);
		return tagsSPAN;
	}
	return null;
}

HTMLElement.prototype.firstSectionTag = function() {
	var tagsSPAN = sectionTagsSPAN(this, false);
	if (tagsSPAN) return tagsSPAN.firstChild;
	return null;
}

HTMLElement.prototype.lastSectionTag = function() {
	var tagsSPAN = sectionTagsSPAN(this, false);
	if (tagsSPAN) return tagsSPAN.lastChild;
	return null;
}

HTMLElement.prototype.appendSectionTag = function(aTag) {
	sectionTagsSPAN(this, true).appendChild(aTag);
}

HTMLElement.prototype.removeSectionTag = function(aTag) {
	var tagsSPAN = sectionTagsSPAN(this, false);
	tagsSPAN.removeChild(aSection);
	if (!tags.hasChildNodes()) {
		this.removeChild(tagsSPAN);
	}
}

HTMLElement.prototype.insertSectionTagBefore = function(insertedTag, adjacentTag) {
	sectionTagsSPAN(this, true).insertBefore(insertedTag, adjacentTag);
}

// ----------------------------------------------------------------
// Markers track locations in the text.
// ----------------------------------------------------------------

HTMLElement.prototype.sectionMarkers = function() {
}

HTMLElement.prototype.insertSectionMarkerWithOffset = function(aMarker, offset) {
}

HTMLElement.prototype.removeSectionMarker = function(aMarker) {
}


/*



















uniqueIDFactory = function() {
	var value = 0;
	return {
		nextID : function() {
			value += 1;
			return value;
		}
	}
}();
		
var section = function(state) {
	//var that = document.createElement("li");
	var that = {};
	
	// Init
	
	state.id = uniqueIDFactory.nextID();
	state.tags = [];
	state.parent = null;
	state.previousSibling = null;
	state.nextSibling = null;
	state.firstChild = null;
	state.lastChild = null;
	
	// Attributes

	that.document = function () {
		return null;
	}

	that.id = function () {
		return state.id;
	}

	that.parent = function () {
		return state.parent;
	}

	that.nextSibling = function () {
		return state.nextSibling;
	}

	that.previousSibling = function () {
		return state.previousSibling;
	}

	that.firstChild = function () {
		return state.firstChild;
	}

	that.lastChild = function () {
		return state.lastChild;
	}
	
	that.countOfChildren = function() {
		return 0;
	}
	
	that.textContent = function() {
		return state.textContent || '';
	}
	
	that.setTextContent = function(newTextContent) {
		statet.textContent = newTextContent;
	}

	// Tags
	
	that.tags = function() {
		return state.tags;
	}
	
	// Tree
	
	that.isRoot = function() {
		return state.parent == null;
	}
	
	that.treeOrderNext = function () {
		if (state.firstChild) state.firstChild;
		if (state.nextSibling) state.nextSibling;
		
		var p = state.parent;
		while (p) {
			if (p.nextSibling()) {
				return p.nextSibling();
			}
			p = p.parent();
		}
		
		return null;
	}

	that.treeOrderPrevious = function() {
		var p;
		
		if (state.previousSibling) {
			return state.previousSibling.leftmostDescendantOrSelf();
		} else {
			p = state.parent;
			
			if (p == null || p.isRoot()) {
				return null;
			} else {
				return p;
			}
		}
	}
	
	that.leftmostDescendantOrSelf = function() {
		if (state.lastChild) return state.lastChild.leftmostDescendantOrSelf();
		return this;
	}
	
	that.rightmostDescendantOrSelf = function() {
		if (state.firstChild) return state.firstChild.rightmostDescendantOrSelf();
		return this;
	}
	
	return that;
}
*/