var TagValidNameRegex = /\w*/;
var TagValidValueRegex = /(?:[^\\)]*)/;

var Tag = function() {
	this._section = null;
	this._name = '';
	this._value = '';
	this._previousTag = null;
	this._nextTag = null;
};

// ----------------------------------------------------------------
// Attributes
// ----------------------------------------------------------------

Tag.prototype.section = function() {
	return this._section;
}

Tag.prototype.name = function() {
	return this._name;
}

Tag.prototype.setName = function(aName) {
	if (TagValidNameRegex.exec(aName) == aName) {
		this._name = aName;
	} else {
		throw new Error('Invalid tag name');
	}
}

Tag.prototype.value = function() {
	return this._value;
}

Tag.prototype.setValue = function(aValue) {
	if (TagValidValueRegex.exec(aValue) == aValue) {
		this._value = aValue;
	} else {
		throw new Error('Invalid tag value');
	}
}

Tag.prototype.nextTag = function() {
	return this._nextTag;
}

Tag.prototype.previousTag = function() {
	return this._previousTag;
}

Tag.prototype.toString = function() {
	var name = this._name;
	var value = this._value;
	if (value.length > 0) {
		return '@' + name + '(' + value + ')';
	} else {
		return '@' + name;
	}
}