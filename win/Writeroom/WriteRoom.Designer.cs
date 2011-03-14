namespace Writeroom
{
    partial class WriteRoom
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this._browser = new KeyboardFriendlyBrowser();
            this.SuspendLayout();
            // 
            // _browser
            // 
            this._browser.BackColor = System.Drawing.Color.White;
            this._browser.Dock = System.Windows.Forms.DockStyle.Fill;
            this._browser.Location = new System.Drawing.Point(0, 0);
            this._browser.Margin = new System.Windows.Forms.Padding(5);
            this._browser.Name = "_browser";
            this._browser.Padding = new System.Windows.Forms.Padding(5);
            this._browser.Size = new System.Drawing.Size(660, 410);
            this._browser.TabIndex = 0;
            this._browser.Url = null;
            // 
            // WriteRoom
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(660, 410);
            this.Controls.Add(this._browser);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedDialog;
            this.KeyPreview = true;
            this.Name = "WriteRoom";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "WriteRoom JS";
            this.WindowState = System.Windows.Forms.FormWindowState.Maximized;
            this.ResumeLayout(false);

        }

        #endregion

        private WebKit.WebKitBrowser _browser;
    }
}

