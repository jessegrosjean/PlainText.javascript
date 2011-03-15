/**
 * @author Mutahhir Ali Hayat
 * @date 14 March 2011
 *  
 */
define("writeroom/markdown_highlight_rules", function(require, exports, module) {
	var oop = require("pilot/oop");
	var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
	
	var MarkdownHighlightRules = function MarkdownHighlightRules() {
		
		this.$rules = {
				"start": [
				          {
				        	  token: "keyword",
				        	  regex: "^[#]+\s",
				        	  next: "headingText"
				          },
				          {
				        	  token: "keyword",
				        	  regex: "^(?:\\*|\\+|-)+"
				          },
				          ],
				"headingText": [
				                {
				                	token: "string",
				                	regex: ".+"
				                }
				                ]
		};
	};

	oop.inherits(MarkdownHighlightRules, TextHighlightRules);

	exports.MarkdownHighlightRules = MarkdownHighlightRules;
});