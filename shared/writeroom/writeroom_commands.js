
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
		name: "strong",
		bindKey: bindKey("Ctrl-B", "Command-B"),
		exec: function(env, args, request) { env.editor.toggleStrong(); }
	});
   
	canon.addCommand({
		name: "emphasize",
		bindKey: bindKey("Ctrl-I", "Command-I"),
		exec: function(env, args, request) { env.editor.toggleEmphasize(); }
	});

	canon.addCommand({
		name: "delete",
		bindKey: bindKey("Ctrl-D", "Command-D"),
		exec: function(env, args, request) { env.editor.toggleDelete(); }
	});

});

