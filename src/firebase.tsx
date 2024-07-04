import {initializeApp} from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDA8HAyGsfcRIRFP37a4CeMwhN5NLQeYIU",
    authDomain: "hrmanagament-b6c14.firebaseapp.com",
    projectId: "hrmanagament-b6c14",
    storageBucket: "hrmanagament-b6c14.appspot.com",
    messagingSenderId: "55444164972",
    appId: "1:55444164972:web:b515c28b1c1b65c044e349",
    databaseURL:"https://hrmanagament-b6c14-default-rtdb.firebaseio.com"
  };

  export const app = initializeApp(firebaseConfig )