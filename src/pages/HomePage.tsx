import React, { useEffect, useState } from 'react';
import {
    IonContent, IonIcon, IonItem, IonAvatar,
    IonLabel, IonList, IonPage, useIonRouter, IonButton
} from '@ionic/react';
import { notifications, car } from 'ionicons/icons';
// @ts-ignore
import { getTrips, getUserById } from '../config/database';

import './HomePage.css';
import RideCard from '../components/RideCard';
import QuickActions from '../components/QuickActions';

interface Trip {
    title: string;
    timeTravel: string;
    startPoint: string;
    endPoint: string;
    driverName: string;
    vehicle: string;
    rating: string;
    tripCount: string;
    priceValue: string;
    priceUnit: string;
}

const HomePage: React.FC = () => {
    const router = useIonRouter();

    const [userName, setUserName] = useState<string>("Usuario");
    const [idUser, setIdUser] = useState<string>("");
    const [nextTrip, setNextTrip] = useState<Trip | null>(null);

    let priceValue = '0';
    let priceUnit = '.00';
    let rating = '0.0';
    let tripCount = '0 viajes';

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            const firstName = storedName.split(' ')[0];
            setUserName(firstName);
        }

        // Obtener rating y tripCount del usuario (simulado aquí)
        const storedIdUser = localStorage.getItem('idUser');

        loadUserData(storedIdUser || '');

        loadNextTrip(storedIdUser || '');
    }, []);

    const loadUserData = async (userId: string) => {
        try {
            const result = await getUserById(userId);
            if (result.status === "success") {
                console.log("Usuario encontrado:", result.data);
                rating = result.data.rating || '0.0';
                tripCount = result.data.tripCount || '0 viajes';
            } else {
                console.log("Error:", result.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    function formatFechaHora(fechaStr: String, horaStr: String) {
        console.log("Formato fecha y hora:", fechaStr, horaStr);

        const hoy = new Date();
        const fecha = new Date(fechaStr + "T00:00:00");

        // Validar si es hoy
        const esHoy =
            hoy.getFullYear() === fecha.getFullYear() &&
            hoy.getMonth() === fecha.getMonth() &&
            hoy.getDate() === fecha.getDate();

        // Convertir hora "08:00 PM" → 24h
        let [time, modifier] = horaStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);

        if (modifier === "PM" && hours !== 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        // Formatear HH:mm
        const hh = hours.toString().padStart(2, "0");
        const mm = minutes.toString().padStart(2, "0");

        const prefijo = esHoy ? "HOY" : fechaStr;

        return `${prefijo}, ${hh}:${mm} ${modifier}`;
    }

    const formatPrice = (value: String) => {
        priceValue = value.split('.')[0];
        priceUnit = value.split('.')[1];
    }

    const loadNextTrip = async (userId: string) => {
        try {
            //Cambiar getTirps
            const result = await getTrips();
            if (result.status === 'success') {
                const trips = result.data;
                console.log('All trips data:', trips);
                // Filtar el siguiente viaje del usuario
                for (const tripId in trips) {
                    const trip = trips[tripId];
                    if (trip.userId === userId) {
                        // Formatear fecha y hora
                        const formattedTitle = formatFechaHora(trip.date, trip.time);
                        // Formatear precio
                        formatPrice(trip.price);

                        setNextTrip({
                            title: formattedTitle,
                            timeTravel: trip.timeTravel,
                            startPoint: trip.origin,
                            endPoint: trip.destination,
                            driverName: trip.driverName,
                            vehicle: trip.car,
                            rating: rating,
                            tripCount: tripCount,
                            priceValue: priceValue,
                            priceUnit: priceUnit
                        });
                        return; // Salir después de encontrar el primer viaje
                    }
                }
                setNextTrip(null); // No se encontraron viajes para el usuario
            }
        } catch (error) {
            console.error('Error loading trips:', error);
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonList inset={true} style={{ 'background': 'transparent', 'margin': '0' }}>
                    <IonItem className="welcome-item">
                        <IonAvatar className="welcome-avatar">
                            <img
                                alt="Avatar"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwr_zZjgvmu4BccwDNIHic8K5dyehw7cSYA&s"
                            />
                        </IonAvatar>
                        <div className="welcome-content">
                            <sub className="welcome-subtitle">
                                BIENVENIDO
                            </sub>
                            <IonLabel className="welcome-title">
                                {/* 3. Usamos la variable de estado aquí */}
                                Hola, {userName}
                            </IonLabel>
                        </div>
                        <IonIcon
                            icon={notifications}
                            slot='end'
                            size='large'
                            className="notification-icon"
                        />
                    </IonItem>
                </IonList>
                <div className="dashboard-container">
                    <h3>Tu Próximo Viaje</h3>
                    {nextTrip ? (
                        <RideCard trip={nextTrip} />
                    ) : (
                        <div className="no-trips-message">
                            <IonIcon icon={car} size="large" color="medium" />
                            <h4>No tiene viajes establecidos</h4>
                            <IonButton fill="outline" /*onClick={() => router.push('/maindashboard/create-trip')}*/>
                                Buscar viaje
                            </IonButton>
                        </div>
                    )}
                    <h3>Accesos Rápidos</h3>
                    <QuickActions />
                </div>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;