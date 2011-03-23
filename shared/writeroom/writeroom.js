define("writeroom/base", function(require, exports, module) {
	
	if( typeof(nativeDocument) !== "undefined" ) {
		console.log = function(text) {
			nativeDocument.javascriptConsoleLog_(text);
		}
	}
	
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
		return function(e) { 
			var delta = e.data,
				range = delta.range,
				beforeStart = exports.movePointLeftInline(editor, range.start),
				afterEnd = exports.movePointLeftInline(editor, range.end),
				beforeChar, afterChar;
			
			console.log(delta);
			var text = "";
			if( delta.action === "insertText" || delta.action === "removeText" )
				text = delta.text;
			else if ( delta.action === "insertLines" || delta.action === "removeLines" ) {
				var res = 0;
				for( var i = 0; i < delta.lines.length; i++ ) {
					res += exports.countWords(delta.lines[i]).words;
				}
				if( delta.action === "removeLines" ) updateFn(-res);
				else updateFn(res);
				return;
			}
			var newlineChar = editor.session.doc.getNewLineCharacter();
			
			if( delta.action === "removeText" && (delta.text.charCodeAt(0) === 13 || delta.text === newlineChar) ) {
				afterEnd = range.start;
				if( afterEnd === null || beforeStart === null ) return; // deleted an empty line
				beforeChar = editor.session.getLine(beforeStart.row).charAt(beforeStart.column);
				afterChar = editor.session.getLine(afterEnd.row).charAt(afterEnd.column);
				if( afterChar === "" || beforeChar === "" ) return; // newly created line
				if( beforeChar.match(/\s/) === null && afterChar.match(/\s/) === null ) {
					updateFn(-1);
				}
				return;
			}
			
			if( delta.action === "insertText" && (delta.text.charCodeAt(0) === 13 || delta.text === newlineChar) ) {
				if( beforeStart === null ) return;
				beforeChar = editor.session.getLine(beforeStart.row).charAt(beforeStart.column);
				afterChar = editor.session.getLine(range.end.row).charAt(range.end.column);
				if( afterChar === "" || beforeChar === "" ) return; // newly created line
				if( beforeChar.match(/\s/) === null && afterChar.match(/\s/) === null ) {
					updateFn(1);
				}
				return;
			}
			
			
			var textstats = exports.countWords(text);
			
			if( delta.action === "insertText" ){
				var appendingToWord = false, prependingToWord = false, breakingWord = false;
				
				if( beforeStart == null && afterEnd == null) {
					updateFn(textstats.words);
					return;
				}
				
				if( beforeStart !== null ) {
					var beforeChar = editor.session.getLine(beforeStart.row).charAt(beforeStart.column);
					appendingToWord = beforeChar.length > 0 && beforeChar.match(/\s/) === null && textstats.startsWithAWord;
				}
				
				if(afterEnd !== null){
					var afterChar = editor.session.getLine(range.end.row).charAt(range.end.column);
					prependingToWord = afterChar.length > 0 && afterChar.match(/\s/) === null && textstats.endsWithAWord;
				}
				
				breakingWord = beforeStart && afterEnd  && 
								beforeChar.length > 0 && beforeChar.match(/\s/) === null && 
								afterChar.length > 0 && afterChar.match(/\s/) === null;
				
				if( !appendingToWord && !prependingToWord ) {
					updateFn(textstats.words + (breakingWord? 1:0));
					return;
				}
				
				if( appendingToWord && prependingToWord ) {
					if( textstats.words === 0 ) updateFn(1);
					else updateFn(textstats.words-1);
					return;
				}
				
				if( appendingToWord || prependingToWord ) {
					if( textstats.words !== 0 ) 
						updateFn(textstats.words - 1);
					return;
				}
			} 
			
			if( delta.action === "removeText" ) {
				appendingToWord = false; prependingToWord = false; breakingWord = false;
				
				
				if( beforeStart == null && afterEnd == null) {
					updateFn(-textstats.words);
					return;
				}
				
				if( beforeStart !== null ) {
					var beforeChar = editor.session.getLine(beforeStart.row).charAt(beforeStart.column);
					appendingToWord = beforeChar.length > 0 && beforeChar.match(/\s/) === null && textstats.startsWithAWord;
				}
				
				if(afterEnd !== null){
					var afterChar = editor.session.getLine(afterEnd.row).charAt(range.start.column);
					prependingToWord = afterChar.length > 0 && afterChar.match(/\s/) === null && textstats.endsWithAWord;
				}
				
				var joiningWord = beforeStart && afterEnd  && 
					beforeChar.length > 0 && beforeChar.match(/\s/) === null && 
					afterChar.length > 0 && afterChar.match(/\s/) === null;
				
				if( !appendingToWord && !prependingToWord ) {
					updateFn(-(textstats.words + (joiningWord? 1:0)));
					return;
				}
				
				if( appendingToWord && prependingToWord ) {
					if( textstats.words === 0 ) updateFn(-1);
					else updateFn(-(textstats.words-1));
					return;
				}
				
				if( appendingToWord || prependingToWord ) {
					if( textstats.words !== 0 ) 
						updateFn(-(textstats.words - 1));
					return;
				}
			}
			
		}
	};
	
	exports.countWords = function(text) {
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
	exports.movePointLeft = function(editor, pos){
		var newPos;
		if(pos.column === 0) { 
			if( pos.row > 0 ){
				newPos = { row: pos.row-1, column: editor.session.doc.getLine(pos.row-1).length };
			} else { 
				newPos = null;	// we're at document start, can't move left
			}
		} else {
			var tabSize = editor.session.getTabSize();
            if (editor.session.isTabStop(pos) && editor.session.doc.getLine(pos.row).slice(pos.column-tabSize, pos.column).split(" ").length-1 == tabSize)
                newPos = {row: pos.row, column: pos.column-tabSize};
            else
                newPos = {row: pos.row, column: pos.column-1};
		}
		
		return newPos;
	};
	
	exports.movePointLeftInline = function(editor, pos){
		var newPos;
		if(pos.column === 0) { 
			newPos = null;	// we're at document start, can't move left
		} else {
			var tabSize = editor.session.getTabSize();
            if (editor.session.isTabStop(pos) && editor.session.doc.getLine(pos.row).slice(pos.column-tabSize, pos.column).split(" ").length-1 == tabSize)
                newPos = {row: pos.row, column: pos.column-tabSize};
            else
                newPos = {row: pos.row, column: pos.column-1};
		}
		return newPos;
	};
	
	exports.canMoveLeft = function(editor, pos) {
		return pos.column === 0 && pos.row === 0;
	};
	
	exports.canMoveRight = function(editor, pos) {
		if( pos.row === editor.session.doc.getLength() - 1 ) {
			return pos.column !== editor.session.doc.getLine(pos.row).length;
		} 
		return true;
	};
	
	/*
	 *	Taken from selection.moveCursorRight 
	 */
	exports.movePointRight = function(editor, pos) {
		var newPos;
		if (pos.column == editor.session.doc.getLine(pos.row).length) {
            if (pos.row < editor.session.doc.getLength() - 1) {
                newPos = {row: pos.row+1, column: 0};
            } else {
            	newPos = null;
            }
        }
        else {
            var tabSize = editor.session.getTabSize();
            if (editor.session.isTabStop(pos) && editor.session.doc.getLine(pos.row).slice(pos.column, pos.column+tabSize).split(" ").length-1 == tabSize)
                newPos= {row: pos.row, column: pos.column+tabSize};
            else
            	newPos = {row: pos.row, column: pos.column+1};
        }
		return newPos;
	};

	exports.movePointRightInline = function(editor, pos) {
		var newPos;
		if (pos.column == editor.session.doc.getLine(pos.row).length) {
        	newPos = null;
        }
        else {
            var tabSize = editor.session.getTabSize();
            if (editor.session.isTabStop(pos) && editor.session.doc.getLine(pos.row).slice(pos.column, pos.column+tabSize).split(" ").length-1 == tabSize)
                newPos= {row: pos.row, column: pos.column+tabSize};
            else
            	newPos = {row: pos.row, column: pos.column+1};
        }
		return newPos;
	};

});
