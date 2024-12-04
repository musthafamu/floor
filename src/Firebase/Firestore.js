import { initializeApp } from "firebase/app";
import { 
    getFirestore, 
    collection, 
    getDocs ,onSnapshot
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBMJ3Gftls31fGKOoAN1UiKLeA9XZcKELg",
    authDomain: "einen-box2023.firebaseapp.com",
    databaseURL: "https://einen-box2023-default-rtdb.firebaseio.com",
    projectId: "einen-box2023",
    storageBucket: "einen-box2023.firebasestorage.app",
    messagingSenderId: "551456977105",
    appId: "1:551456977105:web:eae2ee388aac9e53d155f0",
    measurementId: "G-FRNZRCYD7F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch data from Firebase Firestore
export const getBuildingDetails = async () => {
    try {
        const buildingNamesRef = collection(db, 'buildingNames');
        const buildingNamesSnapshot = await getDocs(buildingNamesRef);
        const buildingNames = buildingNamesSnapshot.docs.map(doc => doc.data())[0];
        
        let allBuildingData = [];
        
        // Loop through each building name and fetch its data
        for (let name of buildingNames?.Names || []) {
            const buildDataRef = collection(db, name);
            const buildDataSnapshot = await getDocs(buildDataRef);
            let buildingData = buildDataSnapshot.docs.map(doc => doc.data());
            allBuildingData.push({ name, data: buildingData });
        }
        
        console.log("Building Data:", allBuildingData);
        return allBuildingData;
    } catch (error) {
        console.error("Error fetching building details:", error);
    }
};
export { db, collection, getDocs,onSnapshot };