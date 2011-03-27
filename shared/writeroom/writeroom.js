define("writeroom/base", function(require, exports, module) {
	
	if( typeof(nativeDocument) !== "undefined" ) {
		console.log = function(text) {
			nativeDocument.javascriptConsoleLog_(text);
		};
	}
	
	exports.setupUndoNativeBindings = function setupUnDoNativeBindings(undoManager) {
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
	};
	
	exports.countWords = function countWords(text) {
		var sepRe = /\s/g;
		text = text.replace(sepRe, ' ');
		var words = text.split(' ');
		var count = 0;
		for( var i = 0; i < words.length; i++ ) {
			if( words[i].length > 0 )	count++;
		}
		
		return {
			"words": count, 
			"startsWithAWord": words[0].length > 0,
			"endsWithAWord": words[words.length-1].length > 0
		};
	};
	
	/* Taken from selection.moveCursorLeft
	 * 
	 * This only moves the position instead of the cursor
	 * 
	 */
	exports.movePointLeft = function(session, pos){
		var newPos;
		if(pos.column === 0) { 
			if( pos.row > 0 ){
				newPos = { row: pos.row-1, column: session.doc.getLine(pos.row-1).length };
			} else { 
				newPos = null;	// we're at document start, can't move left
			}
		} else {
			var tabSize = session.getTabSize();
            if (session.isTabStop(pos) && session.doc.getLine(pos.row).slice(pos.column-tabSize, pos.column).split(" ").length-1 == tabSize)
                newPos = {row: pos.row, column: pos.column-tabSize};
            else
                newPos = {row: pos.row, column: pos.column-1};
		}
		
		return newPos;
	};
	
	exports.movePointLeftInline = function(session, pos){
		var newPos;
		if(pos.column === 0) { 
			newPos = null;	// we're at document start, can't move left
		} else {
			var tabSize = session.getTabSize();
            if (session.isTabStop(pos) && session.doc.getLine(pos.row).slice(pos.column-tabSize, pos.column).split(" ").length-1 == tabSize)
                newPos = {row: pos.row, column: pos.column-tabSize};
            else
                newPos = {row: pos.row, column: pos.column-1};
		}
		return newPos;
	};
	
	exports.canMoveLeft = function(session, pos) {
		return pos.column === 0 && pos.row === 0;
	};
	
	exports.canMoveRight = function(session, pos) {
		if( pos.row === session.doc.getLength() - 1 ) {
			return pos.column !== session.doc.getLine(pos.row).length;
		} 
		return true;
	};
	
	/*
	 *	Taken from selection.moveCursorRight 
	 */
	exports.movePointRight = function(session, pos) {
		var newPos;
		if (pos.column == session.doc.getLine(pos.row).length) {
            if (pos.row < session.doc.getLength() - 1) {
                newPos = {row: pos.row+1, column: 0};
            } else {
            	newPos = null;
            }
        }
        else {
            var tabSize = session.getTabSize();
            if (session.isTabStop(pos) && session.doc.getLine(pos.row).slice(pos.column, pos.column+tabSize).split(" ").length-1 == tabSize)
                newPos= {row: pos.row, column: pos.column+tabSize};
            else
            	newPos = {row: pos.row, column: pos.column+1};
        }
		return newPos;
	};

	exports.movePointRightInline = function(session, pos) {
		var newPos;
		if (pos.column == session.doc.getLine(pos.row).length) {
        	newPos = null;
        }
        else {
            var tabSize = session.getTabSize();
            if (session.isTabStop(pos) && session.doc.getLine(pos.row).slice(pos.column, pos.column+tabSize).split(" ").length-1 == tabSize)
                newPos= {row: pos.row, column: pos.column+tabSize};
            else
            	newPos = {row: pos.row, column: pos.column+1};
        }
		return newPos;
	};

});
