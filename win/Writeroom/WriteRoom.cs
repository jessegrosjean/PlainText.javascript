using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;
using WebKit.DOM;
using System.IO;

namespace Writeroom
{
    public partial class WriteRoom : Form
    {
        public WriteRoom()
        {
            this.KeyPreview = true;

            InitializeComponent();

            SetStyle(ControlStyles.Selectable, true);

            this.Load += new EventHandler(onLoad);
            _browser.Navigated += new WebBrowserNavigatedEventHandler(onNavigated);
            _browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(onDocumentFullyLoaded);
        }

        protected override bool ProcessDialogKey( System.Windows.Forms.Keys keyData ) {
            if ( keyData.HasFlag( Keys.O ) && keyData.HasFlag( Keys.Control ) ) {
                var fileToOpen = FindFileDialog();
                if ( fileToOpen != null && File.Exists( fileToOpen ) ) {
                    string loadedString = File.ReadAllText( fileToOpen );
                    SetDocumentTo( loadedString );
                }
                return true;
            }

            if ( keyData.HasFlag( Keys.S ) && keyData.HasFlag( Keys.Control ) ) {
                var fileSavior = _browser.StringByEvaluatingJavaScriptFromString("");
            }
            return base.ProcessDialogKey( keyData );
        }

        void previewKeyDown(object sender, PreviewKeyDownEventArgs e)
        {
            if (e.Control == true && e.KeyCode == Keys.O)
            {
                var fileToOpen = FindFileDialog();
                if (fileToOpen != null && File.Exists(fileToOpen))
                {
                    string loadedString = File.ReadAllText(fileToOpen);
                    SetDocumentTo(loadedString);
                }
                e.IsInputKey = false;
            }
        }

        void onDocumentFullyLoaded(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            var edit = _browser.StringByEvaluatingJavaScriptFromString("editor.focus()");
        }

                    

        private void SetDocumentTo(string loadedString)
        {
            _browser.StringByEvaluatingJavaScriptFromString(
                @"var EditSession = require(""ace/edit_session"").EditSession;" +
                @"var UndoManager = require(""ace/undomanager"").UndoManager;" +
                @"var TextMode = require(""ace/mode/text"").Mode;");

            var ln = loadedString.Replace("\n", "\\n").Replace("\r", "\\r");
            var loadingText = string.Format(@"var session = new EditSession(""{0}"");" +
                "session.setUseWrapMode(true); session.setMode(new TextMode()); session.setUndoManager(new UndoManager());"+
                "editor.setSession(session);", ln);

            _browser.StringByEvaluatingJavaScriptFromString(loadingText);
        }

        private string FindFileDialog()
        {
            var fd = new OpenFileDialog();
            fd.Filter = "Text files (*.txt)|*.txt|All files (*.*)|*.*";
            fd.CheckFileExists = true;
            fd.Multiselect = false;
            
            var res = fd.ShowDialog(this);

            if (res == System.Windows.Forms.DialogResult.OK)
            {
                return fd.FileName;
            }

            return null;
        }


        void onNavigated(object sender, WebBrowserNavigatedEventArgs e)
        {
        }

        void onLoad(object sender, EventArgs e)
        {
            _browser.Navigate(Properties.Settings.Default.editorFile);
            _browser.Focus();
        }
    }
}
