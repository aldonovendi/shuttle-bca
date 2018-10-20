const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var app = express();
var firebase = require('./firebase');
// var admin = require('./firebase-admin');
var admin = require("firebase-admin");

var serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ejhail-ajah.firebaseio.com"
});
app.use(express.static(path.join(__dirname, "dist")));

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
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login-success", function (req, res) {
    // console.log('login success' + req.body.email);

    firebase.login(req, res);

    // res.send(req.body);

    firebase.auth.onAuthStateChanged(function (user) {
        if (user) {
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

app.post("/change-email", function (req, res) {
    firebase.auth.signInWithEmailAndPassword(firebase.auth.currentUser.email, req.body.password).then(function (user) {
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('print user here : ' + user.uid);

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

app.post("/change-password", function (req, res) {
    firebase.auth.signInWithEmailAndPassword(firebase.auth.currentUser.email, req.body.oldPassword).then(function (user) {
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('print user here : ' + user.uid);

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


app.post("/push-booking", function (req, res) {
    // console.log("sendmail");
    // res.send("hehe")
    // console.log('user'+firebase.auth.currentUser);
    // console.log('uid'+firebase.auth.currentUser.uid);
    var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    console.log(req.body.date.split("-"));
    console.log(firebase.auth.currentUser.uid);
    firebase.database.ref('user').child(firebase.auth.currentUser.uid).once('value').then(function (snapshot) {
        var snapshotVal = snapshot.val();
        // var nip = snapshot.val().nip;
        // var division = snapshot.val().division;
        // var program = snapshot.val().program;
        // var phone = snapshot.val().phone;
        var bookingCode = firebase.database.ref('booking-report').child(req.body.date.split("-")[2]).child(month[req.body.date.split("-")[1] - 1]).push({
            userID: firebase.auth.currentUser.uid,
            type: 'Shuttle Bus',
            from: req.body.from,
            to: req.body.to,
            date: req.body.date,
            departure: req.body.departure,
            name: snapshotVal.name,
            nip: snapshotVal.nip,
            program: snapshotVal.program,
            phoneNo: snapshotVal.phoneNo,
            email: firebase.auth.currentUser.email
        }).key;
        firebase.database.ref('user').child(firebase.auth.currentUser.uid).child('booking-history').child(bookingCode).set({
            from: req.body.from,
            to: req.body.to,
            date: req.body.date,
            departure: req.body.departure,
        });
        console.log(req.body);
        console.log(bookingCode);
        var mailOptions = {
            from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
            to: firebase.auth.currentUser.email,
            subject: "Konfirmasi Pemesanan Shuttle",
            text: 'Halo ' + '' + ',\n' +
                'Terima kasih sudah menggunakan layanan e-Shuttle.\n' +
                'Silakan tunjukkan email berikut kepada petugas shuttle.\n' +
                'Berikut data pemesanan Anda:\n\n' +
                'Tanggal Keberangkatan : ' + req.body.date + '\n' +
                'Pergi dari : ' + req.body.from + '\n' +
                'Jam Keberangkatan : ' + req.body.departure + '\n' +
                'Pulang dari : ' + req.body.to + '\n' +
                'Jam Kepulangan : 17.00\n' +
                // '<img src = "https://chart.googleapis.com/chart?cht=qr&chl=localhost:3000/verification/' + bookingCode + '&chs=180x180&choe=UTF-8&chld=L|2"> <br><br>' +
                'Terima kasih \n\nHormat kami, \nBCA Learning Institute',
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log("send email error " + error);
            // else console.log("Message sent successfully: " + info.response);
            else console.log("Message sent successfully");
        });
        console.log("sendmail success");
    }).catch(function () {
        console.log("Promise Rejected");
    });
    res.send(req.body);
});

app.post("/push-booking-admin", function (req, res) {
    // console.log("sendmail");
    // res.send("hehe")
    // console.log('user'+firebase.auth.currentUser);
    // console.log('uid'+firebase.auth.currentUser.uid);
    var day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    console.log(req.body.date.split("-"));
    // firebase.database.ref('user').child(firebase.auth.currentUser.uid).once('value').then(function (snapshot) {
    // var snapshotVal = snapshot.val();
    // var nip = snapshot.val().nip;
    // var division = snapshot.val().division;
    // var program = snapshot.val().program;
    // var phone = snapshot.val().phone;
    console.log(req.body);
    
    var bookingCode = firebase.database.ref('booking-report').child(req.body.date.split("-")[2]).child(month[req.body.date.split("-")[1] - 1]).push({
        type: req.body.type,
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        departure: req.body.departure,
        name: req.body.name,
        nip: req.body.nip,
        program: req.body.program,
        phoneNo: req.body.phoneNo,
        email: req.body.email,
    }).key;
    console.log(req.body);
    console.log(bookingCode);
    var mailOptions = {
        from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
        to: req.body.email,
        subject: "Konfirmasi Pemesanan Shuttle",
        text: 'Halo ' + '' + ',\n' +
            'Terima kasih sudah menggunakan layanan e-Shuttle.\n' +
            'Silakan tunjukkan email berikut kepada petugas shuttle.\n' +
            'Berikut data pemesanan Anda:\n\n' +
            'Tanggal Keberangkatan : ' + req.body.date + '\n' +
            'Pergi dari : ' + req.body.from + '\n' +
            'Jam Keberangkatan : ' + req.body.departure + '\n' +
            'Pulang dari : ' + req.body.to + '\n' +
            'Jam Kepulangan : 17.00\n' +
            // '<img src = "https://chart.googleapis.com/chart?cht=qr&chl=localhost:3000/verification/' + bookingCode + '&chs=180x180&choe=UTF-8&chld=L|2"> <br><br>' +
            'Terima kasih \n\nHormat kami, \nBCA Learning Institute',
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log("send email error " + error);
        // else console.log("Message sent successfully: " + info.response);
        else console.log("Message sent successfully");
    });
    console.log("sendmail success");
    res.send(req.body);
});

app.post("/send-booking-detail", function (req, res) {
    // console.log("sendmail");
    // res.send("hehe")
    console.log(req.body);
    console.log(req.body.key);
    // console.log(bookingCode);
    var mailOptions = {
        from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
        to: "aldonovendi@gmail.com",
        subject: "Konfirmasi Pemesanan Shuttle",
        text: 'Halo ' + '' + ',\n' +
            'Terima kasih sudah menggunakan layanan e-Shuttle.\n' +
            'Silakan tunjukkan email berikut kepada petugas shuttle.\n' +
            'Berikut data pemesanan Anda:\n\n' +
            'Tanggal Keberangkatan : ' + req.body.date + '\n' +
            'Pergi dari : ' + req.body.from + '\n' +
            'Jam Keberangkatan : ' + req.body.departure + '\n' +
            'Pulang dari : ' + req.body.to + '\n' +
            'Jam Kepulangan : 17.00\n' +
            // '<img src = "https://chart.googleapis.com/chart?cht=qr&chl=localhost:3000/verification/' + bookingCode + '&chs=180x180&choe=UTF-8&chld=L|2"> <br><br>' +
            'Terima kasih \n\nHormat kami, \nBCA Learning Institute',
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) console.log("send email error " + error);
        // else console.log("Message sent successfully: " + info.response);
        else console.log("Message sent successfully");
    });
    // console.log("sendmail success");
    res.send(req.body);
});

app.post("/cancel-booking", function (req, res) {
    var userID = firebase.auth.currentUser.uid;
    console.log(req.body);
    
    if(req.body.userID != undefined){
        userID = req.body.userID;
    }
    firebase.database.ref('user').child(userID).child('booking-history').child(req.body.key).remove().then(function (snapshot) {
        var bookingDate = req.body.date.split("-");
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        var bookingMonth = month[bookingDate[1]-1];
        console.log(bookingMonth + bookingDate);
        
        firebase.database.ref('booking-report').child(bookingDate[2]).child(bookingMonth).child(req.body.key).remove().then(function (snapshot) {
            console.log('[e-Shuttle][post/cancel][Success cancel]');
            res.send(req.body);
        }).catch(function (error) {
            console.log('[e-Shuttle][post/cancel][Error][' + error + ']');
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/cancel][Error][' + error + ']');
    });
});


app.post("/register-success", function (req, res) {
    // console.log("sendmail");
    // res.send("hehe")
    // console.log(req.body);
    var password = Math.random().toString(36).slice(-8);
    firebase.auth.createUserWithEmailAndPassword(
        req.body.email,
        password
    ).then(function () {
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('uid di reg user: ' + user.uid);
                firebase.database.ref('user').child(user.uid).set({
                    email: req.body.email,
                    name: req.body.name,
                    nip: req.body.nip,
                    program: req.body.program,
                    phoneNo: req.body.phoneNo
                }).catch(function () {
                    console.log("Data Invalid");
                });
                var mailOptions = {
                    from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
                    to: req.body.email,
                    subject: "Pendaftaran Akun Shuttle",
                    text: 'Halo ' + req.body.name + ',\n' +
                        'Selamat datang di BCA Learning Institute,\n' +
                        'Berikut data login Anda untuk mengakses https://e-shuttle.com agar bisa memesan shuttle:\n\n' +
                        'email : ' + req.body.email + '\n' +
                        'password : ' + password + '\n\n' +
                        'Terima kasih \n\nHormat kami, \nBCA Learning Institute'
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) console.log("send email error " + error);
                    // else console.log("Message sent successfully: " + info.response);
                    else console.log("Message sent successfully");
                });
            }
        });
        res.send(req.body);

    }).catch(function (error) {
        console.log('[e-Shuttle][login][Error][Code:' + error.code + '][' + error.message + ']');
        if(error.code == 'auth/email-already-in-use'){
            res.status(501).send('Email already in use');    
        } else{
            res.status(500).send('error');
        }
    });
    console.log("sendmail success");
});

app.post("/show-booking-list", function (req, res) {
    console.log("req ");
    res.setHeader('Content-Type', 'application/json');
    var bookingData = [];
    firebase.database.ref('user').child(firebase.auth.currentUser.uid).child('booking-history').once('value').then(function (snapshot) {
        // console.log(snapshot.val());  
        snapshot.forEach(item => {
            // console.log(item.key);
            // item.val()["key"] = item.key;

            bookingData.push({
                "key": item.key,
                "date": item.val().date,
                "from": item.val().from,
                "to": item.val().to,
                "departure": item.val().departure
            });
        });
        res.send(bookingData);
    });
});

app.post("/show-booking-report", function (req, res) {
    // console.log("req "+req.body.month);
    res.setHeader('Content-Type', 'application/json');
    var bookingData = [];
    firebase.database.ref('booking-report').child(req.body.year).child(req.body.month).once('value').then(function (snapshot) {
        // console.log(snapshot.val());  
        snapshot.forEach(item => {
            // console.log(item.key);
            // item.val()["key"] = item.key;

            bookingData.push({
                "key": item.key,
                "userID": item.val().userID,
                "name": item.val().name,
                "program": item.val().program,
                "phoneNo": item.val().phoneNo,
                "date": item.val().date,
                "from": item.val().from,
                "to": item.val().to,
                "departure": item.val().departure
            });
        });
        res.send(bookingData);
    });
});

app.post("/show-user-list", function (req, res) {
    console.log("req ");
    res.setHeader('Content-Type', 'application/json');
    var userData = [];
    firebase.database.ref('user').once('value').then(function (snapshot) {
        snapshot.forEach(item => {

            userData.push({
                "key": item.key,
                "name": item.val().name,
                "nip": item.val().nip,
                "program": item.val().program,
                "email": item.val().email
            });
        });
        res.send(userData);
    });
});

app.post("/delete-user", function (req, res) {
    // console.log(req.body.key);
    
    admin.auth().deleteUser(req.body.key);
    firebase.database.ref('user').child(req.body.key).remove().then(function (snapshot) {
        console.log('[e-Shuttle][post/delete][Success delete]');
        res.send(req.body);
    }).catch(function (error) {
        console.log('[e-Shuttle][post/delete][Error][' + error + ']');
    });
});

app.post("/forgot-password", function(req, res){
    // firebase.auth.sendPasswordResetEmail(req.body.email);
    console.log(req.body.email);
    firebase.auth.sendPasswordResetEmail(req.body.email).then(function() {
        console.log('email sent!');
        res.send(req.body);
    }).catch(function(error) {
        res.status(400);
        res.send(error);
    });
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    //   console.log(new Date());
});
