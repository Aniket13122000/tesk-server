const firebase = require('firebase/compat/app');
  require('firebase/compat/auth');
  require('firebase/compat/analytics')
  require('firebase/compat/firestore');

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDLpWGmsTpq-u217pyGWqvCCxm7V9-MIfo",
    authDomain: "tryy-9a316.firebaseapp.com",
    projectId: "tryy-9a316",
    storageBucket: "tryy-9a316.appspot.com",
    messagingSenderId: "414619222593",
    appId: "1:414619222593:web:9e70640a9a9b9aa477bcc0"
  };
   
const firebaseApp=firebase.initializeApp(firebaseConfig);
 const db=firebase.firestore();
  const auth =firebaseApp.auth();
module.exports={db,auth}

