const express = require('express')
const mongoose = require('mongoose')

const HospitalSchema = mongoose.Schema({
    image:{required:true,type:String},
    name:{required:true,type:String},
    location:{required:true,type:String},
    established:{required:true,type:Number},
    beds:{required:true,type:Number},
    about:{required:true,type:String},
    features:{required:true,type:String},
    specialist:{required:true,type:String}
},{
    versionKey:false
})

const HospitalModel = mongoose.model('hospital',HospitalSchema);

module.exports = {
    HospitalModel
}