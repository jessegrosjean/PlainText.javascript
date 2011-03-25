define("writeroom/renderer", function(require, exports, module) {

	var oop = require("pilot/oop");
	var VirtualRenderer = require("ace/virtual_renderer").VirtualRenderer;
	var dom = require("pilot/dom");
	var event = require("pilot/event");
	var useragent = require("pilot/useragent");
	var GutterLayer = require("ace/layer/gutter").Gutter;
	var MarkerLayer = require("ace/layer/marker").Marker;
	var TextLayer = require("ace/layer/text").Text;
	var CursorLayer = require("ace/layer/cursor").Cursor;
	var ScrollBar = require("writeroom/scrollbar").WrScrollBar;
	var RenderLoop = require("ace/renderloop").RenderLoop;
	var EventEmitter = require("pilot/event_emitter").EventEmitter;

	var WrRenderer = function WrRenderer(container, theme) {
		this.container = container;
	    dom.addCssClass(this.container, "ace_editor");

	    this.setTheme(theme);

	    this.$gutter = dom.createElement("div");
	    this.$gutter.className = "ace_gutter";
	    this.container.appendChild(this.$gutter);

	    this.scroller = dom.createElement("div");
	    this.scroller.className = "ace_scroller";
	    this.container.appendChild(this.scroller);

	    this.content = dom.createElement("div");
	    this.content.className = "ace_content";
	    this.scroller.appendChild(this.content);

	    this.$gutterLayer = new GutterLayer(this.$gutter);
	    this.$markerBack = new MarkerLayer(this.content);

	    var textLayer = this.$textLayer = new TextLayer(this.content);
	    this.canvas = textLayer.element;

	    this.$markerFront = new MarkerLayer(this.content);

	    this.characterWidth = textLayer.getCharacterWidth();
	    this.lineHeight = textLayer.getLineHeight();

	    this.$cursorLayer = new CursorLayer(this.content);
	    this.$cursorPadding = 8;

	    // Indicates whether the horizontal scrollbar is visible
	    this.$horizScroll = true;
	    this.$horizScrollAlwaysVisible = true;

	    this.scrollBar = new ScrollBar(this, container);
	    this.scrollBar.addEventListener("scroll", this.onScroll.bind(this));

	    this.scrollTop = 0;

	    this.cursorPos = {
	        row : 0,
	        column : 0
	    };

	    var _self = this;
	    this.$textLayer.addEventListener("changeCharaterSize", function() {
	        _self.characterWidth = textLayer.getCharacterWidth();
	        _self.lineHeight = textLayer.getLineHeight();
	        _self.$updatePrintMargin();
	        _self.onResize(true);

	        _self.$loop.schedule(_self.CHANGE_FULL);
	    });
	    event.addListener(this.$gutter, "click", this.$onGutterClick.bind(this));
	    event.addListener(this.$gutter, "dblclick", this.$onGutterClick.bind(this));

	    this.$size = {
	        width: 0,
	        height: 0,
	        scrollerHeight: 0,
	        scrollerWidth: 0
	    };

	    this.$loop = new RenderLoop(this.$renderChanges.bind(this));
	    this.$loop.schedule(this.CHANGE_FULL);

	    this.setPadding(4);
	    this.$updatePrintMargin();
	
		
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
		};
		
		this.scrollToY = function(scrollTop) {
			console.log("ScrollToY: ",scrollTop);
	        var maxHeight = this.session.getScreenLength() * this.lineHeight - this.$size.scrollerHeight;
	        var scrollTop = Math.max(-this.getLead(), Math.min(maxHeight, scrollTop));

	        if (this.scrollTop !== scrollTop) {
	            this.scrollTop = scrollTop;
	            this.$loop.schedule(this.CHANGE_SCROLL);
	        }
	    };
	    
	    this.$updateScrollBar = function() {
	        this.scrollBar.setInnerHeight(this.session.getScreenLength() * this.lineHeight + this.getLead());
	        this.scrollBar.setScrollTop(this.scrollTop + this.getLead());
	    };

	}).call(WrRenderer.prototype);


	

	exports.WrRenderer = WrRenderer;
});