/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define("writeroom/theme", function(require, exports, module) {

    var dom = require("pilot/dom");

    var cssText = ".ace-tmwr .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
#editor {\
    background-color: black;\
    font-size: 16px;\
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
  color: rgb(100,255,100);\
}\
\
.ace-tmwr .ace_cursor {\
  border-left: 2px solid rgb(100,255,100);\
}\
\
.ace-tmwr .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid rgb(100,255,100);\
}\
        \
.ace-tmwr .ace_line .ace_invisible {\
  color: rgb(191, 191, 191);\
}\
\
.ace-tmwr .ace_line .ace_keyword {\
  color: rgb(150,195,50);\
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
    color: rgb(255,255,100);\
    font-weight: bold;\
}\
.ace-tmwr .ace_line .ace_emphasis {\
    font-style: italic;\
}\
.ace-tmwr .ace_line .ace_strong {\
    color: rgb(235,235,80);\
    font-weight: bold;\
}\
.ace-tmwr .ace_line .ace_tag {\
    color: rgb(235,100,100);\
    font-style: italic;\
}\
.ace-tmwr .ace_line .ace_email {\
	color: white;\
	text-decoration: underline;\
}\
.ace-tmwr .ace_line .ace_weblink {\
	color: white;\
	text-decoration: underline;\
}\
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
  background-color: rgb(50,150,50);\
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
  border: 1px solid rgb(192, 192, 192);\
}\
\
.ace-tmwr .ace_marker-layer .ace_active_line {\
  background: rgb(232, 242, 254);\
}\
\
.ace-tmwr .ace_marker-layer .ace_selected_word {\
  background: rgb(250, 250, 255);\
  border: 1px solid rgb(200, 200, 250);\
}\
\
.ace-tmwr .ace_string.ace_regex {\
  color: rgb(255, 0, 0)\
}";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-tmwr";
});
