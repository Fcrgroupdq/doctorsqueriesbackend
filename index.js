const express = require("express");
const pdfMake = require("pdfmake");
const PDFDocument = require("pdfkit");
const https = require("https");


const cors = require("cors");
const { connection } = require("./db");
const { UserRoute } = require("./routes/user.route");
const { DoctorRoute } = require("./routes/doctor.route");
const { auth } = require("./middleware/auth.middleware");
const { HospitalRoute } = require("./routes/hospital.route");
const { AdminRoute } = require("./routes/admin.route");
const { ReviewRoute } = require("./routes/review.route");
const { AppointmentRoute } = require("./routes/appointment.route");
const { OtpRoute } = require("./routes/otp.route");
const { BlogRoute } = require("./routes/blog.route");
const { BannerRoute } = require("./routes/banner.route");
const { paymentRoute } = require("./routes/payment.route");

const server = express();



server.use(express.json());
// server.use(cors());
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.doctorsqueries.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  // res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
server.use(express.urlencoded({extended:true}));




// Function to fetch the logo image
function fetchImage(imageUrl, callback) {
  https.get(imageUrl, (response) => {
    let data = [];
    response.on('data', (chunk) => {
      data.push(chunk);
    });
    response.on('end', () => {
      const buffer = Buffer.concat(data);
      callback(buffer);
    });
  });
}

server.post('/api/appointments/generate-pdf', (req, res) => {
  const appointmentData = req.body;
  const doc = new PDFDocument({
    size: 'A4', // Set the page size to A4
    margin: 50, // Set margins for the content
  });

  // Pipe the PDF to the response
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=appointment-details.pdf');
  
  doc.pipe(res);

  // Fetch and insert the logo image at the top
  const logoUrl = 'https://doctorsquery.vercel.app/static/media/Logo%20Dq.c72f55a0d4f93a4b7578.png';
  fetchImage(logoUrl, (imageBuffer) => {
    doc.image(imageBuffer, 50, 50, { width: 100 }); // Adjust the coordinates and dimensions as needed
    doc.moveDown(1); // Move to the next line after the logo

    // Generate the PDF content
    doc.fontSize(12);

    // Set the color to red for the "Appointment Details" title
    doc.fillColor('red').text('Appointment Details', { align: 'center' });

    const fields = [
      { name: 'Patient Name', value: appointmentData.name },
      { name: 'Age', value: appointmentData.age },
      { name: 'Gender', value: appointmentData.gender },
      { name: 'Address', value: appointmentData.address },
      { name: 'Email', value: appointmentData.email },
      { name: 'Mobile', value: appointmentData.mobile },
      { name: 'Doctor', value: appointmentData.doctor },
      { name: 'Specialty', value: appointmentData.specilaty },
      { name: 'Appointment Date', value: appointmentData.date },
      { name: 'Reason', value: appointmentData.reason },
      { name: 'Checkup Type', value: appointmentData.checkup },
      // Change the color of the "Status" value to red
      { name: 'Status', value: appointmentData.status, isRed: true },
      { name: 'Appointment Day', value: appointmentData.appointmentDay },
      { name: 'Appointment Time', value: appointmentData.time },
      // Add more data fields as needed
    ];

    for (const field of fields) {
      if (field.isRed) {
        // Set the color to red for the "Status" value
        doc.fillColor('red').text(`${field.name}:`, { continued: true });
        doc.fillColor('black').text(` ${field.value}`);
      } else {
        doc.fillColor('black').text(`${field.name}: ${field.value}`);
      }
      
      doc.moveDown(1); // Move to the next line with a consistent spacing of 1
    }

    doc.end(); // Finish and send the PDF
  });
});



// Middleware
server.use("/banner", BannerRoute);
server.use("/user", UserRoute);
server.use("/payment",paymentRoute)

server.use("/admin", AdminRoute);
server.use("/reviews", ReviewRoute);
server.use("/doctors", DoctorRoute);
server.use("/hospital", HospitalRoute);
server.use("/appointment", AppointmentRoute);
server.use("/otp", OtpRoute);
server.use("/blog", BlogRoute);

const PORT = process.env.PORT || 8585;
server.listen(PORT, async () => {
  try {
    await connection;
    console.log("connected with the database");
    console.log(`server is running at port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
