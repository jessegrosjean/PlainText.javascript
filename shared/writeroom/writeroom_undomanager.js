define("writeroom/undomanager", function(require, exports, module) {
	
	var oop = require("pilot/oop");
	var UndoManager = require("ace/undomanager").UndoManager;
	
	var WrUndoManager = function WrUndoManager() {
		UndoManager.prototype.constructor.apply(this, arguments);
	};
	
	oop.inherits(WrUndoManager, UndoManager);
	
	(function() {
		
		this.execute = function(options) {
			UndoManager.prototype.execute.apply(this, arguments);
		};
				
	}).call(WrUndoManager.prototype);
	
	
	exports.WrUndoManager = WrUndoManager;
});