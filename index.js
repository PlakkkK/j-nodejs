var express = require('express');
var app = express();

let PORT = process.env.PORT || 6666;

//environment variables (เรียกไฟล์ .env)
require('dotenv').config();

// เอาไว้รับค่า json
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

//database connection
var mongoose = require('mongoose');
const { Schema } = mongoose;
mongoose.Promise = global.Promise;
const uri = process.env.ATLAS_URI;
const options = {
   //    autoIndex: false, // Don't build indexes
   //    maxPoolSize: 10, // Maintain up to 10 socket connections
   //    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
   //    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
   //    family: 4, // Use IPv4, skip trying IPv6
   useNewUrlParser: true,
   useUnifiedTopology: true,
};
mongoose.connect(uri, options);
const connection = mongoose.connection;
connection.once('open', () => {
   console.log('Connected Database Successfully');
});

app.post('/user', jsonParser, function (req, res) {
   const customerSchema = new Schema({
      name: {
         type: String,
        //  required: 'Please supply a name',
         trim: true,
         required: true,
      },
      //   email: {
      //      type: String,
      //      unique: true,
      //      lowercase: true,
      //      trim: true,
      //      required: 'Please Supply an email address',
      //   },
   });
   module.exports = mongoose.models.users || mongoose.model('users', customerSchema);
   module.exports.find({}, function (err, docs) {
      if (err) {
         console.log(err);
         res.json({ status: false, message: err });
      } else {
         if (docs == null) {
            res.json({ status: false, message: 'Data not found' });
         } else {
            res.json({ status: true, message: 'success', data: docs });
         }
      }
   });
});

app.listen(PORT, function (req, res) {
   console.log('Server is started on port ', PORT);
});
