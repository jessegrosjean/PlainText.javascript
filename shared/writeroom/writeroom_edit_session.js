define("writeroom/edit_session", function(require, exports, module) {

	var oop = require("pilot/oop");
	var EditSession = require("ace/edit_session").EditSession;

	var WrEditSession = function WrEditSession(text,mode) {
		// Calling the EditSession constructor on our object, so we look like EditSession
		EditSession.prototype.constructor.apply(this, arguments);
		this.$trailLines = this.$leadLines = 0;
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
			return screenRows + this.$leadLines + this.$trailLines;
		};


	}).call(WrEditSession.prototype);


	

	exports.WrEditSession = WrEditSession;
});