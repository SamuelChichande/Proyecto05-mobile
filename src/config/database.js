"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child, update } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const saveUser = (name, address, password, rating, tripCount) => {
    const userRef = ref(database, "users/");
    const newUserRef = push(userRef);

    return set(newUserRef, {
        name,
        address,
        password,
        rating,
        tripCount
    })
    .then(() => ({ status: "success", message: "User saved successfully." }))
    .catch(error => ({ status: "error", message: error?.message || String(error) }));
};

let getUsers = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `users/`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return { status: "success", data: snapshot.val() };
            } else {
                return { status: "empty", message: "No hay datos" };
            }
        })
        .catch((error) => {
            console.error("Error getting users:", error);
            return { status: "error", message: error?.message || String(error) };
        });
};

let getUserById = async (userId) => {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
        return { status: "error", message: "Se requiere un ID de usuario válido" };
    }
    try {
        const dbRef = ref(getDatabase());
        const userPath = `users/${userId}`;
        const snapshot = await get(child(dbRef, userPath));
        if (snapshot.exists()) {
            return { status: "success", data: { id: userId, ...snapshot.val() } };
        } else {
            return { status: "not_found", message: `Usuario con ID "${userId}" no encontrado` };
        }
    } catch (error) {
        console.error(`Error getting user ${userId}:`, error);
        return { status: "error", message: error?.message || String(error), code: error?.code || null };
    }
};

let saveTrip = async (origin, destination, date, time, timeTravel, seats, car, price, userId, passengersID) => {
    const tripRef = ref(database, "trips/");
    const newTripRef = push(tripRef);

    return set(newTripRef, {
        origin,
        destination,
        date,
        time,
        timeTravel,
        seats,
        car,
        price,
        userId,
        passengersID: passengersID || [] // Aseguramos que sea un array
    })
    .then(() => ({ status: "success", message: "Trip saved successfully." }))
    .catch(error => ({ status: "error", message: error?.message || String(error) }));
}

let getTrips = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `trips/`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return { status: "success", data: snapshot.val() };
            } else {
                return { status: "empty", message: "No hay datos" };
            }
        })
        .catch((error) => {
            console.error("Error getting trips:", error);
            return { status: "error", message: error?.message || String(error) };
        });
}

let joinTrip = async (tripId, passengerId) => {
    try {
        const tripRef = ref(database, `trips/${tripId}`);
        const snapshot = await get(tripRef);

        if (snapshot.exists()) {
            const trip = snapshot.val();
            let passengers = trip.passengersID || [];
            const totalSeats = parseInt(trip.seats);

            if (passengers.length >= totalSeats) {
                return { status: "error", message: "Lo sentimos, el viaje se llenó justo ahora." };
            }

            if (passengers.includes(passengerId)) {
                return { status: "error", message: "Ya estás registrado en este viaje." };
            }

            passengers.push(passengerId);
            
            await update(tripRef, { passengersID: passengers });
            
            return { status: "success", message: "Reserva exitosa" };
        } else {
            return { status: "error", message: "El viaje no existe." };
        }
    } catch (error) {
        return { status: "error", message: error?.message || String(error) };
    }
};

let getTripById = async (tripId) => {
    try {
        const dbRef = ref(getDatabase());
        const snapshot = await get(child(dbRef, `trips/${tripId}`));
        
        if (snapshot.exists()) {
            return { status: "success", data: { id: tripId, ...snapshot.val() } };
        } else {
            return { status: "error", message: "Viaje no encontrado" };
        }
    } catch (error) {
        return { status: "error", message: error?.message || String(error) };
    }
};

export { saveUser, getUsers, getUserById, saveTrip, getTrips, joinTrip, getTripById};
