const express = require("express");
const HospitalRoute = express.Router();
const { HospitalModel } = require("../models/hospital.model");

HospitalRoute.get("/", async (req, res) => {
  try {
    const hospitals = await HospitalModel.find();
    res.send(hospitals);
  } catch (error) {
    res.send({ err: error });
  }
});

HospitalRoute.patch("/update/:id", async (req, res) => {
  try {
    const updatedData = req.body;
    const id = req.params.id;
    const hospital = await HospitalModel.findByIdAndUpdate(
      { _id: id },
      updatedData
    );
    res.send({ msg: `hospital data updated with id ${id}` });
  } catch (error) {
    res.send(error);
  }
});

HospitalRoute.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const afterDeletion = await HospitalModel.findByIdAndDelete({ _id: id });
    res.send({ msg: `hospital deleted` });
  } catch (error) {
    res.send(error);
  }
});

HospitalRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const hospital = await HospitalModel.findById(id);
    res.send(hospital);
  } catch (error) {
    res.send({ err: error });
  }
});

HospitalRoute.post("/", async (req, res) => {
  try {
    const Newhospital = new HospitalModel(req.body);
    await Newhospital.save();
    res.send("hospital data os added in database");
  } catch (error) {
    res.send({ err: error });
  }
});

module.exports = {
  HospitalRoute,
};
