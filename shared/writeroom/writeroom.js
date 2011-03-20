define("writeroom/base", function(require, exports, module) {
	
	exports.setupUndoNativeBindings = function(undoManager) {
		undoManager.on("didPushDeltas", function(e) {
			if( typeof(nativeDocument) !== "undefined" )
				nativeDocument.javascriptUpdateChangeCount_(0 /* NSChangeDone */);
		});

		undoManager.on("didUndoDeltas", function(e) {
			if( typeof(nativeDocument) !== "undefined" )
				nativeDocument.javascriptUpdateChangeCount_(1 /* NSChangeUndone */);
		});

		undoManager.on("didRedoDeltas", function(e) {
			if( typeof(nativeDocument) !== "undefined" )
				nativeDocument.javascriptUpdateChangeCount_(5 /* NSChangeRedone */);
		});	
	}

});
