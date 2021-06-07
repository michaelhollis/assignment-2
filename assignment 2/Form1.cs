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
                double width = double.Parse(textBox3.Text);
                //read Surface area and Volume from labels 
                double Surfacearea = 2.0 * (Length * Height + Length * width + Height * width);
                double Volume = Length * width * Height;
                //run the code between these brackets
                label1.Text = "Surface area = " + Surfacearea;
                label2.Text = "Volume = " + Volume;

            }
            catch
            {

            }

        }

        private void Button1_Click(object sender, EventArgs e)
        {

        }

        private void Button2_Click(object sender, EventArgs e)
        {
            try
            {
                //read radius from textboxes
                double radius = double.Parse(textBox1.Text);
                //read Surface Area and Volume from labels
                double SurfaceArea = 4.0 * Math.PI * radius * radius;
                double Volume = 4.0 / 3.0 * Math.PI * radius * radius * radius;
                //run the code between these brackets
                label1.Text = "surface area = " + SurfaceArea;
                label2.Text = "Volume = " + Volume;
            }
            catch
            {

            }
        }

        private void TextBox1_TextChanged_1(object sender, EventArgs e)
        {

        }

        private void TextBox5_TextChanged(object sender, EventArgs e)
        {

        }

        private void TextBox6_TextChanged(object sender, EventArgs e)
        {

        }

        private void Label7_Click(object sender, EventArgs e)
        {

        }

        private void Button3_Click(object sender, EventArgs e)
        {
            try

            {  //read Radius and height from textboxes
                double Radius = double.Parse(TextBox6.Text);
                double Height = double.Parse(TextBox5.Text);
                //read Surface area and volume from labels 
                double surfacearea = Math.PI * Radius * (Radius + Math.Sqrt(Height * Height + Radius * Radius));
                double volume = 1.0 / 3.0 * Math.PI * Radius * Radius * Height;
                //run the code between these brackets
                label5.Text = "surface area = " + surfacearea;
                label6.Text = "volume = " + volume;
            }
            catch
            {
                MessageBox.Show("error on input");
            }

        }
    }
}
