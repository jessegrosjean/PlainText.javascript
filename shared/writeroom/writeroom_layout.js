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

					rend.$padding = remaining/2;
					rend.content.style["padding-left"] =
						rend.content.style["padding-right"] =
							rend.$padding + "px";
					
					if( ed.session.getWrapLimit() !== blockWidth ) {
						ed.session.setWrapLimitRange(blockWidth,blockWidth);
						ed.session.adjustWrapLimit(blockWidth);
					}
					
					rend.$loop.schedule(this.CHANGE_FULL);
					rend.setPrintMarginColumn(blockWidth);
					rend.$updatePrintMargin();

					if( _this.trail > 0 ) {
						var height = dom.getInnerHeight(rend.container);
						var lineHeight = rend.lineHeight;
						ed.getSession().setTrailLines((height*_this.trail)/lineHeight);
					}

					if( _this.lead > 0 ) {
						rend.setLead(dom.getInnerHeight(rend.container)*_this.lead);
					}

					rend.$updateScrollBar();
				};
			},

			addTrail: function addTrail(percScreen) {
				this.trail = percScreen / 100;
				var rend =this.editor.renderer,
				height = dom.getInnerHeight(rend.container),
				lineHeight = rend.lineHeight;
				this.editor.getSession().setTrailLines((height*this.trail)/lineHeight);
				rend.$updateScrollBar();
			},

			addLead: function addLead(percScreen) {
				this.lead = percScreen / 100;
				var rend = this.editor.renderer; 
				rend.setLead(dom.getInnerHeight(rend.container)*this.lead);
			},

			keepCurrentLineAtCenter: function keepCurrentLineAtCenter() {
				var _this = this;
				var lastLine = -1024;
				this.editor.session.addEventListener("change", function(e){
					var ed = _this.editor,
					rend = ed.renderer,
					delta = e.data,
					pos = ed.getCursorPosition();
					
					if( delta.action === "insertText" || delta.action === "removeText" ) {
						if( delta.text.charCodeAt(0) === 13 || delta.text[0] === "\r" || delta.text[0] === "\n") {
							rend.scrollToLine(pos.row, true, true);
							lastLine = pos.row;
						}
					} else {
						rend.scrollToLine(pos.row, true, true);
					}
				});
			}

	};

	exports.LayoutManager = LayoutManager;



});