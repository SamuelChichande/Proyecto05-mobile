"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, set, push, get, child, update, remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";


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

// Método para que un pasajero elimine su reserva de un viaje
let cancelTripReservation = async (tripId, passengerId) => {
    try {
        const tripRef = ref(database, `trips/${tripId}`);
        const snapshot = await get(tripRef);

        if (snapshot.exists()) {
            const trip = snapshot.val();

            // Validar que el viaje no haya pasado
            const tripDate = new Date(`${trip.date}T${trip.time || trip.timeTravel}`);
            const currentDate = new Date();

            if (tripDate < currentDate) {
                return { status: "error", message: "No puedes cancelar reservas de viajes que ya han pasado." };
            }

            // Verificar si el pasajero está registrado
            let passengers = trip.passengersID || [];

            if (!passengers.includes(passengerId)) {
                return { status: "error", message: "No estás registrado en este viaje." };
            }

            // Eliminar al pasajero del array
            const updatedPassengers = passengers.filter(id => id !== passengerId);

            // Actualizar el viaje
            await update(tripRef, { passengersID: updatedPassengers });

            return {
                status: "success",
                message: "Reserva cancelada exitosamente",
                data: { tripId, passengerId }
            };
        } else {
            return { status: "error", message: "El viaje no existe." };
        }
    } catch (error) {
        return { status: "error", message: error?.message || String(error) };
    }
};

// Método para que el conductor elimine un viaje publicado
let deleteTrip = async (tripId, userId) => {
    console.log("Intentando eliminar viaje:", tripId, "Usuario:", userId);
    
    try {
        const tripRef = ref(database, `trips/${tripId}`);
        console.log("Referencia creada:", tripRef.toString());
        
        const snapshot = await get(tripRef);
        console.log("Snapshot existe?", snapshot.exists());
        
        if (snapshot.exists()) {
            const trip = snapshot.val();
            console.log("Datos del viaje:", trip);
            
            // ... validaciones ...
            
            console.log("Eliminando viaje...");
            await set(tripRef, null);
            // o await remove(tripRef);
            
            console.log("Viaje eliminado aparentemente");
            
            // Verificar que se eliminó
            const checkSnapshot = await get(tripRef);
            console.log("Verificación post-eliminación existe?", checkSnapshot.exists());
            
            return { 
                status: "success", 
                message: "Viaje eliminado exitosamente",
                data: { tripId }
            };
        }
        // ... resto del código
    } catch (error) {
        console.error("Error completo:", error);
        return { status: "error", message: error?.message || String(error) };
    }
};

// Método para que el conductor cancele un viaje con pasajeros
let cancelTripWithPassengers = async (tripId, userId) => {
    try {
        const tripRef = ref(database, `trips/${tripId}`);
        const snapshot = await get(tripRef);

        if (snapshot.exists()) {
            const trip = snapshot.val();

            // Verificar que el usuario sea el conductor
            if (trip.userId !== userId) {
                return { status: "error", message: "Solo el conductor puede cancelar este viaje." };
            }

            // Validar que el viaje no haya pasado
            const tripDate = new Date(`${trip.date}T${trip.time || trip.timeTravel}`);
            const currentDate = new Date();

            if (tripDate < currentDate) {
                return { status: "error", message: "No puedes cancelar viajes que ya han pasado." };
            }

            // Marcar el viaje como cancelado y notificar a pasajeros
            await update(tripRef, {
                status: "cancelled",
                cancelledAt: new Date().toISOString(),
                cancelledBy: userId
            });

            return {
                status: "success",
                message: "Viaje cancelado. Los pasajeros han sido notificados.",
                data: {
                    tripId,
                    passengersCount: trip.passengersID?.length || 0
                }
            };
        } else {
            return { status: "error", message: "El viaje no existe." };
        }
    } catch (error) {
        return { status: "error", message: error?.message || String(error) };
    }
};

export {
    saveUser,
    getUsers,
    getUserById,
    saveTrip,
    getTrips,
    joinTrip,
    getTripById,
    cancelTripReservation,
    deleteTrip,
    cancelTripWithPassengers
};
