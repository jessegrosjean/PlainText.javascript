using System.Runtime.InteropServices;
using System;
using System.Text;

namespace Writeroom
{
    class Interop
    {
        [DllImport("user32.dll")]
        public static extern IntPtr GetFocus();

        [DllImport("user32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        static extern int GetWindowTextLength(IntPtr hWnd);

        public static string GetWindowText(IntPtr hWnd)
        {
            // Allocate correct string length first
            int length = GetWindowTextLength(hWnd);
            StringBuilder sb = new StringBuilder(length + 1);
            GetWindowText(hWnd, sb, sb.Capacity);
            return sb.ToString();
        }

        public static int WM_KEYFIRST = 0x100;
        public static int WM_KEYDOWN = 0x100;
        public static int WM_KEYUP = 0x101;
        public static int WM_CHAR = 0x102;
        public static int WM_DEADCHAR = 0x103;
        public static int WM_SYSKEYDOWN = 0x104;
        public static int WM_SYSKEYUP = 0x105;
        public static int WM_SYSCHAR = 0x106;
        public static int WM_SYSDEADCHAR = 0x107;
        public static int WM_KEYLAST = 0x108;
    }
}