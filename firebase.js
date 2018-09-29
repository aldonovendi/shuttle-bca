var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/database');
var firebaseClient = require('firebase');
var firebaseInit = firebase.initializeApp({
    apiKey: "AIzaSyD2ij-mxxh-EOGuP17x1FAgS3OJ5cB9Ous",
    authDomain: "ejhail-ajah.firebaseapp.com",
    databaseURL: "https://ejhail-ajah.firebaseio.com",
    projectId: "ejhail-ajah",
    storageBucket: "ejhail-ajah.appspot.com",
    messagingSenderId: "237361034617"
})

const database = firebase.database();
const auth = firebase.auth();

// auth.onAuthStateChanged(function (user) {
//     console.log('[e-Shuttle][onAuthStateChanged][Auth state changed]');
//     if(user){
         
//     }
// });

exports.database = database;
exports.auth = auth;

exports.login = function (req, res) {
    console.log(req.body);
    var userEmail = req.body.email;
    var userPass = req.body.password;
    auth.signInWithEmailAndPassword(userEmail, userPass).then(function (user) {
        if (user) {
            console.log('[e-Shuttle][login][User logged in]');
            console.log('[e-Shuttle][UID:'+user.uid+'][Email:'+user.email+']');
            res.send({
                redirect: '/'
            });
        } else {
            console.log('[e-Shuttle][login][Error][No user is signed in]');
            // res.status(401).json({ message: "Auth failed!" });
        }
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('[e-Shuttle][login][Error][Code:' + errorCode + '][' + errorMessage + ']');
        res.status(500).json({ message: "Auth failed!" });
    });
    // auth.onAuthStateChanged(function (user) {
    //     console.log('here [e-Shuttle][onAuthStateChanged][Auth state changed]');
    //     if(user){
    //         console.log('user found [e-Shuttle][UID:'+user.uid+'][Email:'+user.email+']');
    //     }
    // });
};

exports.logout = function (req, res) {
    auth.signOut().then(function () {
        console.log('[e-Shuttle][logout][User logged out]');
        res.send({
            redirect: '/'
        });
    }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('[e-Shuttle][logout][Error][Code:' + errorCode + '][' + errorMessage + ']');
    })
}