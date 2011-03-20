define("writeroom/undomanager", function(require, exports, module) {
	
	var oop = require("pilot/oop");
	var UndoManager = require("ace/undomanager").UndoManager;
	var EventEmitter = require('pilot/event_emitter').EventEmitter;
	
	var WrUndoManager = function WrUndoManager() {
		UndoManager.prototype.constructor.apply(this, arguments);
	};
	
	oop.inherits(WrUndoManager, UndoManager);
	
	(function() {
		
		oop.implement(this, EventEmitter);
		
		//
		// UndoManager overrides
		//
		
		this.execute = function(options) {
			UndoManager.prototype.execute.apply(this, arguments);
			this.$redoStack = [];
			this._dispatchEvent("didPushDeltas");
		};

		this.undo = function() {
			if (this.hasUndo()) {
				UndoManager.prototype.undo.apply(this, arguments);
				this._dispatchEvent("didUndoDeltas");
			}
		};
		
		this.redo = function() {
			if (this.hasRedo()) {
				UndoManager.prototype.redo.apply(this, arguments);
				this._dispatchEvent("didRedoDeltas");
			}
		};
				
	}).call(WrUndoManager.prototype);
	
	
	exports.WrUndoManager = WrUndoManager;
});