const express = require('express');
const mongoose = require('mongoose');


const DoctorSchema = mongoose.Schema({
    name:{type:String},
    image:{type:String},
    location:{type:String},
    spacility:{type:String},
    fees:{type:Number},
    city:{type:String},
    state:{type:String},
    expertise:{type:String},
    exp:{type:String},
    org:{type:String},
    about:{type:String},
    feature1:{type:String},
    feature2:{type:String},
    feature3:{type:String},
    feature4:{type:String},
    feature5:{type:String},
    feature6:{type:String},
    feature7:{type:String},
    feature8:{type:String},
    distance: Number,
    feature9:{type:String},
    feature10:{type:String},
    feature11:{type:String},
    feature12:{type:String},
    feature13:{type:String},
    feature14:{type:String},
    feature15:{type:String},
    password:{type:String,required:true},
    email:{type:String,required:true},
    status:{type:String,required:true},
    Availability:{type:Array},
    isPremium:{type:Boolean},
    profilePicture: {
        data: Buffer, // Store binary image data
        contentType: String, // Store the content type (e.g., image/jpeg)
      },
      timeSlots:{type:Array},
      
},{
    versionKey:false
})

const DoctorModel = mongoose.model('doctor',DoctorSchema);

module.exports={
    DoctorModel
}
