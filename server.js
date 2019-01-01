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

// const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

function changeDateFormat(date) {
    var month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    var newDate = date.split("-");
    return newDate[0] + " " + month[parseInt(newDate[1]) - 1] + " " + newDate[2];
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

var transporter = nodemailer.createTransport({
    // secureConnection: false,
    // port: 587,
    // tls: {
    //     chipers: "SSLv3"
    // },
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // type: "OAuth2",
        user: "shuttle.management.bca@gmail.com",
        pass: "pedj04ng.Ejhail"
        // clientId: "276715020350-lge2fi68gnqjhjsbsk4rhj60re6h1tqi.apps.googleusercontent.com",
        // clientSecret: "72HWnrwhKzLnVr3TH-_K0Nvn",
        // refreshToken: '1/uIVDhGILtXHZaP-j9fXh9dwQdNh0kxR2A7qqpE0F234',
        // accessToken: 'ya29.Glt0BocQw2COTigEM4KDNcDWf6eof659Y44BUFniDNe7BDzfbNlRDXfBKOm1x5NFvswl-kHxKp7C8wLQX4yzo6xMnN6h9er2L2PpN7yQEm_MgcwKOq1sieinONEc',
        // expires: 1484314697598
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
                console.log('a[e-Shuttle][check-auth-login][Unauthorize access]' + firebase.auth.currentUser.uid);
                // res.redirect('/');
            }
            else {
                console.log('login failed');
                // res.status(401).json({ message: "Auth failed!" });
            }
        }
    })

});

app.post("/change-phone-no", function (req, res) {
    firebase.auth.signInWithEmailAndPassword(firebase.auth.currentUser.email, req.body.password).then(function (user) {
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                firebase.database.ref().child("user").child(user.uid + "/phoneNo").set(req.body.phoneNo).then(function () {
                    console.log('[e-Shuttle][post/change-email][Phone No changed]')
                }).catch(function (error) {
                    console.log('[e-Shuttle][post/change-email][Error][update-database][' + error + ']');
                });
            }
            res.send(req.body);
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/change-email][Error][sign-in][' + error + ']');
        res.status(500).json({ message: 'auth failed' });
    });
});

