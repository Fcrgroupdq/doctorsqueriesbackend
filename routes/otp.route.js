const express = require("express");
const OtpRoute = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { OtpModel } = require("../models/otp.model");

// Store OTPs temporarily (In production, use a database)
const otpStore = {};

// Generate a random OTP
function generateOTP() {
  return crypto.randomInt(1000, 9999).toString();
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sharmaashish7251@gmail.com",
    pass: "w][zU2!8$1GAihJ",
  },
});

OtpRoute.post("/send", async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    const newOTP = new OtpModel({ ...req.body, otp });
    await newOTP.save();

    let mailOptions = {
      from: "pawan6200327812@gmail.com",
      to: email,
      subject: " OTP Verification Code for Doctorsqeries",
      text: `
      Dear ${email},

      You are receiving this email because you have initiated the OTP verification process Doctorsqeries.

      Your OTP verification code is: ${otp}

      Please use this code to verify your account within the next 10 minutes. Do not share this code with anyone and do not reply to this email with the code.

      If you encounter any issues or need assistance, please don't hesitate to contact our support team at info@doctorsqueries.com.

      Thank you for using Doctorsqeries.

      Best regards,
      Doctorsqeries
      info@doctorsqueries.com
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send({ err: error });
      } else {
        res.send({ msg: "otp sent successfully" });
      }
    });
  } catch (error) {
    res.send({ err: error });
  }
});

OtpRoute.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const find = await OtpModel.find({ email, otp });
    if (find.length > 0) {
      res.send({ msg: "otp verify success" });
    } else {
      res.send({ msg: "please enter correct otp" });
    }
  } catch (error) {
    res.send({ err: error });
  }
});


OtpRoute.post("/send-mail", async (req, res) => {
  try {
    let { email, massage,subject } = req.body;
    let mailOptions = {
      from: "pawan6200327812@gmail.com",
      to: email,
      subject: subject,
      text: massage,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send({ err: error });
      } else {
        res.send({ msg: "Notification sent Successfully" });
      }
    });
  } catch (error) {
    res.send({ err: error });
  }
});

module.exports = {
  OtpRoute,
};
