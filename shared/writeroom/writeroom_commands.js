
define("writeroom/commands", function(require, exports, module) {
	
	var lang = require("pilot/lang");
	var canon = require("pilot/canon");
	
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

});

