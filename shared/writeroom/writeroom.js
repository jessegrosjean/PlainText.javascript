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
	
	exports.getWordCountListener = function(editor, updateFn) {
		var lastWasSeperator = false;
		return function(e) { 
			var delta = e.data;
			var wordDelta = 0;
			var wordArray = [];
			if( delta.action === "insertText" ) {
				if( delta.text.match(/^(\W|\s)+$/) !== null  ) {
					lastWasSeperator = true;
				} else {
					if( lastWasSeperator ) {
						wordDelta = 
					}
					lastWasSeperator = false;
				}
				if( wordDelta > 0 ) wordDelta -= 1;
				updateFn(wordDelta);
			} else if( delta.action === "removeText" ) {
				wordArray = delta.text.replace(/\W+/g, " ").split(" ");
				for( var i = 0; i < wordArray.length; i++ ) {
					if( wordArray[i] !== "" ) {
						wordDelta += 1;
					}
				}
				if( wordDelta > 0 ) wordDelta -= 1;
				updateFn(-wordDelta)
			}
		}
		
	}

});
