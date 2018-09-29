const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var app = express();
var firebase = require('./firebase');
app.use(express.static(path.join(__dirname,"dist")));

const hostname = '127.0.0.1';
const port = 3000;

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

var transporter = nodemailer.createTransport({
    // host: "smtp-mail.outlook.com",
    secureConnection: false,
    port: 587,
    tls: {
        chipers: "SSLv3"
    },
    service: 'gmail',
    auth: {
        user: "shuttle.management.bca@gmail.com",
        pass: "pedj04ng.Ejhail"
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.post("/login-success", function(req,res){
    // console.log('login success' + req.body.email);
    
    firebase.login(req, res);
    
    // res.send(req.body);
    
    firebase.auth.onAuthStateChanged(function(user){
        if(user){
            if (firebase.auth.currentUser != null) {
                console.log('[e-Shuttle][check-auth-login][Unauthorize access]' + firebase.auth.currentUser.uid);
                // res.redirect('/');
            }
            else {
                console.log('login failed');
                // res.status(401).json({ message: "Auth failed!" });
            }
        }
    })
    
});

app.post("/change-email", function(req,res){
    firebase.auth.signInWithEmailAndPassword(firebase.auth.currentUser.email, req.body.password).then(function (user) {
        firebase.auth.onAuthStateChanged(function(user){
            if(user){
                console.log('print user here : ' +user.uid);
                
                user.updateEmail(req.body.email).then(function () {
                    firebase.database.ref().child("user").child(user.uid + "/email").set(req.body.email).then(function () {
                        console.log('[e-Shuttle][post/change-email][Email changed]')
                    }).catch(function (error) {
                        console.log('[e-Shuttle][post/change-email][Error][update-database][' + error + ']');
                    });
                }).catch(function (error) {
                    console.log('[e-Shuttle][post/change-email][Error][update-email][' + error + ']');
                    res.status(500).json({ message: 'failed' });
                });
            }
            res.send(req.body);
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/change-email][Error][sign-in][' + error + ']');
        res.status(500).json({ message: 'failed' });
    });
    
});

app.post("/change-password", function(req,res){
    firebase.auth.signInWithEmailAndPassword(firebase.auth.currentUser.email, req.body.oldPassword).then(function (user) {
        firebase.auth.onAuthStateChanged(function(user){
            if(user){
                console.log('print user here : ' +user.uid);
                
                user.updatePassword(req.body.newPassword).then(function () {
                    console.log('[e-Shuttle][post/change-password][Password changed]');
                }).catch(function (error) {
                    console.log('[e-Shuttle][post/change-email][Error][update-password][' + error + ']');
                    res.status(500).json({ message: 'failed' });
                });
            }
            res.send(req.body);
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/change-password][Error][sign-in][' + error + ']');
        res.status(500).json({ message: 'failed' });
    });
    
});


app.post("/push-booking", function(req, res){
    // console.log("sendmail");
    // res.send("hehe")
    // console.log('user'+firebase.auth.currentUser);
    // console.log('uid'+firebase.auth.currentUser.uid);
    
    var bookingCode = firebase.database.ref('booking').push({
        // userID: firebase.auth.currentUser.uid,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
    }).key;
    console.log(req.body);
    console.log(bookingCode);
    var mailOptions = {
        from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
        to: "aldonovendi@gmail.com",
        subject: "Konfirmasi Pemesanan Shuttle",
        text: 'Halo ' + '' + ',\n' +
        'Terima kasih sudah menggunakan layanan e-Shuttle.\n' +
        'Silakan tunjukkan email berikut kepada petugas shuttle.\n' +
        'Berikut data pemesanan Anda:\n\n' +
        'Rute : ' + req.body.from + ' - ' + req.body.to + '\n' +
        'Tanggal Keberangkatan : ' + req.body.date + '\n' +
        'Jam Keberangkatan : ' + 'snapshot.val().departure' + '\n' +
        // '<img src = "https://chart.googleapis.com/chart?cht=qr&chl=localhost:3000/verification/' + bookingCode + '&chs=180x180&choe=UTF-8&chld=L|2"> <br><br>' +
        'Terima kasih \n\nHormat kami, \nBCA Learning Institute',
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) console.log("send email error " + error);
        // else console.log("Message sent successfully: " + info.response);
        else console.log("Message sent successfully");
    });
    // console.log("sendmail success");
    res.send(req.body);
});

app.post("/send-booking-detail", function(req, res){
    // console.log("sendmail");
    // res.send("hehe")
    console.log(req.body);
    console.log(bookingCode);
    var mailOptions = {
        from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
        to: "aldonovendi@gmail.com",
        subject: "Konfirmasi Pemesanan Shuttle",
        text: 'Halo ' + '' + ',\n' +
        'Terima kasih sudah menggunakan layanan e-Shuttle.\n' +
        'Silakan tunjukkan email berikut kepada petugas shuttle.\n' +
        'Berikut data pemesanan Anda:\n\n' +
        'Rute : ' + req.body.from + ' - ' + req.body.to + '\n' +
        'Tanggal Keberangkatan : ' + req.body.date + '\n' +
        'Jam Keberangkatan : ' + 'snapshot.val().departure' + '\n' +
        // '<img src = "https://chart.googleapis.com/chart?cht=qr&chl=localhost:3000/verification/' + bookingCode + '&chs=180x180&choe=UTF-8&chld=L|2"> <br><br>' +
        'Terima kasih \n\nHormat kami, \nBCA Learning Institute',
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) console.log("send email error " + error);
        // else console.log("Message sent successfully: " + info.response);
        else console.log("Message sent successfully");
    });
    // console.log("sendmail success");
    res.send(req.body);
});

app.post("/register-success", function(req, res){
    // console.log("sendmail");
    // res.send("hehe")
    // console.log(req.body);
    var password = Math.random().toString(36).slice(-8);
    firebase.auth.createUserWithEmailAndPassword(
        req.body.email,
        password
    ).then(function () {
        firebase.auth.onAuthStateChanged(function(user){
            if(user){
                console.log('uid di reg user: ' + user.uid);
                firebase.database.ref('user').child(user.uid).set({
                    email: req.body.email,
                    name: req.body.name,
                    nip: req.body.nip,
                    division: req.body.division,
                    program: req.body.program
                });
                var mailOptions = {
                    from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
                    to: req.body.email,
                    subject: "Pendaftaran Akun Shuttle",
                    text: 'Halo ' + req.body.name + ',\n' +
                    'Selamat datang di <b>BCA Learning Institute</b>,\n' +
                    'Berikut data login Anda untuk mengakses https://e-shuttle.com agar bisa memesan shuttle:\n\n' +
                    'email : ' + req.body.email + '\n' +
                    'password : ' + password + '\n\n' +
                    'Terima kasih \n\nHormat kami, \nBCA Learning Institute'
                };
                
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) console.log("send email error " + error);
                    // else console.log("Message sent successfully: " + info.response);
                    else console.log("Message sent successfully");
                });
            }
        })
        
    }).catch(function (error) {
        console.log('[e-Shuttle][login][Error][Code:' + error.code + '][' + error.message + ']');
        res.status(500).json({ message: "Create user failed!" });
    });
    // console.log("sendmail success");
    res.send(req.body);
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
//   console.log(new Date());
});
