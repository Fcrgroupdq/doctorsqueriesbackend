const mongoose = require("mongoose");
const appointMentSchema = mongoose.Schema(
  {
    // userId: { required: true, type: String },
    // doctorName:{required: true, type: String},
    // date:{required: true, type: String},
    // specilaty:{required: true, type: String},
    // reason: { required: true, type: String },
    // checkup: { required: true, type: String },
    // name: { required: true, type: String },
    // age: { required: true, type: Number },
    // address:{required:true,type:String},
    // email:{required: true, type: String},
    // mobile: { required: true, type: String },
    // gender: { required: true, type: String },
    // status: { required: true, type: String },
    // appointmentDay:{required: true, type: String},
    // time:{ required: true, type: String },
    doctor:{type:String}
  },
  {
    versionKey: false,
  }
);

const AppointMentModel = mongoose.model("appointment", appointMentSchema);

module.exports = {
  AppointMentModel,
};
