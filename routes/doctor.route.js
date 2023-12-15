const express = require("express");
const { DoctorModel } = require("../models/doctors.model");
const DoctorRoute = express.Router();
const axios = require("axios");
const API_KEY = "125c85ac34cf44adb8a0dedab61ca3da";
const jwt = require("jsonwebtoken");

async function geocodeCity(city) {
  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        city
      )}&key=${API_KEY}`
    );
    const { results } = response.data;
    if (results.length > 0) {
      const { lat, lng } = results[0].geometry;
      return { latitude: lat, longitude: lng };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding city:", error);
    return null;
  }
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

DoctorRoute.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const afterDeletion = await DoctorModel.findByIdAndDelete({ _id: id });
    res.send({ msg: `doctor id deleted with id: ${id}` });
  } catch (error) {
    res.send(error);
  }
});

DoctorRoute.patch("/update", async (req, res) => {
  try {
    const { token } = req.query;
    const decode = jwt.verify(token, "solo_project");
    const updatedData = req.body;
    delete req.query.token;

    const afterUpdation = await DoctorModel.findByIdAndUpdate(
      { _id: decode.doctorID },
      updatedData
    );
    res.send({ msg: "doctors data is updated successfully" });
  } catch (error) {
    res.send(error);
  }
});

DoctorRoute.patch("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const afterUpdation = await DoctorModel.findByIdAndUpdate(
      { _id: id },
      req.body
    );
    res.send({ msk: "updation Successfully" });
  } catch (error) {
    res.send({ err: error });
  }
});

DoctorRoute.get("/all", async (req, res) => {
  const status = req.query.status;
  try {
    const query = {};
    if (status) {
      query["status"] = status;
    }
    console.log(query);
    const data = await DoctorModel.find(query).select("-image");
    res.send(data);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching doctors." });
  }
});

DoctorRoute.get("/approved", async (req, res) => {
  const { page } = req.query;
  try {
    const ApprovedDoctor = await DoctorModel.find({ status: "approved" })
      .limit(15)
      .skip((page - 1) * 15);
    res.send(ApprovedDoctor);
  } catch (error) {
    res.send({ msg: "fecing problem while getting approved doctors" });
  }
});
DoctorRoute.get("/pending", async (req, res) => {
  const { page } = req.query;
  try {
    const ApprovedDoctor = await DoctorModel.find({ status: "Not Verified" })
      .limit(15)
      .skip((page - 1) * 15);
    res.send(ApprovedDoctor);
  } catch (error) {
    res.send({ msg: "fecing problem while getting approved doctors" });
  }
});

DoctorRoute.get("/", async (req, res) => {
  const { page, limit, spacility, token, status } = req.query;
  const query = {};
  const newPage = page || 1;
  const newLimit = limit || 6;
  const skip = (newPage - 1) * newLimit;

  if (status) {
    query["status"] = status;
  }
  try {
    if (token) {
      const decode = jwt.verify(token, "solo_project");
      const data = await DoctorModel.find({ _id: decode.doctorID });
      res.send(data);
    } else {
      const doctor = await DoctorModel.find(query).skip(skip).limit(newLimit);
      if (doctor.length === 0) {
        res.status(404).send({ message: "No Doctor's Found" });
      } else {
        const count = await DoctorModel.countDocuments(query);
        res.status(200).send({
          doctor,
          currentPage: parseInt(newPage),
          totalPages: Math.ceil(count / newLimit),
        });
      }
    }
  } catch (error) {
    res.send({ err: error });
  }
});

DoctorRoute.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await DoctorModel.findById(id);
    res.send(doctor);
  } catch (error) {
    res.send({ err: error });
  }
});

DoctorRoute.get("/doctors/near", async (req, res) => {
  const {
    lat: latitude,
    lon: longitude,
    cat,
    status,
    day,
    min,
    max,
    query: searchQuery,
  } = req.query;

  try {
    // Check if both 'cat' and 'query' parameters are provided
    if (!cat || !searchQuery) {
      return res
        .status(400)
        .json({ error: "Both 'cat' and 'query' parameters are required." });
    }

    const distances = [];
    // const regexPattern = new RegExp(cat, "i"); // Case-insensitive regex pattern for category
    const regexPattern = searchQuery
      .split(" ")
      .map((term) => `(?=.*${term})`)
      .join("");
    const query = {
      location: { $regex: regexPattern, $options: "i" },
      spacility: cat,
    };

    if (day) {
      query.Availability = { $in: [day] };
    }

    if (min && max) {
      query.fees = { $gte: min, $lte: max };
    }

    const doctors = await DoctorModel.find(query);

    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// DoctorRoute.get("/doctors/near", async (req, res) => {
//   const {
//     lat: latitude,
//     lon: longitude,
//     cat,
//     status,
//     day,
//     min,
//     max,
//     query: searchQuery,
//   } = req.query;

//   try {
//     const distances = [];
//     let regexPattern = cat
//       .split(" ")
//       .map((term) => `(?=.*${term})`)
//       .join("");

//     let regexPattern2 = searchQuery
//       .split(" ")
//       .map((term) => `(?=.*${term})`)
//       .join("");
//     const query = {
//       $or: [
//         { spacility: { $regex: regexPattern, $options: "i" } },
//         { location: { $regex: regexPattern2, $options: "i" } },
//         // Add any other search criteria here
//       ],
//     };

//     if (day) {
//       query.Availability = { $in: [day] };
//     }

//     if (min && max) {
//       query.fees = { $gte: min, $lte: max };
//     }

//     const doctors = await DoctorModel.find(query);
//     // for (const person of doctors) {
//     //   const { location: doctorlocation } = person;
//     //   const location = await geocodeCity(`${doctorlocation},India, india`);

//     //   if (location) {
//     //     const distance = calculateDistance(
//     //       latitude,
//     //       longitude,
//     //       location.latitude,
//     //       location.longitude
//     //     );
//     //     if (distance <= 1000) {
//     //       person.set("distance", distance);
//     //       distances.push({ person, distance });
//     //     }
//     //   }
//     // }

//     // distances.sort((a, b) => a.distance - b.distance);
//     // const nearestPersons = distances.map(({ person }) => person);

//     res.json(doctors);
//   } catch (error) {
//     // Handle errors appropriately
//     console.error(error);
//     res.status(500).json({ error: "An error occurred" });
//   }
// });

DoctorRoute.post("/", async (req, res) => {
  try {
    const find = await DoctorModel.find({ email: req.body.email });

    if (find.length > 0) {
      res.send({ msg: "Accout allredy created with this email" });
    } else {
      const data = new DoctorModel(req.body);
      await data.save();
      res.send({ msg: "doctor is added on database" });
    }
  } catch (error) {
    res.send({ err: error });
  }
});

DoctorRoute.post("/login", async (req, res) => {
  try {
    const find = await DoctorModel.find({
      email: req.body.email,
    });
    if (find.length > 0) {
      if (find[0].password === req.body.password) {
        const token = jwt.sign({ doctorID: find[0]._id }, "solo_project");
        res.send({
          msg: "Doctor Login Success",
          status: find[0].status,
          token,
        });
      } else {
        res.send({ msg: "please enter correct password" });
      }
    } else {
      res.send({ msg: "Data not found , please Signup !!" });
    }
  } catch (error) {
    res.send({ err: error });
  }
});

DoctorRoute.patch("/forget", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await DoctorModel.find({ email });
    if (user.length === 0) {
      res.send({ msg: "First create an account" });
    } else {
      let afterUpdate = await DoctorModel.findByIdAndUpdate(user[0]._id, {
        password,
      });
      res.send({ msg: "Forget password done" });
    }
  } catch (error) {
    res.send({ err: error });
  }
});

module.exports = {
  DoctorRoute,
};
