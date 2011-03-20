define("writeroom/editor", function(require, exports, module) {
		
	var oop = require("pilot/oop");
	var canon = require("pilot/canon");
	var Editor = require("ace/editor").Editor;
	require("writeroom/commands");
    
	   
	var WrEditor = function WrEditor() {
		Editor.prototype.constructor.apply(this, arguments);
	};
	
	oop.inherits(WrEditor, Editor);

	(function() {

		this.toggleSpanWithBoundary = function(boundary) {
			if (this.$readOnly)
				return;
			
			if( this.session.getSelection().isEmpty() ) {
				var pos = this.getCursorPosition();
				var range = this.session.getWordRange(pos.row, pos.column);
				this.session.getSelection().setSelectionRange(range, false);
			}
			
			var len = boundary.length; 	 
			var selectedText = this.getCopyText();
			
			if( selectedText.substr(0, len) === boundary && 
					selectedText.substr(-len) === boundary ) {
				selectedText = selectedText.substr(len, selectedText.length-(len*2));
				this.session.replace(this.getSelectionRange(), selectedText);
			} else {
				selectedText = boundary + selectedText + boundary;
				this.session.replace(this.getSelectionRange(), selectedText);
			}
		};
	 
		this.toggleBold = function(options) {
			this.toggleSpanWithBoundary("**");
		};

		this.toggleItalic = function(options) {
			this.toggleSpanWithBoundary("_");
		};

	}).call(WrEditor.prototype);
	
	
	exports.WrEditor = WrEditor;
});