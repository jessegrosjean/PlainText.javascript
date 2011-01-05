// parse lines.
// parse section types
// parse tags, etc.

var parser = function(state) {
	var that = {}

	that.parseSectionsFromText = function(text) {
		var lines = text.split('\n');
		var sections = [];
		
		lines.forEach(function(line) {
			sections.push(document.createSectionElement(line));
		});
		
		return sections;
	}
	
	that.exportSectionsToText = function(sections) {
		var lines = [];
		var length = sections.length;
		var i = 0;

		while (i < length) {
			sections[i].sectionDescendantsWithSelf().forEach(function(descendant) {
				lines.push(descendant.sectionTextContent());
			});
			i++;
		}
		
		return lines.join('\n');
	}
	
	return that;
}