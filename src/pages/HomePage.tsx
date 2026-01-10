import React, { useEffect, useState, useCallback } from 'react';
import {
    IonContent, IonIcon, IonItem, IonAvatar,
    IonLabel, IonList, IonPage, useIonRouter, IonButton,
    IonSegment, IonSegmentButton
} from '@ionic/react';
import { notifications, car, person } from 'ionicons/icons';
// @ts-ignore
import { getTrips } from '../config/database';

import './HomePage.css';
import RideCard from '../components/RideCard';
import QuickActions from '../components/QuickActions';

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
    passengersCount?: number;
    availableSeats?: number;
    isDriver?: boolean;
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

    const refreshTrips = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const formatFechaHora = useCallback((fechaStr: string, horaStr: string) => {
        if (!fechaStr || !horaStr) return "Fecha no disponible";
        
        try {
            const hoy = new Date();
            const fecha = new Date(fechaStr + "T00:00:00");

            const esHoy =
                hoy.getFullYear() === fecha.getFullYear() &&
                hoy.getMonth() === fecha.getMonth() &&
                hoy.getDate() === fecha.getDate();

            let [time, modifier] = horaStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours !== 12) {
                hours += 12;
            }
            if (modifier === "AM" && hours === 12) {
                hours = 0;
            }

            const hh = hours.toString().padStart(2, "0");
            const mm = minutes.toString().padStart(2, "0");

            const prefijo = esHoy ? "HOY" : fechaStr;

            return `${prefijo}, ${hh}:${mm} ${modifier}`;
        } catch (error) {
            return `${fechaStr}, ${horaStr}`;
        }
    }, []);

    const formatPrice = useCallback((value: string) => {
        if (!value) {
            return { priceValue: "0", priceUnit: "00" };
        }
        
        const listPrice = value.split('.');
        if (listPrice.length === 1) {
            return {
                priceValue: listPrice[0],
                priceUnit: '00'
            };
        }
        return {
            priceValue: listPrice[0],
            priceUnit: listPrice[1]
        };
    }, []);

    const loadAllTrips = useCallback(async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('idUser');
            
            if (!userId) {
                setLoading(false);
                return;
            }

            const result = await getTrips();
            
            if (result.status === 'success') {
                const trips = result.data;
                
                const passengerTripsList: Trip[] = [];
                const driverTripsList: Trip[] = [];
                
                const now = new Date();
                
                for (const tripId in trips) {
                    const trip = trips[tripId];
                    
                    // Verificar si es conductor
                    if (trip.userId && trip.userId.trim() === userId.trim()) {
                        const formattedTitle = formatFechaHora(trip.date, trip.time);
                        const { priceValue, priceUnit } = formatPrice(trip.price);
                        
                        const currentPassengers = trip.passengersID ? 
                            (Array.isArray(trip.passengersID) ? trip.passengersID.length : 0) : 0;
                        
                        const seats = parseInt(trip.seats?.toString() || "0");
                        const availableSeats = seats > 0 ? (seats - currentPassengers) : 0;
                        
                        const tripObj: Trip = {
                            id: tripId,
                            title: formattedTitle,
                            timeTravel: trip.timeTravel || "0 min",
                            startPoint: trip.origin || "Origen",
                            endPoint: trip.destination || "Destino",
                            driverName: "Tú",
                            vehicle: trip.car || "Vehículo",
                            rating: "5.0",
                            tripCount: "0 viajes",
                            priceValue: priceValue,
                            priceUnit: priceUnit,
                            passengersCount: currentPassengers,
                            availableSeats: availableSeats > 0 ? availableSeats : 0,
                            isDriver: true
                        };
                        
                        driverTripsList.push(tripObj);
                    }
                    
                    // Verificar si es pasajero
                    if (trip.passengersID && Array.isArray(trip.passengersID)) {
                        const esPasajero = trip.passengersID.some((passengerId: string) => 
                            passengerId && userId && passengerId.trim() === userId.trim()
                        );
                        
                        if (esPasajero) {
                            const formattedTitle = formatFechaHora(trip.date, trip.time);
                            const { priceValue, priceUnit } = formatPrice(trip.price);
                            
                            const tripObj: Trip = {
                                id: tripId,
                                title: formattedTitle,
                                timeTravel: trip.timeTravel || "0 min",
                                startPoint: trip.origin || "Origen",
                                endPoint: trip.destination || "Destino",
                                driverName: trip.driverName || "Conductor",
                                vehicle: trip.car || "Vehículo",
                                rating: "5.0",
                                tripCount: "0 viajes",
                                priceValue: priceValue,
                                priceUnit: priceUnit,
                                isDriver: false
                            };
                            
                            passengerTripsList.push(tripObj);
                        }
                    }
                }
                
                // Ordenar por fecha (más próximos primero)
                const sortTripsByDate = (tripsArray: Trip[]) => {
                    return tripsArray.sort((a, b) => {
                        try {
                            const dateA = new Date(a.title.split(',')[0] === 'HOY' ? 
                                new Date().toISOString().split('T')[0] : a.title.split(',')[0]);
                            const dateB = new Date(b.title.split(',')[0] === 'HOY' ? 
                                new Date().toISOString().split('T')[0] : b.title.split(',')[0]);
                            return dateA.getTime() - dateB.getTime();
                        } catch {
                            return 0;
                        }
                    });
                };
                
                // Filtrar solo viajes futuros
                const filterFutureTrips = (trips: Trip[]) => {
                    return trips.filter(trip => {
                        try {
                            const dateStr = trip.title.split(',')[0];
                            const timeStr = trip.title.split(',')[1]?.trim().split(' ')[0];
                            
                            if (!dateStr || !timeStr) return true;
                            
                            let tripDate;
                            if (dateStr === "HOY") {
                                const today = new Date().toISOString().split('T')[0];
                                tripDate = new Date(today + 'T' + timeStr + ':00');
                            } else {
                                tripDate = new Date(dateStr + 'T' + timeStr + ':00');
                            }
                            
                            return tripDate > now;
                        } catch {
                            return true;
                        }
                    });
                };
                
                const futureDriverTrips = filterFutureTrips(sortTripsByDate(driverTripsList));
                const futurePassengerTrips = filterFutureTrips(sortTripsByDate(passengerTripsList));
                
                setDriverTrips(futureDriverTrips);
                setPassengerTrips(futurePassengerTrips);
            }
        } catch (error) {
            console.error("Error cargando viajes:", error);
        } finally {
            setLoading(false);
        }
    }, [formatFechaHora, formatPrice]);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            const firstName = storedName.split(' ')[0];
            setUserName(firstName);
        }

        loadAllTrips();
    }, [loadAllTrips, refreshTrigger]);

    // Escuchar eventos de creación de viaje
    useEffect(() => {
        const handleTripCreated = () => {
            refreshTrips();
        };

        // Escuchar evento personalizado
        window.addEventListener('trip-created', handleTripCreated);
        
        // Escuchar cambios en localStorage (alternativa)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'tripCreated' || e.key === 'reloadTrips') {
                refreshTrips();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('trip-created', handleTripCreated);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Función para renderizar viajes
    const renderTrips = (trips: Trip[], type: TripType) => {
        if (loading) {
            return (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Buscando tus viajes...</p>
                </div>
            );
        }

        if (trips.length === 0) {
            return (
                <div className="no-trips-message">
                    <IonIcon 
                        icon={type === 'passenger' ? person : car} 
                        size="large" 
                        color="medium" 
                    />
                    <h4>
                        {type === 'passenger' 
                            ? "No tiene viajes próximos como pasajero" 
                            : "No tiene viajes próximos como conductor"}
                    </h4>
                    <IonButton 
                        fill="outline" 
                        onClick={() => router.push(type === 'passenger' ? '/buscar-viajes' : '/maindashboard/create-trip')}
                    >
                        {type === 'passenger' ? "Buscar viaje" : "Crear viaje"}
                    </IonButton>
                </div>
            );
        }

        return (
            <div className="trips-list">
                {trips.map((trip) => (
                    <RideCard 
                        key={`${type}-${trip.id}`}
                        trip={trip}
                        tripType={type}
                    />
                ))}
            </div>
        );
    };

    // Obtener viajes activos
    const getActiveTrips = () => {
        return activeSegment === 'passenger' ? passengerTrips : driverTrips;
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
                    {/* Contador de viajes */}
                    <div className="trip-summary-header">
                        <h3>Próximos Viajes</h3>
                        <div className="trip-counters">
                            <span 
                                className={`trip-counter ${activeSegment === 'passenger' ? 'active' : ''}`}
                                onClick={() => setActiveSegment('passenger')}
                            >
                                <IonIcon icon={person} /> {passengerTrips.length}
                            </span>
                            <span 
                                className={`trip-counter ${activeSegment === 'driver' ? 'active' : ''}`}
                                onClick={() => setActiveSegment('driver')}
                            >
                                <IonIcon icon={car} /> {driverTrips.length}
                            </span>
                        </div>
                    </div>
                    
                    {/* Segmento para cambiar entre pasajero/conductor */}
                    <IonSegment 
                        value={activeSegment} 
                        onIonChange={e => e.detail.value && setActiveSegment(e.detail.value as TripType)}
                        className="trip-segment"
                    >
                        <IonSegmentButton value="passenger">
                            <IonLabel>Como pasajero</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="driver">
                            <IonLabel>Como conductor</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    
                    {/* Mostrar viajes según el segmento activo */}
                    {renderTrips(getActiveTrips(), activeSegment)}
                    
                    <h3>Accesos Rápidos</h3>
                    <QuickActions />
                </div>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;