using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebKit;

namespace Writeroom {
    class KeyboardFriendlyBrowser : WebKitBrowser {
        protected override void OnLoad( EventArgs e ) {
            base.OnLoad( e );
        }

        protected override bool ProcessCmdKey( ref System.Windows.Forms.Message msg, System.Windows.Forms.Keys keyData ) {
            return base.ProcessCmdKey( ref msg, keyData );
        }

    }
}
