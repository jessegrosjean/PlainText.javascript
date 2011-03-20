define("writeroom/editor", function(require, exports, module) {
		
	var oop = require("pilot/oop");
	var canon = require("pilot/canon");
	var Editor = require("ace/editor").Editor;
   
	function bindKey(win, mac) {
		return {
			win: win,
			mac: mac,
			sender: "editor"
		};
	}
   
	canon.addCommand({
		name: "bold",
		bindKey: bindKey("Ctrl-B", "Command-B"),
		exec: function(env, args, request) { env.editor.toggleBold(); }
	});
   
	canon.addCommand({
		name: "italic",
		bindKey: bindKey("Ctrl-I", "Command-I"),
		exec: function(env, args, request) { env.editor.toggleItalic(); }
	});
   
	   
	   
	var WrEditor = function WrEditor() {
		Editor.prototype.constructor.apply(this, arguments);
	};
	
	oop.inherits(WrEditor, Editor);

	(function() {

		this.toggleSpanWithBoundary = function(boundary) {
			if (this.$readOnly)
				return;
	 
			var selectedText = this.getCopyText();
			selectedText = boundary + selectedText + boundary;
			this.session.replace(this.getSelectionRange(), selectedText);
		}	 
	 
		this.toggleBold = function(options) {
			this.toggleSpanWithBoundary("**");
		};

		this.toggleItalic = function(options) {
			this.toggleSpanWithBoundary("_");
		};

	}).call(WrEditor.prototype);
	
	
	exports.WrEditor = WrEditor;
});