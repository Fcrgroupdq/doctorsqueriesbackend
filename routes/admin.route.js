const express = require("express");
const AdminRoute = express.Router();
const { AdminModel } = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

AdminRoute.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const Admin = await AdminModel.find({ email });
    console.log(Admin);
    if (Admin.length > 0) {
      res.send({ msg: "Admin Account is allready created" });
    } else {
      bcrypt.hash(password, 4, async function (err, hash) {
        if (err) {
          res.send({ err: err });
        } else {
          const admin = new AdminModel({ ...req.body, password: hash });
          await admin.save();
          res.send({ msg: "new Admin has been added" });
        }
      });
    }
  } catch (error) {
    res.send({ err: error });
  }
});

AdminRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await AdminModel.findOne({ email });
    if (!user) {
      res.send({ msg: "please signup first" });
    } else {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === false) {
          res.send({ msg: "please enter valid password" });
        } else {
          const token = jwt.sign({ adminID: user._id }, "solo_project");
          res.send({ token: token, msg: "Admin Login success" });
        }
      });
    }
  } catch (error) {
    res.send({ err: error });
  }
});

AdminRoute.patch("/forget", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminModel.find({ email });
    if (user.length === 0) {
      res.send({ msg: "First create an account" });
    } else {
      bcrypt.hash(password, 4, async function (err, hash) {
        if (err) {
          res.send({ err: err });
        } else {
          let afterUpdate = await AdminModel.findByIdAndUpdate(user[0]._id, {
            password: hash,
          });
          res.send({ msg: "Forget password done" });
        }
      });
    }
  } catch (error) {
    res.send({ err: error });
  }
});

module.exports = {
  AdminRoute,
};
