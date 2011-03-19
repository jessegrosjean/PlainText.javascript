define("writeroom/document", function(require, exports, module) {
	
	var oop = require("pilot/oop");
	var Document = require("ace/document").Document;
	
	var WrDocument = function WrDocument() {
		Document.prototype.constructor.apply(this, arguments);
	};
	
	oop.inherits(WrDocument, Document);
	
	(function() {
		
	}).call(WrDocument.prototype);
	
	
	exports.WrDocument = WrDocument;
});