var express = require('express');
var app = express();

let PORT = process.env.PORT || 6666;

//เอาไว้เข้ารหัส password
const bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt json web token เอาไว้สำหรับ object แปลงเป็น token
var jwt = require('jsonwebtoken');
var secret = 'shhhhh';

// เอาไว้รับค่า json
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

const { MongoClient } = require('mongodb');
// Replace the uri string with your connection string.
const uri = 'mongodb+srv://root:Rmutpcpe1@cluster0.b23ov.mongodb.net?retryWrites=true&w=majority';
const client = new MongoClient(uri);
const database = client.db('resume');

app.get('/', (req, res) => {
   res.send('Hello, I am Working');
});

app.post('/login', jsonParser, async function (req, res) {
   try {
      const users = database.collection('users');
      const user = await users.findOne({ email: req.body.email });
      if (user) {
         bcrypt.compare(req.body.password, user.password, function (err2, isLogin) {
            if (isLogin) {
               res.json({ status: true, message: 'login success', token: jwt.sign(user, secret, { expiresIn: '1h' }) });
            } else {
               res.json({ status: false, message: 'login Fail' });
            }
         });
      } else {
         res.json({ status: false, message: 'user not found.' });
      }
   } catch (err) {
      res.json({ status: false, message: err });
   }
});

app.post('/user', jsonParser, async function (req, res) {
   try {
      const token = req.headers.authorization;
      if (token) {
         const decoded = jwt.verify(token.split(' ')[1], secret);
         const data = {
            id: decoded.id,
            email: decoded.email,
            fname: decoded.fname,
            lname: decoded.lname,
         };
         res.json({ status: true, message: 'ok', data });
      } else {
         res.json({ status: false, message: 'Token is not define' });
      }
   } catch (err) {
      if (err.name == 'TokenExpiredError') {
         res.json({ status: false, message: 'Token expired' });
      } else {
         res.json({ status: false, message: err.message });
      }
   }
});

app.post('/register', jsonParser, async (req, res) => {
   bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      if (err) {
         res.json({ status: false, message: err });
      } else {
         try {
            const users = database.collection('users');
            const user = await users.findOne({ email: req.body.email });
            if (user) {
               res.json({ status: false, message: 'email duiplicate' });
            } else {
               const insert_user = await users.insertOne({
                  email: req.body.email,
                  fname: req.body.fname,
                  lname: req.body.lname,
                  password: hash,
                  create_date: new Date(),
               });
               res.json({ status: true, message: 'ok', data: insert_user });
            }
         } catch (err) {
            res.json({ status: false, message: err });
         }
      }
   });
});

app.listen(PORT, function (req, res) {
   console.log('Server is started on port ', PORT);
});
