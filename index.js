const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();
const app = express();
const port = 3000;
const multer = require("multer");
const upload = multer();

// Middleware
app.use(upload.none());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Email sending function
async function sendEmail(name, company_name, company_size, email, phone) {
  const userMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Selamat datang di evobird",
    text: `Halo ${name}, terima kasih telah mendaftar di evobird. Berikut adalah detail perusahaan anda: Nama Perusahaan: ${company_name}, Jumlah Karyawan: ${company_size}, Email: ${email}, No. Telepon: ${phone}`,
  };

  const adminMailOptions = {
    from: process.env.EMAIL,
    to: "aldiandyainf+admin@gmail.com",
    subject: "New User Registration",
    text: `New user registered with the following details: Name: ${name}, Company Name: ${company_name}, Company Size: ${company_size}, Email: ${email}, Phone: ${phone}`,
  };

  try {
    await transporter.sendMail(adminMailOptions);
    console.log("Email sent to admin successfully");

    await transporter.sendMail(userMailOptions);
    console.log("Email sent to user successfully");
  } catch (error) {
    console.error("Error occurred while sending email:", error.message);
    throw error;
  }
}

// Handle text request
app.post("/text", (req, res) => {
  const { name, company_name, company_size, email, phone } = req.body;
  console.log(name, company_name, company_size, email, phone);
});

// POST endpoint to send email
app.post("/send-email", async (req, res) => {
  const { name, company_name, company_size, email, phone } = req.body;

  // Validate input
  if (!name || !company_name || !company_size || !email || !phone) {
    return res.status(400).send("All input is required");
  }

  // check if email is valid
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email address");
  }

  // check if phone number is valid
  const phoneRegex = /^\d{10,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).send("Invalid phone number");
  }

  

  try {
    await sendEmail(name, company_name, company_size, email, phone);
    return res.status(200).send("Email sent successfully");
  } catch (error) {
    return res.status(500).send("Error occurred while sending email");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
