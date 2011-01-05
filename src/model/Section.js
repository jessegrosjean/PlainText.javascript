'use strict';

var SectionTextContent

var Section = function(aLine) {
	this._type = null;
	this._textContent = null;
	this._parent = null;
	this._previousSibling = null;
	this._nextSibling = null;
	this._firstChild = null;
	this._lastChild = null;
	this._firstTag = null;
	this._lastTag = null;
	this._sectionLI = document.createElement('li');
	this._sectionLI.appendChild(document.createElement('div'));
	this.setTextContent(aLine);
};

// ----------------------------------------------------------------
// Attributes
// ----------------------------------------------------------------

Section.prototype.type = function() {
	return this._type;
}

Section.prototype.textContent = function() {
	return this._textContent;
}

Section.prototype.setTextContent = function(aLine) {
	aLine =  aLine || '';
	
	if (aLine.indexOf('\n') != -1)
		throw new Error("Text content must not have newlines");
	
	this._textContent = aLine;

	// parse new line and update type, level, tags, contentDIV.
	this.sectionContentDIV().textContent = aLine;
}

Section.prototype.toString = function() {
	return "Section(" + this._textContent + ")";
}

// ----------------------------------------------------------------
// Tags
// ----------------------------------------------------------------

Section.prototype.hasTags = function() {
	return this._firstTag != null;
}

Section.prototype.firstTag = function() {
	return this._firstTag;
}

Section.prototype.lastTag = function() {
	return this._lastTag;
}

// ----------------------------------------------------------------
// Tree Structure
// ----------------------------------------------------------------

Section.prototype.parent = function() {
	return this._parent;
}

Section.prototype.previousSibling = function() {
	return this._previousSibling;
}

Section.prototype.nextSibling = function() {
	return this._nextSibling;
}

Section.prototype.hasChildren = function() {
	return this._firstChild != null;
}

Section.prototype.firstChild = function() {
	return this._firstChild;
}

Section.prototype.lastChild = function() {
	return this._lastChild;
}

Section.prototype.appendChild = function(aChild) {
	this.insertChildBefore(aChild, null);
}

Section.prototype.removeChild = function(aChild) {
	var prev = aChild._previousSibling;
	var next = aChild._nextSibling;
	var firstChild = this._firstChild;
	var lastChild = this._lastChild;
	var childLI = aChild.sectionLI();
	var parentUL = childLI.parent;
	
	if (prev !== null) prev._nextSibling = next;
	if (next !== null) next._previousSibling = prev;
	
	if (firstChild === aChild) this._firstChild = prev || next;
	if (lastChild === aChild) this._lastChild = next || prev;
		
	aChild._parent = null;
	aChild._previousSibling = null;
	aChild._nextSibling = null;

	if (parentUL) {
		parentUL.removeChild(childLI);
		if (!parentUL.hasChildNodes()) {
			parentUL.parent.removeChild(parentUL);
		}
	}
}

Section.prototype.insertChildBefore = function(aChild, aSibling) {
	var oldParent = aChild._parent;
	var firstChild = this._firstChild;
	var lastChild = this._lastChild;
	var prev = aSibling === null ? lastChild : aSibling._previousSibling;
	var next = aSibling;
	var childrenUL = this.sectionChildrenUL(true);
	var childLI = aChild.sectionLI();
	var siblingLI = aSibling === null ? null : aSibling.sectionLI();
	
	if (oldParent !== null) {
		oldParent.removeChild(aChild);
	}

	if (firstChild === aSibling) this._firstChild = aChild;
	if (aSibling === null) this._lastChild = aChild;
	
	if (prev !== null) prev._nextSibling = aChild;
	aChild._previousSibling = prev;
	aChild._nextSibling = next;
	if (next !== null) next._previousSibling = aChild;

	aChild._parent = this;
		
	if (siblingLI !== null) {
		childrenUL.appendChild(childLI);
	} else {
		childrenUL.insertBefore(childLI, siblingLI);
	}
}

Section.prototype.isRoot = function() {
	return this._parent === null;
}

Section.prototype.treeOrderNext = function () {
	if (this._firstChild !== null) return this._firstChild;
	if (this._nextSibling !== null) return this._nextSibling;
	
	var p = this._parent;
	while (p !== null) {
		if (p._nextSibling !== null) {
			return p._nextSibling;
		}
		p = p._parent;
	}
	
	return null;
}

Section.prototype.treeOrderPrevious = function() {
	var p = null;
	
	if (this._previousSibling !== null) {
		return this._previousSibling.leftmostDescendantOrSelf();
	} else {
		p = this._parent;
		
		if (p === null || p.isRoot()) {
			return null;
		} else {
			return p;
		}
	}
}

Section.prototype.leftmostDescendantOrSelf = function() {
	if (this._lastChild !== null) 
		return this._lastChild.leftmostDescendantOrSelf();
	return this;
}

Section.prototype.rightmostDescendantOrSelf = function() {
	if (this._firstChild !== null)
		return this._firstChild.rightmostDescendantOrSelf();
	return this;
}

Section.prototype.descendants = function() {
	var end = this.nextSibling();
	var s = this.treeOrderNext();
	var descendants = [];
	
	while (s !== null && s !== end) {
		descendants.push(s);
		s = s.treeOrderNext();
	}
		
	return descendants;
}

Section.prototype.descendantsWithSelf = function() {
	return [this].concat(this.descendants());
}

// ----------------------------------------------------------------
// Section DOM
// ----------------------------------------------------------------

Section.prototype.sectionLI = function() {
	return this._sectionLI;
}

Section.prototype.sectionContentDIV = function() {
	return this._sectionLI.firstChild;
}

Section.prototype.sectionChildrenUL = function(createIfNeeded) {
	var sectionLI = this._sectionLI;
	var contentDIV = sectionLI.firstChild;
	var maybeChildrenUL = sectionLI.lastChild;
	
	if (contentDIV !== maybeChildrenUL) {
		return maybeChildrenUL;
	} else if (createIfNeeded) {
		maybeChildrenUL = document.createElement('ul')
		sectionLI.appendChild(maybeChildrenUL);
		return maybeChildrenUL;
	}
	
	return null;
}


















/*







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
	if (tagsSPAN != null && tagsSPAN.className == 'tags') {
		return tagsSPAN;
	} else if (createIfNeeded) {
		tagsSPAN = document.createElement('span');
		tagsSPAN.className = 'tags';
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
	//var that = document.createElement('li');
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