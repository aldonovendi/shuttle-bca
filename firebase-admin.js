// var admin = require('firebase-admin');

// // var serviceAccount = require('path/to/serviceAccountKey.json');

// admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: 'ejhail-ajah',
//       clientEmail: 'firebase-adminsdk-y4a93@ejhail-ajah.iam.gserviceaccount.com',
//       privateKey: '-----BEGIN PRIVATE KEY-----\n<KEY>\n-----END PRIVATE KEY-----\n'
//     }),
//     databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
//   });
  

var admin = require("firebase-admin");

var serviceAccount = require("./path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ejhail-ajah.firebaseio.com"
});


exports.admin = admin;

