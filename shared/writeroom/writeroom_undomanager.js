define("writeroom/undomanager", function(require, exports, module) {
	
	var oop = require("pilot/oop");
	var UndoManager = require("ace/undomanager").UndoManager;
	
	var WrUndoManager = function WrUndoManager() {
		UndoManager.prototype.constructor.apply(this, arguments);
		self.$changeCount = 0;
	};
	
	oop.inherits(WrUndoManager, UndoManager);
	
	(function() {

		this.CHANGE_DONE = 0;
		this.CHANGE_UNDONE = 1;
		this.CHANGE_CLEARED = 2;
		this.CHANGE_REDONE = 5;
		
		this.hasChanges = function() {
			return self.$changeCount != 0;
		}

		this.updateChangeCount = function(changeType) {
			console.log(changeType);
			
			switch(changeType) {
				case this.CHANGE_DONE:
					self.$changeCount++;
					break;
				case this.CHANGE_UNDONE:
					self.$changeCount--;
					break;
				case this.CHANGE_REDONE:
					self.$changeCount++;
					break;
				case this.CHANGE_CLEARED:
					self.$changeCount = 0;
					break;
			}
		}
		
		this.execute = function(options) {
			UndoManager.prototype.execute.apply(this, arguments);
			this.$redoStack = [];
			this.updateChangeCount(this.CHANGE_DONE);
		};

		this.undo = function() {
			if (this.hasUndo()) {
				UndoManager.prototype.undo.apply(this, arguments);
				this.updateChangeCount(this.CHANGE_UNDONE);
			}
		};
		
		this.redo = function() {
			if (this.hasRedo()) {
				UndoManager.prototype.redo.apply(this, arguments);
				this.updateChangeCount(this.CHANGE_REDONE);
			}
		};
				
	}).call(WrUndoManager.prototype);
	
	
	exports.WrUndoManager = WrUndoManager;
});