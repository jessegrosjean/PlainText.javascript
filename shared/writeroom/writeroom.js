define("writeroom/layout", function(require, exports, module) {
    
    var oop = require("pilot/oop");
    var dom = require("pilot/dom");
    var event = require("pilot/event");
    
    var LayoutManager = function LayoutManager(editor) {
        this.editor = editor;
        this.trail = 0;
        this.lead = 0;
    };
    
    LayoutManager.prototype = {
        
        layout: function layout(topPerc, rightPerc, bottomPerc, leftPerc) {
            var left = leftPerc/100,
                top = topPerc/100,
                right = rightPerc/100,
                bottom = bottomPerc/100;
            var _this = this;
            
            return function(e) {
                var rend = _this.editor.renderer;
                var width = dom.getInnerWidth(rend.container);
                var charWidth = rend.characterWidth;
                var midPerc = 1 - (left+right);
                var blockWidth = midPerc * (width/charWidth);
                rend.$padding = width * left;
                rend.setPrintMarginColumn(blockWidth);
                var padd = [0, width*right, 0, rend.$padding];
                rend.content.style.padding = padd.join("px ") + "px";
                rend.$loop.schedule(rend.CHANGE_FULL);
                rend.$updatePrintMargin();
            };
        },
        
        layoutCenter: function layoutCenter(blockWidth) {
        	var _this = this;
        	var ed = this.editor;
        	return function(e) { 
        		var rend = ed.renderer,
        			width = dom.getInnerWidth(rend.container),
        			charWidth = rend.characterWidth,
        			innerWidth = charWidth * blockWidth,
        			remaining = width - innerWidth;
        		
        		rend.setPrintMarginColumn(blockWidth);
        		rend.$padding = remaining/2;
                rend.content.style["padding-left"] =
                rend.content.style["padding-right"] =
                	rend.$padding + "px";
                rend.$loop.schedule(this.CHANGE_FULL);
                rend.$updatePrintMargin();
        		
        		if( _this.trail > 0 ) {
	            	var height = dom.getInnerHeight(rend.container);
	            	var lineHeight = rend.lineHeight;
	            	ed.getSession().setTrailLines((height*_this.trail)/lineHeight);
	            	rend.$updateScrollBar();
        		}
        	};
        },
        
        addTrail: function addTrail(percScreen) {
        	this.trail = percScreen / 100;
        },
        
        addLead: function addLead(percScreen) {
        	this.lead = percScreen / 100;
        	var rend =this.editor.renderer; 
        	rend.setLead(dom.getInnerHeight(rend.container)*this.lead);
        },
        
        keepCurrentLineAtCenter: function keepCurrentLineAtCenter() {
        	var _this = this;
        	var numLines = -1;
        	event.addListener(this.editor.getSession(), "change", function(e) {
        		var ed = _this.editor,
        			lines = ed.session.getLength();
        		if( numLines == lines ) return;
        		
        		var	rend = ed.renderer,
        			pos = ed.getCursorPosition();
        		numLines = lines;
        		_this.paddingAwareScrollToLine(pos.row, true);
        	});
        },
        
        registerOnScroll: function registerOnScroll() {
            this.editor.renderer.scrollBar.addEventListener("scroll",
                                                            this.onScroll.bind(this));
        },
        
        onScroll: function onScroll(e) {
        },
        
        adjustPaddingFor: function adjustPaddingFor(row, dontAdjust) {
        	var rend = this.editor.renderer,
	    		lineHeight = rend.lineHeight,
	        	height = dom.getInnerHeight(rend.container),
	        	leadLines = Math.round((this.lead * height) / lineHeight),
	        	prevPadding = parseInt(rend.content.style["padding-top"]);
	        	mid = (rend.$size.scrollerHeight-prevPadding) / 2,
	        	midline = mid / lineHeight,
	        	adjustFlag = typeof(dontAdjust) === "undefined" || dontAdjust !== true; 

        	if( row >= midline ) {
        		diff = row - midline;
        		if( diff > leadLines ) {
        			if( adjustFlag ) { 
        				rend.content.style["padding-top"] = "0px";
        				console.log("going zero");
        			}
        			
        			return 0;
        		} else {
        			var diff2 = Math.round(leadLines - diff),
        				pad =  diff2 * lineHeight;
        			if( pad < lineHeight ) pad = 0;
        			if( adjustFlag ) { 
        				rend.content.style["padding-top"] = pad+"px";
        				console.log("padding: "+pad);
        			}
        			return diff;
        		}
        	}
        	
        	if( adjustFlag ){ 
        		rend.content.style["padding-top"] = (leadLines*lineHeight)+"px";
        		console.log("full padding / r:"+row+" m:"+midline);
        	}
        	
        	return leadLines;
        },
        
        paddingAwareScrollToLine: function(line, center) {
            var offset = 0;
            var rend = this.editor.renderer,
            	lineHeight = { lineHeight: rend.lineHeight };
            	
            for (var l = 1; l < line; l++) {
                offset += this.editor.session.getRowHeight(lineHeight, l-1);
            }
            
            if (center) {
                offset -= (rend.$size.scrollerHeight) / 2 ;
            }
            
            rend.scrollToY(offset);
        }
        
    };

    exports.LayoutManager = LayoutManager;
    
});