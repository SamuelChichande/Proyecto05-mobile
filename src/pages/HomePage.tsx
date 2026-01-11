import React, { useEffect, useState, useCallback } from 'react';
import {
    IonContent, IonIcon, IonItem, IonAvatar,
    IonLabel, IonList, IonPage, useIonRouter, IonButton,
    IonSegment, IonSegmentButton
} from '@ionic/react';
import { notifications, car, person } from 'ionicons/icons';
// @ts-ignore
import { getTrips, getUserById } from '../config/database';

import './HomePage.css';
import RideCard from '../components/RideCard';

interface Trip {
    id: string;
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
    isDriver?: boolean;
    date: string;
    time: string;
    origin: string;
    destination: string;
    seats: number;
    price: string;
    passengersID: string[];
    userId: string;
}

type TripType = 'passenger' | 'driver';

const HomePage: React.FC = () => {
    const router = useIonRouter();
    const [userName, setUserName] = useState<string>("Usuario");
    const [activeSegment, setActiveSegment] = useState<TripType>('passenger');
    const [passengerTrips, setPassengerTrips] = useState<Trip[]>([]);
    const [driverTrips, setDriverTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const refreshTrips = () => setRefreshTrigger(prev => prev + 1);

    const formatFechaHora = useCallback((fechaStr: string, horaStr: string) => {
        try {
            const fecha = new Date(fechaStr.replace(/-/g, '/') + " " + horaStr);
            return fecha.toLocaleString('es-EC', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
        } catch { return `${fechaStr} ${horaStr}`; }
    }, []);

    const formatPrice = useCallback((value: string) => {
        const parts = (value || "0.00").split('.');
        return { priceValue: parts[0], priceUnit: parts[1] || '00' };
    }, []);

    const loadAllTrips = useCallback(async () => {
        try {
            setLoading(true);
            const currentUserId = localStorage.getItem('idUser');

            if (!currentUserId) { setLoading(false); return; }

            const result = await getTrips();

            if (result.status === 'success') {
                const trips = result.data;
                const driverList: Trip[] = [];
                const passengerList: Trip[] = [];
                const now = new Date();

                for (const tripId in trips) {
                    const trip = trips[tripId];
                    if (!trip.date || !trip.time) continue;

                    const tripDate = new Date(`${trip.date.replace(/-/g, '/')} ${trip.time}`);

                    if (tripDate > now) {
                        const { priceValue, priceUnit } = formatPrice(trip.price);

                        const totalSeats = parseInt(trip.seats) || 4;
                        const passengersList = trip.passengersID || [];
                        const isFull = passengersList.length >= totalSeats;

                        if (isFull && trip.userId !== currentUserId && !passengersList.includes(currentUserId)) {
                            continue;
                        }

                        let rating = "0.0";

                        // Obtener nombre del conductor desde la base de datos si es necesario
                        const driverName = await getUserById(trip.userId).then((res: any) => {
                            if (res.status === 'success') {
                                rating = res.data.rating || "0.0";
                                return res.data.name || "Usuario";
                            }
                            return "Usuario";
                        });

                        console.log("Processing trip:", tripId, "Driver:", driverName);

                        const tripObj: Trip = {
                            id: tripId,
                            // Datos visuales para la tarjeta
                            title: formatFechaHora(trip.date, trip.time),
                            timeTravel: trip.timeTravel,
                            startPoint: trip.origin,
                            endPoint: trip.destination,
                            driverName: driverName,
                            vehicle: trip.car || "Auto",
                            rating: rating,
                            tripCount: "1",
                            priceValue,
                            priceUnit,
                            isDriver: false,
                            date: trip.date,
                            time: trip.time,
                            origin: trip.origin,
                            destination: trip.destination,
                            seats: trip.seats,
                            price: trip.price,
                            passengersID: trip.passengersID || [],
                            userId: trip.userId
                        };
                        // Clasificación
                        if (trip.userId === currentUserId) {
                            tripObj.isDriver = true;
                            tripObj.driverName = "Tú";
                            driverList.push(tripObj);
                        }
                        else if (trip.passengersID && trip.passengersID.includes(currentUserId)) {
                            passengerList.push(tripObj);
                        }
                    }
                }

                setDriverTrips(driverList);
                setPassengerTrips(passengerList);
            }
        } catch (error) { console.error(error); } finally { setLoading(false); }
    }, [formatFechaHora, formatPrice]);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setUserName(storedName.split(' ')[0]);
        loadAllTrips();
    }, [loadAllTrips, refreshTrigger]);

    useEffect(() => {
        window.addEventListener('trip-created', refreshTrips);
        return () => window.removeEventListener('trip-created', refreshTrips);
    }, []);

    useEffect(() => {
        window.addEventListener('trip-cancelled', refreshTrips);
        return () => window.removeEventListener('trip-cancelled', refreshTrips);
    }, []);

    const getActiveTrips = () => activeSegment === 'passenger' ? passengerTrips : driverTrips;

    const renderTrips = (trips: Trip[], type: TripType) => {
        if (loading) return <p className="ion-text-center">Cargando...</p>;
        if (trips.length === 0) return (
            <div className="no-trips-message">
                <IonIcon icon={type === 'passenger' ? person : car} size="large" />
                <h4>No tienes viajes próximos como {type === 'passenger' ? 'pasajero' : 'conductor'}</h4>
                <IonButton fill="outline" onClick={() => router.push(type === 'passenger' ? '/maindashboard/search' : '/maindashboard/create-trip')}>
                    {type === 'passenger' ? "Buscar viaje" : "Crear viaje"}
                </IonButton>
            </div>
        );
        return <div className="trips-list">{trips.map(t => <RideCard key={t.id} trip={t} tripType={type} />)}</div>;
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonList lines="none" style={{ background: 'transparent' }}>
                    <IonItem className="welcome-item">
                        <IonAvatar className="welcome-avatar"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwr_zZjgvmu4BccwDNIHic8K5dyehw7cSYA&s" alt="" /></IonAvatar>
                        <div className="welcome-content"><sub className="welcome-subtitle">BIENVENIDO</sub><IonLabel className="welcome-title">Hola, {userName}</IonLabel></div>
                        <IonIcon icon={notifications} slot='end' size='large' />
                    </IonItem>
                </IonList>

                <div className="dashboard-container">
                    <div className="trip-summary-header">
                        <h3>Próximos Viajes</h3>
                        <div className="trip-counters">
                            <span onClick={() => setActiveSegment('passenger')} className={`trip-counter ${activeSegment === 'passenger' ? 'active' : ''}`}><IonIcon icon={person} /> {passengerTrips.length}</span>
                            <span onClick={() => setActiveSegment('driver')} className={`trip-counter ${activeSegment === 'driver' ? 'active' : ''}`}><IonIcon icon={car} /> {driverTrips.length}</span>
                        </div>
                    </div>

                    <IonSegment value={activeSegment} onIonChange={e => setActiveSegment(e.detail.value as TripType)} className="trip-segment">
                        <IonSegmentButton value="passenger"><IonLabel>Como pasajero</IonLabel></IonSegmentButton>
                        <IonSegmentButton value="driver"><IonLabel>Como conductor</IonLabel></IonSegmentButton>
                    </IonSegment>

                    {renderTrips(getActiveTrips(), activeSegment)}
                </div>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;