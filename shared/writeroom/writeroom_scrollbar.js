define("writeroom/scrollbar", function(require, exports, module) {
	
	var oop = require("pilot/oop");
	var ScrollBar = require("ace/scrollbar").ScrollBar;
	
	var WrScrollBar = function WrScrollBar(renderer, container) {
		console.log(renderer, container);
		ScrollBar.prototype.constructor.call(this, container);
		this.renderer = renderer;
	};
	
	oop.inherits(WrScrollBar, ScrollBar);
	
	(function(){
		
		this.onScroll = function() {
	        console.log(this.element.scrollTop, this.renderer.getLead());
			this._dispatchEvent("scroll", {data: this.element.scrollTop - this.renderer.getLead()});
	    };
	    
		
	}).call(WrScrollBar.prototype);
	
	exports.WrScrollBar = WrScrollBar;
});