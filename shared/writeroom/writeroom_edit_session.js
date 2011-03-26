define("writeroom/edit_session", function(require, exports, module) {

	var oop = require("pilot/oop");
	var EditSession = require("ace/edit_session").EditSession;
	var Wr = require("writeroom/base");

	var WrEditSession = function WrEditSession(text,mode) {
		EditSession.prototype.constructor.apply(this, arguments);
		this.$trailLines = this.$leadLines = 0;
		this.$sessionWordCount = 0;
		this.$wordCount = 0;

		/*
		this.$sessionStartDocumentState = text;
		this.$sessionStartTime = 0;
		this.$sessionTargetWordCount = null;
		this.$sessionTargetWritingTime = null;
		 */
		
		var lines = this.doc.$lines;
		for( var i = 0; i < lines.length; i++ ) {
			this.$wordCount += Wr.countWords(lines[i]).words;
		}
		this._dispatchEvent("wordCountUpdated", this.$getWordCountInfo(this.$wordCount));
	};

	oop.inherits(WrEditSession, EditSession);

	(function() {
		
		this.setTrailLines = function setTrailLines(numLines) { 
			this.$trailLines = numLines;
		};

		this.setLeadLines = function setLeadLines(numLines) {
			this.$leadLines = numLines;
		};

		this.getScreenLength = function getScreenLength() {
			var screenRows = WrEditSession.super_.getScreenLength.call(this);
			return screenRows + this.$trailLines;
		};

		this.setValue = function setValue(text) {
			EditSession.prototype.setValue.apply(this, arguments);
			this.$sessionWordCount = 0;
			this._dispatchEvent("wordCountUpdated", this.$getWordCountInfo(0));
		}

		this.updateWordCount = function updateWordCount(changeBy) {
			if( changeBy === 0 ) return;
			this.$wordCount += changeBy;
			this.$sessionWordCount += changeBy;
			this._dispatchEvent("wordCountUpdated", this.$getWordCountInfo(changeBy));
		};
		
		this.$getWordCountInfo = function $getWordCountInfo(changeBy) {
			var selection = this.getSelection();
			var selectionWordCount = 0;
			if (!selection.isEmpty()) {
				var range = selection.getRange();
				var text = this.getTextRange(range);
				selectionWordCount = Wr.countWords(text);
			}
			return {"total":this.$wordCount, "session":this.$sessionWordCount, "change":changeBy, "selection":selectionWordCount};
		};



		this.onChange = function(e) {
			var delta = e.data;
			this.$modified = true;
			if (!this.$fromUndo && this.$undoManager && !delta.ignore) {
				this.$deltas.push(delta);
				this.$informUndoManager.schedule();
			}

			this.$updateWrapDataOnChange(e);
			this._dispatchEvent("change", e);
			this.$detectWordCountChanges(e, this.updateWordCount.bind(this));
		};

		this.$detectWordCountChanges = function $detectWordCountChanges(e, updateFn) {
			var delta = e.data,
				range = delta.range,
				beforeStart = Wr.movePointLeftInline(this, range.start),
				afterEnd = Wr.movePointLeftInline(this, range.end),
				beforeChar, afterChar;

			var text = "";
			if( delta.action === "insertText" || delta.action === "removeText" )
				text = delta.text;
			else if ( delta.action === "insertLines" || delta.action === "removeLines" ) {
				var res = 0;
				for( var i = 0; i < delta.lines.length; i++ ) {
					res += Wr.countWords(delta.lines[i]).words;
				}
				if( delta.action === "removeLines" ) updateFn(-res);
				else updateFn(res);
				return;
			}
			var newlineChar = this.doc.getNewLineCharacter();

			if( delta.action === "removeText" && (delta.text.charCodeAt(0) === 13 || delta.text === newlineChar) ) {
				afterEnd = range.start;
				if( afterEnd === null || beforeStart === null ) return; // deleted an empty line
				beforeChar = this.getLine(beforeStart.row).charAt(beforeStart.column);
				afterChar = this.getLine(afterEnd.row).charAt(afterEnd.column);
				if( afterChar === "" || beforeChar === "" ) return; // newly created line
				if( beforeChar.match(/\s/) === null && afterChar.match(/\s/) === null ) {
					updateFn(-1);
				}
				return;
			}

			if( delta.action === "insertText" && (delta.text.charCodeAt(0) === 13 || delta.text === newlineChar) ) {
				if( beforeStart === null ) return;
				beforeChar = this.getLine(beforeStart.row).charAt(beforeStart.column);
				afterChar = this.getLine(range.end.row).charAt(range.end.column);
				if( afterChar === "" || beforeChar === "" ) return; // newly created line
				if( beforeChar.match(/\s/) === null && afterChar.match(/\s/) === null ) {
					updateFn(1);
				}
				return;
			}


			var textstats = Wr.countWords(text);

			if( delta.action === "insertText" ){
				var appendingToWord = false, prependingToWord = false, breakingWord = false;

				if( beforeStart == null && afterEnd == null) {
					updateFn(textstats.words);
					return;
				}

				if( beforeStart !== null ) {
					var beforeChar = this.getLine(beforeStart.row).charAt(beforeStart.column);
					appendingToWord = beforeChar.length > 0 && beforeChar.match(/\s/) === null && textstats.startsWithAWord;
				}

				if(afterEnd !== null){
					var afterChar = this.getLine(range.end.row).charAt(range.end.column);
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
					var beforeChar = this.getLine(beforeStart.row).charAt(beforeStart.column);
					appendingToWord = beforeChar.length > 0 && beforeChar.match(/\s/) === null && textstats.startsWithAWord;
				}

				if(afterEnd !== null){
					var afterChar = this.getLine(afterEnd.row).charAt(range.start.column);
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
		};




	}).call(WrEditSession.prototype);




	exports.WrEditSession = WrEditSession;
});