import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import {
  settingsOutline,
  addOutline,
  chevronForwardOutline,
  carOutline,
  personOutline
} from 'ionicons/icons';

// @ts-ignore
import { getTrips } from '../config/database';

import './MyTravels.css';

type TripType = 'driver' | 'passenger';

interface Trip {
  id: string;
  date: string;
  time: string;
  origin: string;
  destination: string;
  seats: number;
  price: string;
  userId: string;
  passengersID?: string[];
  car?: string;
  driverName?: string;
  timeTravel?: string;
}

const MyTravels: React.FC = () => {
  const [driverTrips, setDriverTrips] = useState<Trip[]>([]);
  const [passengerTrips, setPassengerTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSegment, setActiveSegment] = useState<TripType>('driver');
  const history = useHistory();

  useEffect(() => {
    const fetchAndFilterTrips = async () => {
      try {
        setLoading(true);
        const currentUserId = localStorage.getItem('userId');
        const result = await getTrips();

        if (result.status === 'success' && currentUserId) {
          const allTrips = result.data;
          const driverTripsList: Trip[] = [];
          const passengerTripsList: Trip[] = [];

          const now = new Date();

          for (const key in allTrips) {
            const trip = allTrips[key];
            const dateFormatted = trip.date.replace(/-/g, '/');
            const tripDateTime = new Date(`${dateFormatted} ${trip.time}`);

            // Solo incluir viajes pasados
            if (tripDateTime < now) {
              const tripWithId = { id: key, ...trip };

              // Viajes como CONDUCTOR (creados por el usuario)
              if (trip.userId === currentUserId) {
                driverTripsList.push(tripWithId);
              }

              // Viajes como PASAJERO (usuario en la lista de pasajeros)
              if (trip.passengersID && trip.passengersID.includes(currentUserId)) {
                passengerTripsList.push(tripWithId);
              }
            }
          }

          // Ordenar por fecha (más recientes primero)
          const sortTripsByDate = (trips: Trip[]) => {
            return trips.sort((a, b) => {
              const dateA = new Date(`${a.date.replace(/-/g, '/')} ${a.time}`);
              const dateB = new Date(`${b.date.replace(/-/g, '/')} ${b.time}`);
              return dateB.getTime() - dateA.getTime();
            });
          };

          setDriverTrips(sortTripsByDate(driverTripsList));
          setPassengerTrips(sortTripsByDate(passengerTripsList));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilterTrips();
  }, []);

  const handleCreateTrip = () => {
    history.push('/maindashboard/create-trip');
  };

  const handleTripClick = (trip: Trip, type: TripType) => {
    history.push({
      pathname: '/maindashboard/trip-history-details',
      state: { trip, tripType: type }
    });
  };

  const renderTrips = (trips: Trip[], type: TripType) => {
    if (loading) {
      return (
        <div className="loading-container">
          <IonSpinner name="crescent" color="primary" />
          <IonText color="medium">
            <p>Buscando tus viajes...</p>
          </IonText>
        </div>
      );
    }

    if (trips.length === 0) {
      return (
        <div className="empty-state">
          <IonIcon 
            icon={type === 'driver' ? carOutline : personOutline} 
            className="empty-state-icon" 
          />
          <h3 className="empty-state-title">
            {type === 'driver' 
              ? 'No tienes viajes como conductor' 
              : 'No tienes viajes como pasajero'}
          </h3>
          <p className="empty-state-description">
            {type === 'driver' 
              ? 'Los viajes que publiques aparecerán aquí.' 
              : 'Los viajes en los que hayas participado aparecerán aquí.'}
          </p>
          {type === 'driver' && (
            <IonButton fill="outline" className="empty-state-button" onClick={handleCreateTrip}>
              Publicar Viaje
            </IonButton>
          )}
        </div>
      );
    }

    return (
      <div className="trips-list">
        {trips.map((trip) => (
          <IonCard
            key={`${type}-${trip.id}`}
            className={`trip-card ${type}-card`}
            onClick={() => handleTripClick(trip, type)}
          >
            <IonCardContent>
              <div className="trip-card-content">
                <div className="date-box">
                  <span className="date-day">{trip.date?.split('-')[2] || '??'}</span>
                  <span className="date-month">
                    {trip.date ? new Date(trip.date).toLocaleString('es-ES', { month: 'short' }).toUpperCase() : 'MES'}
                  </span>
                </div>

                <div className="trip-info">
                  <div className="trip-type-badge">
                    <IonIcon icon={type === 'driver' ? carOutline : personOutline} />
                    <span>{type === 'driver' ? 'Conductor' : 'Pasajero'}</span>
                  </div>
                  <h3 className="trip-route">{trip.origin} ➝ {trip.destination}</h3>
                  <p className="trip-details">
                    {trip.time} • {trip.seats} plazas • ${trip.price}
                  </p>
                  {type === 'driver' && trip.passengersID && (
                    <p className="trip-passengers">
                      👥 {trip.passengersID.length} pasajero(s)
                    </p>
                  )}
                </div>

                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </div>
    );
  };

  const getActiveTrips = () => {
    return activeSegment === 'driver' ? driverTrips : passengerTrips;
  };

  const getTripCounts = () => {
    return {
      driver: driverTrips.length,
      passenger: passengerTrips.length
    };
  };

  const tripCounts = getTripCounts();

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="my-trips-toolbar">
          <IonTitle className="my-trips-title">Mis Viajes</IonTitle>
          <IonButton fill="clear" slot="end" className="settings-button">
            <IonIcon slot="icon-only" icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="my-trips-content ion-padding">
        {/* Contadores de viajes */}
        <div className="trip-counters">
          <div 
            className={`trip-counter ${activeSegment === 'driver' ? 'active' : ''}`}
            onClick={() => setActiveSegment('driver')}
          >
            <IonIcon icon={carOutline} />
            <span>{tripCounts.driver} como conductor</span>
          </div>
          <div 
            className={`trip-counter ${activeSegment === 'passenger' ? 'active' : ''}`}
            onClick={() => setActiveSegment('passenger')}
          >
            <IonIcon icon={personOutline} />
            <span>{tripCounts.passenger} como pasajero</span>
          </div>
        </div>

        {/* Segmento de selección */}
        <IonSegment 
          value={activeSegment} 
          onIonChange={e => e.detail.value && setActiveSegment(e.detail.value as TripType)}
          className="trip-type-segment"
        >
          <IonSegmentButton value="driver">
            <IonLabel>Como conductor</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="passenger">
            <IonLabel>Como pasajero</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {/* Lista de viajes */}
        <div className="section-container">
          <h2 className="section-title">Viajes Pasados</h2>
          {renderTrips(getActiveTrips(), activeSegment)}
        </div>

        <div className="spacer"></div>
      </IonContent>

      {/* Botón Flotante para Crear Viaje */}
      <div className="fab-container">
        <IonButton className="create-trip-fab" onClick={handleCreateTrip}>
          <IonIcon icon={addOutline} slot="start" />
          Publicar Viaje
        </IonButton>
      </div>
    </IonPage>
  );
};

export default MyTravels;