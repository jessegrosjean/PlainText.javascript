// has
	// document
	// text input
// key binding
	
var editor = function(state) {
	var that = document.createElement("ul");
	
	// Init
	that.className = 'editor';
	that.parser = parser({});
	that.undoManager = null;
	that.keyBindings = null;
	that.textInput = null;
	that.selectionRange = null;
	that.selectionLayer = null;
	that.gutterLayer = null;
	that.scrollerLayer = null;
	
	var rootSection = document.createSectionElement('');
	rootSection.className = "root";
	that.appendChild(rootSection);
	state.rootSection = rootSection;
	
	// Attributes

	that.rootSection = function() {
		return state.rootSection;
	}

	that.sectionTextContent = function() {
		return this.parser.exportSectionsToText(this.rootSection().sectionChildren());
	}

	that.setSectionTextContent = function(newText) {
		var rootSection;
		var newRootSections;
		var newRootSectionsLength;
		var i = 0;
		
		rootSection = this.rootSection();
		rootSection.innerHTML = '';
		newRootSections = this.parser.parseSectionsFromText(newText);
		newRootSectionsLength = newRootSections.length;
		
		while (i < newRootSectionsLength) {
			rootSection.appendSectionChild(newRootSections[i]);
			i++;
		}
	}
	
	// Commands

	that.setSectionTextContent('');

	return that;
}