app.post("/change-email", function (req, res) {
    firebase.auth.signInWithEmailAndPassword(firebase.auth.currentUser.email, req.body.password).then(function (user) {
        firebase.auth.onAuthStateChanged(function (user) {
            if (user) {
                user.updateEmail(req.body.email).then(function () {
                    firebase.database.ref().child("user").child(user.uid + "/email").set(req.body.email).then(function () {
                        console.log('[e-Shuttle][post/change-email][Email changed]')
                        console.log('current email: ' + firebase.auth.currentUser.email);
                    }).catch(function (error) {
                        console.log('[e-Shuttle][post/change-email][Error][update-database][' + error + ']');
                    });
                }).catch(function (error) {
                    console.log('[e-Shuttle][post/change-email][Error][update-email][' + error + ']');
                    res.status(400).json({ message: 'change email failed' });
                });
            }
            res.send(req.body);
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/change-email][Error][sign-in][' + error + ']');
        res.status(500).json({ message: 'auth failed' });
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
                    res.status(400).json({ message: 'lost connection' });
                });
            }
            res.send(req.body);
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/change-password][Error][sign-in][' + error + ']');
        res.status(500).json({ message: 'auth failed' });
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
    var date = req.body.date.split("-");
    var dateKey = date[2] + date[1] + date[0];
    firebase.database.ref('user').child(firebase.auth.currentUser.uid).child('booking-history').child(dateKey).once('value').then(function (snapshot) {
        if (snapshot.exists()) {
            res.status(500).json({ message: 'booking already exist' });
        } else {
            firebase.database.ref('user').child(firebase.auth.currentUser.uid).once('value').then(function (snapshot) {
                var snapshotVal = snapshot.val();
                // var nip = snapshot.val().nip;
                // var division = snapshot.val().division;
                // var program = snapshot.val().program;
                // var phone = snapshot.val().phone;

                var bookingCode = firebase.database.ref('booking-report').child('Shuttle Bus').child(req.body.from).child(date[2]).child(month[date[1] - 1]).child(date[0]).child(firebase.auth.currentUser.uid).set({
                    // var bookingCode = firebase.database.ref('booking-report').child('Shuttle Bus').child(req.body.date.split("-")[2]).child(month[req.body.date.split("-")[1] - 1]).child(req.body.from).push({
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
                firebase.database.ref('user').child(firebase.auth.currentUser.uid).child('booking-history').child(dateKey).set({
                    from: req.body.from,
                    to: req.body.to,
                    date: req.body.date,
                    departure: req.body.departure,
                    type: 'Shuttle Bus'
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
                        'Tanggal Keberangkatan : ' + changeDateFormat(req.body.date) + '\n' +
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
            }).catch(function () {
                console.log("Promise Rejected a");
            });
        }
    }).catch(function () {
        console.log("Promise Rejected b");
    });


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

    var bookingCode = firebase.database.ref('booking-report').child(req.body.type).child(req.body.from).child(req.body.date.split("-")[2]).child(month[req.body.date.split("-")[1] - 1]).child(req.body.date.split("-")[0]).push({
        from: req.body.from,
        type: req.body.type,
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
            'Tanggal Keberangkatan : ' + changeDateFormat(req.body.date) + '\n' +
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
    console.log(firebase.auth.currentUser.email);
    // console.log(bookingCode);
    var mailOptions = {
        from: "'Shuttle Management' <shuttle.management.bca@gmail.com>",
        to: firebase.auth.currentUser.email,
        subject: "Konfirmasi Pemesanan Shuttle",
        text: 'Halo ' + req.body.name + ',\n' +
            'Terima kasih sudah menggunakan layanan e-Shuttle.\n' +
            'Silakan tunjukkan email berikut kepada petugas shuttle.\n' +
            'Berikut data pemesanan Anda:\n\n' +
            'Tanggal Keberangkatan : ' + changeDateFormat(req.body.date) + '\n' +
            'Pergi dari : ' + req.body.from + '\n' +
            'Jam Keberangkatan : ' + req.body.departure + '\n' +
            'Pulang dari : ' + req.body.to + '\n' +
            'Jam Kepulangan : 17.00\n' +
            // '<img src = "https://chart.googleapis.com/chart?cht=qr&chl=localhost:3000/verification/' + bookingCode + '&chs=180x180&choe=UTF-8&chld=L|2"> <br><br>' +
            'Terima kasih \n\nHormat kami, \nBCA Learning Institute',
        // auth: {
        //     user: 'shuttle.management.bca@gmail.com',
        //     refreshToken: '1/uIVDhGILtXHZaP-j9fXh9dwQdNh0kxR2A7qqpE0F234',
        //     accessToken: 'ya29.Glt0BocQw2COTigEM4KDNcDWf6eof659Y44BUFniDNe7BDzfbNlRDXfBKOm1x5NFvswl-kHxKp7C8wLQX4yzo6xMnN6h9er2L2PpN7yQEm_MgcwKOq1sieinONEc',
        //     expires: 1484314697598
        // }
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

    if (req.body.userID != undefined) {
        userID = req.body.userID;
    }

    var bookingDate = req.body.date.split("-");
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var bookingMonth = month[bookingDate[1] - 1];
    userBookingListKey = bookingDate[2] + bookingDate[1] + bookingDate[0];

    firebase.database.ref('user').child(userID).child('booking-history').child(userBookingListKey).remove().then(function (snapshot) {
        firebase.database.ref('booking-report').child(req.body.type).child(req.body.from).child(bookingDate[2]).child(bookingMonth).child(bookingDate[0]).child(userID).remove().then(function (snapshot) {
            console.log('[e-Shuttle][post/cancel][Success cancel]');
            res.status(200).send('cancel success');
        }).catch(function (error) {
            console.log('[e-Shuttle][post/cancel][Error][' + error + ']');
            res.status(500).send('cancel at booking-report failed');
        });
    }).catch(function (error) {
        console.log('[e-Shuttle][post/cancel][Error][' + error + ']');
        res.status(500).send('cancel at user/booking-history failed');
    });
});

app.post("/register-success", function (req, res) {
    // console.log("sendmail");
    // res.send("hehe")
    // console.log(req.body);
    var password = Math.random().toString(36).slice(-8);
    admin.auth().createUser({
        email: req.body.email,
        password: password
    }).then(function (user) {
        // firebase.auth.onAuthStateChanged(function (user) {
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
                if (error) {
                    console.log("send email error " + error);
                    res.status(500).send("register failed");
                } else {
                    console.log("Message sent successfully" + info);
                    res.status(200).send("register success");
                }
            });
        }
        // });
    }).catch(function (error) {
        console.log('[e-Shuttle][login][Error][Code:' + error.code + '][' + error.message + ']');
        if (error.code == 'auth/email-already-in-use') {
            res.status(501).send('Email already in use');
        } else {
            res.status(500).send('error');
        }
    });
});

app.post("/add-shuttle-point", function (req, res) {
    console.log(JSON.stringify(req.body));
    var imgName = req.body.name.toLowerCase().replace(" ", "-");
    
    firebase.database.ref('shuttle-points').child(req.body.name).set({
        name: req.body.name,
        departure: req.body.departure,
        img: '../assets/img/maps/' + imgName + '.jpg',
        lat: req.body.lat,
        lng: req.body.lng,
        position: req.body.position,
    });
    res.send(req.body);
});

app.post("/delete-shuttle-point", function (req, res) {
    firebase.database.ref('shuttle-points').child(req.body.name).remove().then(function (snapshot) {
        console.log('[e-Shuttle][post/delete][Success delete]');
        res.status(200).send('delete shuttle point success');
    }).catch(function (error) {
        console.log('[e-Shuttle][post/delete][Error][' + error + ']');
        res.status(500).send('delete shuttle point failed');
    });
});

app.post("/show-booking-list", function (req, res) {
    console.log("req ");
    res.setHeader('Content-Type', 'application/json');
    var bookingData = [];
    var today = new Date();
    var todayKey = today.getFullYear() + "" + (today.getMonth() + 1) + "" + today.getDate() + "";
    firebase.database.ref('user').child(firebase.auth.currentUser.uid).child('booking-history').orderByKey().limitToLast(10).once('value').then(function (snapshot) {
        // console.log(snapshot.val());  
        snapshot.forEach(item => {
            // console.log(item.key);
            // item.val()["key"] = item.key;
            if (+item.key >= +todayKey) {
                bookingData.push({
                    "key": item.key,
                    "date": item.val().date,
                    "from": item.val().from,
                    "to": item.val().to,
                    "departure": item.val().departure,
                    "type": item.val().type
                });
            }

        });
        res.send(bookingData);
    });
});

app.post("/show-booking-report", function (req, res) {
    // console.log("req "+req.body.month);
    res.setHeader('Content-Type', 'application/json');
    var bookingData = [];

    firebase.database.ref('booking-report').child(req.body.type).child(req.body.assemblyPoint).child(req.body.year).child(req.body.month).child(req.body.date).once('value').then(function (snapshot) {
        snapshot.forEach(item => {
            bookingData.push({
                "key": item.key,
                "userID": item.val().userID,
                "name": item.val().name,
                "nip": item.val().nip,
                "program": item.val().program,
                "phoneNo": item.val().phoneNo,
                "date": item.val().date,
                "from": item.val().from,
                "to": item.val().to,
                "departure": item.val().departure,
                "type": item.val().type
            });
        });
        console.log('aaab');
        console.log('aaa' + bookingData);
        res.send(bookingData);
    });
});

app.post('/get-passenger-count', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var passengerList = []
    var passengerCount = new Array(5).fill(0);
    firebase.database.ref('booking-report/Shuttle Bus').once('value').then(function (snapshot) {
        snapshot.forEach(item => {
            if (item.val()['2018']['December']['17'] != null) {
                passengerCount[0] = Object.keys(item.val()['2018']['December']['17']).length;
            }
            if (item.val()['2018']['December']['18'] != null) {
                passengerCount[1] = Object.keys(item.val()['2018']['December']['18']).length;
            }
            if (item.val()['2018']['December']['19'] != null) {
                passengerCount[2] = Object.keys(item.val()['2018']['December']['19']).length;
            }
            if (item.val()['2018']['December']['20'] != null) {
                passengerCount[3] = Object.keys(item.val()['2018']['December']['20']).length;
            }
            if (item.val()['2018']['December']['21'] != null) {
                passengerCount[4] = Object.keys(item.val()['2018']['December']['21']).length;
            }
            passengerList.push({
                'assemblyPoint': item.key,
                'passengerCountDay1': passengerCount[0],
                'passengerCountDay2': passengerCount[1],
                'passengerCountDay3': passengerCount[2],
                'passengerCountDay4': passengerCount[3],
                'passengerCountDay5': passengerCount[4],
            });
        });
        // console.log("pass count: " + snapshot.numChildren());
        // passengerList.push({
        //     'assemblyPoint': 'Wisma Asia',
        //     'passengerCount': snapshot.numChildren()
        // });
        // passengerList.push({
        //     'assemblyPoint': 'Wisma Asia',
        //     'passengerCount': snapshot.numChildren()
        // });
        // passengerList.push({
        //     'assemblyPoint': 'Wisma Asia',
        //     'passengerCount': snapshot.numChildren()
        // });
        res.send(passengerList);
    }).catch(function (error) {
        console.log('[e-Shuttle][post/get-count][Error][' + error + ']');
        res.status(500).send("get passenger count error");
    });
});

app.post("/download-booking-report", function (req, res) {
    // console.log("req "+req.body.month);
    res.setHeader('Content-Type', 'application/json');
    var bookingData = [];
    var bookingDataPerPoint = [];
    var i = 0;

    firebase.database.ref('booking-report').child('Shuttle Bus').once('value').then(function (snapshot) {
        // console.log('snapshot: ' + JSON.stringify(snapshot));

        var dataSize = snapshot.numChildren();
        console.log("data size : " + dataSize);

        snapshot.forEach(dataByPoint => {
            var wait = true;
            dataByMonth = dataByPoint.val()[req.body.year][req.body.month];
            i++;
            if (dataByMonth != null) {
                Object.keys(dataByMonth).forEach(function (key) {
                    dataByDay = dataByMonth[key];
                    // console.log('bookingData: ' + JSON.stringify(dataBy/Day));

                    Object.keys(dataByDay).forEach(function (key) {
                        bookingDetail = dataByDay[key];
                        // console.log('bookingData: ' + JSON.stringify(bookingDetail));

                        bookingData.push({
                            // "key": key,
                            "userID": bookingDetail.userID,
                            "name": bookingDetail.name,
                            "nip": bookingDetail.nip,
                            "program": bookingDetail.program,
                            "phoneNo": bookingDetail.phoneNo,
                            "date": bookingDetail.date,
                            "from": bookingDetail.from,
                            // "to": bookingDetail.to,
                            // "departure": bookingDetail.departure,
                            // "type": bookingDetail.type
                        });
                    });
                });
            }
            bookingDataPerPoint.push(bookingData);
            if (i == dataSize) {
                res.send(bookingDataPerPoint);
            }
            bookingData = [];
        });
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

app.post("/forgot-password", function (req, res) {
    // firebase.auth.sendPasswordResetEmail(req.body.email);
    console.log(req.body.email);
    firebase.auth.sendPasswordResetEmail(req.body.email).then(function () {
        console.log('email sent!');
        res.send(req.body);
    }).catch(function (error) {
        res.status(400);
        res.send(error);
    });
});

app.post("/get-shuttle-point-detail", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var bookingData = [];
    firebase.database.ref('shuttle-points').child(req.body.shuttleName).once('value').then(function (snapshot) {
        res.send(snapshot.val());
    });
});

app.post("/get-user-detail", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var userData = {
        name: '',
        nip: '',
        program: '',
        phoneNo: '',
        email: ''
    }

    firebase.database.ref('user').child(firebase.auth.currentUser.uid).once('value').then(function (snapshot) {
        userData.name = snapshot.val().name;
        userData.nip = snapshot.val().nip;
        userData.program = snapshot.val().program;
        userData.phoneNo = snapshot.val().phoneNo;
        userData.email = snapshot.val().email;
        res.send(userData);
    });
});

app.post("/update-user-data", function (req, res) {
    console.log(JSON.stringify(req.body));
    
    firebase.database.ref('user').child(req.body.name).set({
        name: req.body.name,
        nip: req.body.nim,
        program: req.body.program,
        phoneNo: req.body.phoneNo,
        email: req.body.email
    });
    res.send(req.body);
});

app.listen(port, () => {
    // console.log(`Server running at http://${hostname}:${port}/`);
    //   console.log(new Date());
});
