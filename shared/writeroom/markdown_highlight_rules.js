/* Markdown highlighter */

define("ace/mode/markdown_highlight_rules", function(require, exports, module) {

var oop = require("pilot/oop");
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var MarkdownHighlightRules = function()
{
    this.$rules = {
        "start" : [
            {
                token : "keyword", // start of block
                regex : "^\\s*[#]{1,6}",
                next  : "header"
            },
            { 
                token : "keyword",
                regex : "^\\s*(?:\\*|-|\\+)\\s",
                next  : "start"

            },
            { 
                token: "keyword",
                regex: "^\\s*\\d+\\.\\s",
                next : "start"
            },
            {
                token : "keyword", 
                regex : "_(?=[^_]+_)",
                next  : "emInner"
            },
            {
                token : "keyword", 
                regex : "\\*\\*(?=[^*]+\\*\\*)", // needs more work
                next  : "strongInner"
            },
            {
            	token : "email",
            	// http://www.regular-expressions.info/regexbuddy/email.html
            	regex : "[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
            	next : "start"
            	
            },
            
            {
                token : "text",
                regex : "\w+",
                next : "start"
            }
        ],
        "header" : [
            {
                token : "text",
                regex : " ",
                next  : "headerName"
            },
            { 
                token : "invalid",
                regex : "[#]+",
                next  : "invalidState"
            }
        ],
        "emInner" : [
            {
                token : "emphasis",
                regex: "[^_]+",
                next : "emClose"
            }
        ],
        "strongInner" : [
            {
                token : "strong",
                regex: "[^*]+",
                next : "strongClose"
            }
        ],
        "emClose" : [
            {
                token : "keyword",
                regex: "_",
                next : "start"
            }
        ],
        "strongClose" : [
            {
                token : "keyword",
                regex: "\\*\\*",
                next : "start"
            }
        ],

        "invalidState" : [
        {   
            token : "invalid",
            regex : ".+",
            next  : "start"
        }
        ],

        "headerName" : [
                {
                    token: "header",
                    regex: ".+",
                    next: "start"
                }
        ]
    };
};

oop.inherits(MarkdownHighlightRules, TextHighlightRules);

exports.MarkdownHighlightRules = MarkdownHighlightRules;

});
