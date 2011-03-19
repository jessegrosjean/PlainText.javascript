define("writeroom/typewriter_session", function(require, exports, module) {
    
    var oop = require("pilot/oop");
    var EditSession = require("ace/edit_session").EditSession;
    
    var TWSession = function TWSession(text, mode) {
        // Calling the EditSession constructor on our object, so we look like EditSession
    	EditSession.prototype.constructor.apply(this, arguments);
    };
    
    
    oop.inherits(TWSession, EditSession);
    
    exports.TypewriterSession = TWSession;
});