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
        		var rend = ed.renderer;
        		var width = dom.getInnerWidth(rend.container);
        		var charWidth = rend.characterWidth;
        		var innerWidth = charWidth * blockWidth;
        		var remaining = width - innerWidth;
        		rend.setPrintMarginColumn(blockWidth);
        		rend.setPadding(remaining/2);
        		if( _this.trail > 0 ) {
	            	var height = dom.getInnerHeight(rend.container);
	            	var lineHeight = rend.lineHeight;
	            	ed.getSession().setEmptyTrail((height*_this.trail)/lineHeight);
	            	rend.$updateScrollBar();
        		}
        	};
        },
        
        addTrail: function addTrail(percScreen) {
        	this.trail = percScreen / 100;
        },
        
        addLead: function addHead(percScreen) {
        	this.lead = percScreen / 100;
        },
        
        keepCurrentLineAtCenter: function keepCurrentLineAtCenter() {
        	var _this = this;
        	event.addListener(this.editor.getSession(), "change", function() {
        		var ed = _this.editor;
        		var pos = ed.getCursorPosition();
        		ed.renderer.scrollToLine(pos.row, true);
        	});
        },
        
        registerOnScroll: function registerOnScroll() {
            this.editor.renderer.scrollBar.addEventListener("scroll",
                                                            this.onScroll.bind(this));
        },
        
        onScroll: function onScroll(e) {
        	if( this.lead == 0 ) return;
        	var rend = this.editor.renderer,
        		lineHeight = rend.lineHeight,
            	height = dom.getInnerHeight(rend.container),
            	atLine = Math.ceil(e.data / lineHeight),
            	leadLines = (this.lead * height) / lineHeight;
        	if( atLine > leadLines ) return;
        	var diff = leadLines - atLine;
        	var padd = diff * lineHeight;
        	rend.content.style["padding-top"] = padd+"px";
        }
        
    };

    exports.LayoutManager = LayoutManager;
    
});