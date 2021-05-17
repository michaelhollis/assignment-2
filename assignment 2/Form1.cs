using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace assignment_2
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void TextBox1_TextChanged(object sender, EventArgs e)
        {

        }

        private void PictureBox1_Click(object sender, EventArgs e)
        {

        }

        private void TabPage1_Click(object sender, EventArgs e)
        {

        }

        private void PictureBox2_Click(object sender, EventArgs e)
        {
            try
            {
                //read length and Height and Width from textboxes
                double Length = double.Parse(textBox1.Text);
                double Height = double.Parse(textBox2.Text);
                double width = double.Parse(textbox3.Text);
                //read Surface area and Volume from labels 
                double Surface area = Force * Cos(Angle);
            }
        }
    }
}
