define("writeroom/renderer", function(require, exports, module) {

	var oop = require("pilot/oop");
	var VirtualRenderer = require("ace/virtual_renderer").VirtualRenderer;

	var WrRenderer = function WrRenderer() {
		// Calling the EditSession constructor on our object, so we look like EditSession
		VirtualRenderer.prototype.constructor.apply(this, arguments);
		this.$leadLines = 0;
	};

	oop.inherits(WrRenderer, VirtualRenderer);

	(function() {
		
		this.setLead = function setLead(amnt) {
			this.$leadLines = amnt / this.lineHeight;
			this.session.setLeadLines(this.$leadLines);
			this.$loop.schedule(this.CHANGE_SCROLL);
		};
		
		this.getLead = function getLead() {
			return this.$leadLines * this.lineHeight;
		}
		
		this.scrollToY = function(scrollTop) {
	        var maxHeight = this.session.getScreenLength() * this.lineHeight - this.$size.scrollerHeight;
	        var scrollTop = Math.max(-this.getLead(), Math.min(maxHeight, scrollTop));
        	

	        if (this.scrollTop !== scrollTop) {
	            this.scrollTop = scrollTop;
	            this.$loop.schedule(this.CHANGE_SCROLL);
	        }
	    };

	}).call(WrRenderer.prototype);


	

	exports.WrRenderer = WrRenderer;
});