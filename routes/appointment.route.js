const express = require("express");
const AppointmentRoute = express.Router();
const { AppointMentModel } = require("../models/appointment.model");

AppointmentRoute.get("/", async (req, res) => {
  try {
    const query = {}
    const {user,status} = req.query
    if(user){
      query.userId = user
    }
    if(status){
      query.status = status
    }

    const data = await AppointMentModel.find(query);
    res.send(data);
  } catch (error) {
    res.send({ msg: "failed to find appointment" });
  }
});

AppointmentRoute.post("/", async (req, res) => {
    try {
      const newAppointment = new AppointMentModel(req.body);
      const savedAppointment = await newAppointment.save();
      res.status(201).json({ msg: "Appointment saved successfully", appointment: savedAppointment });
    } catch (error) {
      console.error("Error while creating an appointment:", error);
      res.status(500).json({ msg: "Failed to create an appointment" });
    }
  });

AppointmentRoute.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await AppointMentModel.findById(id);
    res.send(data);
  } catch (error) {
    res.send({ msg: "error while getting a appointment" });
  }
});

AppointmentRoute.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const afterDeletion = await AppointMentModel.findByIdAndDelete(id);
    res.send({ msg: `appointment deleted with id ${id}` });
  } catch (error) {
    res.send({ msg: "error while deleting a appointment" });
  }
});

AppointmentRoute.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const afterUpdation = await AppointMentModel.findByIdAndUpdate(
      { _id: id },
      req.body
    );
    res.send({ msg: "appointment successfully updated" });
  } catch (error) {
    res.send({ msg: "error while updating a appointment" });
  }
});

module.exports = {
  AppointmentRoute,
};
