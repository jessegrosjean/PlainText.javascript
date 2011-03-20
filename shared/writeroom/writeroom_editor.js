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

		this.toggleBold = function(options) {
			console.log("toggleBold");
		};

		this.toggleItalic = function(options) {
			console.log("toggleItalic");
		};

		this.selectAll = function() {
		};

	}).call(WrEditor.prototype);
	
	
	exports.WrEditor = WrEditor;
});