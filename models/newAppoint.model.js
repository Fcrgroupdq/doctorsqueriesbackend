const mongoose = require('mongoose');
const newAppointSchema = mongoose.Schema({
    doctor:{type:"String"}
})

const newAppointmentModel = mongoose.model('newAppointment',newAppointSchema)

module.exports = {
    newAppointmentModel
}