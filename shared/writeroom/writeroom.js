define("writeroom/layout", function(require, exports, module) {
    
    var oop = require("pilot/oop");
    var dom = require("pilot/dom");
    var event = require("pilot/event");
    
    var LayoutManager = function LayoutManager(editor) {
        this.editor = editor;
        
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
        	return function(e) { 
        		var rend = _this.editor.renderer;
        		var width = dom.getInnerWidth(rend.container);
        		var charWidth = rend.characterWidth;
        		var innerWidth = charWidth * blockWidth;
        		var remaining = width - innerWidth;
        		rend.setPrintMarginColumn(blockWidth);
        		rend.setPadding(remaining/2);
        	};
        },
        
        registerOnScroll: function registerOnScroll() {
            this.editor.renderer.scrollBar.addEventListener("scroll",
                                                            this.onScroll.bind(this));
        },
        
        onScroll: function onScroll(e) {
            console.log(e);
        }
        
    };

    exports.LayoutManager = LayoutManager;
    
});