define("writeroom/typewriter_session", function(require, exports, module) {

	var oop = require("pilot/oop");
	var EditSession = require("ace/edit_session").EditSession;

	var TWSession = function TWSession(text,mode) {
		// Calling the EditSession constructor on our object, so we look like EditSession
		EditSession.prototype.constructor.apply(this, arguments);
		this.$emptyTrail = this.$emptyHead = 0;
	};

	oop.inherits(TWSession, EditSession);

	(function() {
		
		this.setEmptyTrail = function setEmptyTrail(numLines) { 
			this.$emptyTrail = numLines;
		};
		
		this.setEmptyHead = function setEmptyHead(numLines) {
			this.$emptyHead = numLines;
		};
		
		this.getScreenLength = function getScreenLength() {
			var screenRows = TWSession.super_.getScreenLength.call(this);
			return screenRows + this.$emptyTrail + this.$emptyHead;
		};


	}).call(TWSession.prototype);


	

	exports.TypewriterSession = TWSession;
});