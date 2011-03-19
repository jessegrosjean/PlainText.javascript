define("writeroom/renderer", function(require, exports, module) {

	var oop = require("pilot/oop");
	var VirtualRenderer = require("ace/virtual_renderer").VirtualRenderer;

	var WrRenderer = function WrRenderer() {
		// Calling the EditSession constructor on our object, so we look like EditSession
		VirtualRenderer.prototype.constructor.apply(this, arguments);
	};

	oop.inherits(WrRenderer, VirtualRenderer);

	(function() {
		
		this.scrollToY = function(scrollTop) {
			var allowNegative = arguments.length > 1? arguments[0] : false;
	        var maxHeight = this.session.getScreenLength() * this.lineHeight - this.$size.scrollerHeight;
	        var scrollTop = Math.min(maxHeight, scrollTop);
	        if( !allowNegative )
	        	scrollTop = Math.max(0, scrollTop);

	        if (this.scrollTop !== scrollTop) {
	            this.scrollTop = scrollTop;
	            this.$loop.schedule(this.CHANGE_SCROLL);
	        }
	    };

	}).call(WrRenderer.prototype);


	

	exports.WrRenderer = WrRenderer;
});