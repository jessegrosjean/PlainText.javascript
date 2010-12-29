HTMLDocument.prototype.createSectionElement = function(text) {
	var section = this.createElement('li');
	var textContentDIV = this.createElement('div');
	textContentDIV.textContent = text || '';
	section.appendChild(textContentDIV);
	return section;
};