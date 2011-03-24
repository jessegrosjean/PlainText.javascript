define("writeroom/editor", function(require, exports, module) {
		
	var oop = require("pilot/oop");
	var canon = require("pilot/canon");
	var Editor = require("ace/editor").Editor;
	var Range = require("ace/range").Range;
	require("writeroom/commands");
    
	   
	var WrEditor = function WrEditor() {
		Editor.prototype.constructor.apply(this, arguments);
	};
	
	oop.inherits(WrEditor, Editor);

	(function() {

		this.toggleSpanWithBoundary = function(boundary) {
			if (this.$readOnly)
				return;
			
			var curSelectionRange = this.getSelectionRange();
			
			if( this.session.getSelection().isEmpty() ) {
				var curPos = this.getCursorPosition();
				var ins = boundary+" "+boundary;
				this.session.insert(curPos, ins);
				var range = new Range(curPos.row, curPos.column+boundary.length, 
						curPos.row, curPos.column+boundary.length+1);
				this.session.selection.setSelectionRange(range, false);
				return;
			}
			
			var len = boundary.length; 	 
			var selectedText = this.getCopyText();
			var range = this.getSelectionRange();
			var newRange = range;
			
			if( selectedText.substr(0, len) === boundary && 
					selectedText.substr(-len) === boundary ) {
				// removing
				selectedText = selectedText.substr(len, selectedText.length-(len*2));
				newRange = new Range(range.start.row, range.start.column, 
						range.end.row, range.end.column-boundary.length*2);
				this.session.replace(range, selectedText);
			} else {
				// adding
				selectedText = boundary + selectedText + boundary;
				this.session.replace(range, selectedText);
				newRange = new Range(range.start.row, range.start.column,
						range.end.row, range.end.column+boundary.length*2);
			}

			this.session.selection.setSelectionRange(newRange, false);

		};
	 
		this.toggleStrong = function(options) {
			this.toggleSpanWithBoundary("**");
		};

		this.toggleEmphasize = function(options) {
			this.toggleSpanWithBoundary("_");
		};

		this.toggleDelete = function(options) {
			this.toggleSpanWithBoundary("~");
		};

	}).call(WrEditor.prototype);
	
	
	exports.WrEditor = WrEditor;
});