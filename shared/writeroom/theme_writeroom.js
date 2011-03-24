define("writeroom/theme", function(require, exports, module) {

    var dom = require("pilot/dom");

    var cssText = ".ace-tmwr .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
#editor {\
    font-size: 14px;\
	background: rgb(250,250,250);\
}\
\
.ace-tmwr .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-tmwr .ace_gutter {\
  width: 50px;\
  background: #e8e8e8;\
  color: #333;\
  overflow : hidden;\
}\
\
.ace-tmwr .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-tmwr .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-tmwr .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-tmwr .ace_text-layer {\
  cursor: text;\
  color: rgb(0,0,0);\
}\
\
.ace-tmwr .ace_cursor {\
  border-left: 1px solid rgb(0,0,0);\
}\
\
.ace-tmwr .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid rgb(0,0,0);\
}\
        \
.ace-tmwr .ace_line .ace_invisible {\
  color: rgb(191, 191, 191);\
}\
\
.ace-tmwr .ace_line .ace_keyword {\
}\
\
.ace-tmwr .ace_line .ace_constant.ace_buildin {\
  color: rgb(88, 72, 246);\
}\
\
.ace-tmwr .ace_line .ace_constant.ace_language {\
  color: rgb(88, 92, 246);\
}\
\
.ace-tmwr .ace_line .ace_constant.ace_library {\
  color: rgb(6, 150, 14);\
}\
\
.ace-tmwr .ace_line .ace_invalid {\
  background-color: rgb(153, 0, 0);\
  color: white;\
}\
\
.ace-tmwr .ace_line .ace_header {\
    font-weight: bold;\
}\
.ace-tmwr .ace_line .ace_emphasis {\
    font-style: italic;\
}\
.ace-tmwr .ace_line .ace_delete {\
	text-decoration: line-through;\
}\
.ace-tmwr .ace_line .ace_strong {\
    font-weight: bold;\
}\
.ace-tmwr .ace_line .ace_email {\
	text-decoration: underline;\
}\
.ace-tmwr .ace_line .ace_weblink {\
	text-decoration: underline;\
}\
\
\
\
\
\
\
\
\
\
\
.ace-tmwr .ace_line .ace_support.ace_function {\
  color: rgb(60, 76, 114);\
}\
\
.ace-tmwr .ace_line .ace_support.ace_constant {\
  color: rgb(6, 150, 14);\
}\
\
.ace-tmwr .ace_line .ace_support.ace_type,\
.ace-tmwr .ace_line .ace_support.ace_class {\
  color: rgb(109, 121, 222);\
}\
\
.ace-tmwr .ace_line .ace_keyword.ace_operator {\
  color: rgb(104, 118, 135);\
}\
\
.ace-tmwr .ace_line .ace_string {\
  color: rgb(3, 106, 7);\
}\
\
.ace-tmwr .ace_line .ace_comment {\
  color: rgb(76, 136, 107);\
}\
\
.ace-tmwr .ace_line .ace_comment.ace_doc {\
  color: rgb(0, 102, 255);\
}\
\
.ace-tmwr .ace_line .ace_comment.ace_doc.ace_tag {\
  color: rgb(128, 159, 191);\
}\
\
.ace-tmwr .ace_line .ace_constant.ace_numeric {\
  color: rgb(0, 0, 205);\
}\
\
.ace-tmwr .ace_line .ace_variable {\
  color: rgb(49, 132, 149);\
}\
\
.ace-tmwr .ace_line .ace_xml_pe {\
  color: rgb(104, 104, 91);\
}\
\
.ace-tmwr .ace_marker-layer .ace_selection {\
  background-color: rgb(200,200,200);\
}\
\
.ace-tmwr .ace_marker-layer .ace_step {\
  background: rgb(252, 255, 0);\
}\
\
.ace-tmwr .ace_marker-layer .ace_stack {\
  background: rgb(164, 229, 101);\
}\
\
.ace-tmwr .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgb(0, 0, 0);\
}\
\
.ace-tmwr .ace_marker-layer .ace_active_line {\
  background: rgb(232, 242, 254);\
}\
\
.ace-tmwr .ace_marker-layer .ace_selected_word {\
  border: 1px solid rgb(0, 0, 0);\
}\
\
.ace-tmwr .ace_string.ace_regex {\
  color: rgb(255, 0, 0)\
}";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-tmwr";
});
