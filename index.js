const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
// get .env
require("dotenv").config();
const port = 3000;
const multer = require("multer");
const upload = multer();

// Middleware to parse request body
app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a transporter object with Gmail SMTP credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

app.post("/text", (req, res) => {
  // print body content
  console.log(req.body);
  const { name, company_name, company_size, email, phone } = req.body;
  // console.log it
  console.log(name, company_name, company_size, email, phone);
});

// POST endpoint to send email
app.post("/send-email", (req, res) => {
  const { name, company_name, company_size, email, phone } = req.body;

  // Define the email options
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Selamat datang di evobird",
    text: `Halo ${name}, terima kasih telah mendaftar di evobird. Berikut adalah detail perusahaan anda: Nama Perusahaan: ${company_name}, Jumlah Karyawan: ${company_size}, Email: ${email}, No. Telepon: ${phone}`,
  };

  // Define the email options for admin
  const mailOptions2 = {
    from: process.env.EMAIL,
    to: "aldiandyainf+admin@gmail.com",
    subject: "New User Registration",
    text: `New user registered with the following details: Name: ${name}, Company Name: ${company_name}, Company Size: ${company_size}, Email: ${email}, Phone: ${phone}`,
  };

  // Send the email to admin
  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.log("Error 2 occurred:", error.message);
    } else {
      console.log("Email 2 sent successfully:", info.response);
    }
  });

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error 1 occurred:", error.message);
      res.status(500).send("Error occurred while sending email");
    } else {
      console.log("Email 1 sent successfully:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
