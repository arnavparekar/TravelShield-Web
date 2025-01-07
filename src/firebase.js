import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAUxy6OISsmBJqxZb9L4gnaZtmZ20epvP0",
    authDomain: "travelshield-903aa.firebaseapp.com",
    projectId: "travelshield-903aa",
    storageBucket: "travelshield-903aa.firebasestorage.app",
    messagingSenderId: "879350140169",
    appId: "1:879350140169:web:346446d3dd3e3b91a657d8",
    measurementId: "G-39V7PNVK26"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
export { auth, app }; 

