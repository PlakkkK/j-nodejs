var express = require('express');
var app = express();

let PORT = process.env.PORT || 6666;

// เอาไว้รับค่า json
var bodyParser = require('body-parser');
// create application/json parser
var jsonParser = bodyParser.json();

//เอาไว้เข้ารหัส password
const bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt json web token เอาไว้สำหรับ object แปลงเป็น token
var jwt = require('jsonwebtoken');
var secret = 'shhhhh';

// เชื่อมต่อ database sql
// const mysql = require('mysql2');
// const connection = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    database: 'mydb',
// });

app.post('/register', jsonParser, function (req, res) {
   let email = req.body.email;
   let fname = req.body.fname;
   let lname = req.body.lname;

   bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      if (err) {
         res.json({ status: false, message: err });
      } else {
         //  connection.execute('INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)', [email, hash, fname, lname], function (err2, results, fields) {
         //     if (err2) {
         //        res.json({ status: false, message: err2 });
         //        return;
         //     } else {
         res.json({ status: true, message: 'ok' });
         //     }
         //  });
      }
   });
});

app.post('/login', jsonParser, function (req, res) {
   res.json({ status: true, message: req.body.email });
   //    connection.execute('SELECT * FROM users WHERE email=?', [req.body.email], function (err, results, fields) {
   //       if (err) {
   //          res.json({ status: false, message: err });
   //       } else {
   //          if (results.length == 0) {
   //             res.json({ status: false, message: 'user not found' });
   //          } else {
   //             bcrypt.compare(req.body.password, results[0].password, function (err2, isLogin) {
   //                if (isLogin) {
   //                   res.json({ status: true, message: 'login success', token: jwt.sign(results[0], secret, { expiresIn: '1h' }) });
   //                } else {
   //                   res.json({ status: false, message: 'login Fail' });
   //                }
   //             });
   //          }
   //       }
   //    });
});

app.post('/user', jsonParser, function (req, res) {
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
         res.json(data);
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

app.listen(PORT, function () {
   console.log('CORS-enabled web server listening on port ', PORT);
});
