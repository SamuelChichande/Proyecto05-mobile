import React, { useState } from 'react'; 
import { useHistory } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonSearchbar, IonSpinner,
  IonIcon, IonButton, IonCard, IonCardContent, IonBadge,
  useIonViewWillEnter 
} from '@ionic/react';
import {
  chevronBackOutline, searchOutline, carOutline,
  calendarOutline, peopleOutline, filterOutline
} from 'ionicons/icons';
// @ts-ignore
import { getTrips } from '../config/database';
import './SearchTrips.css';

interface Trip {
  id: string; origin: string; destination: string; date: string; time: string;
  price: string; seats: number; userId: string; passengersID?: string[]; car?: string;
}

const SearchTrips: React.FC = () => {
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useIonViewWillEnter(() => {
    loadAvailableTrips();
  });

  const loadAvailableTrips = async () => {
    setLoading(true);
    try {
      const currentUserId = localStorage.getItem('idUser');
      const result = await getTrips();

      if (result.status === 'success' && currentUserId) {
        const tripsData = result.data;
        const available: Trip[] = [];
        const now = new Date();

        for (const key in tripsData) {
          const trip = tripsData[key];
          
          if (!trip.date || !trip.time || !trip.seats) continue;

          const tripDate = new Date(`${trip.date.replace(/-/g, '/')} ${trip.time}`);
          
          const totalSeats = parseInt(trip.seats.toString());
          const occupied = trip.passengersID ? trip.passengersID.length : 0;
          const remainingSeats = totalSeats - occupied;

          const isFuture = tripDate > now;
          const isNotMyTrip = trip.userId !== currentUserId;
          const isNotJoined = !trip.passengersID || !trip.passengersID.includes(currentUserId);
          
          if (isFuture && isNotMyTrip && isNotJoined && remainingSeats > 0) {
            available.push({ id: key, ...trip });
          }
        }

        available.sort((a, b) => {
            const dateA = new Date(`${a.date.replace(/-/g, '/')} ${a.time}`);
            const dateB = new Date(`${b.date.replace(/-/g, '/')} ${b.time}`);
            return dateA.getTime() - dateB.getTime();
        });

        setAllTrips(available);
        setFilteredTrips(available);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
      setSearchText(text);
      if (text.trim() === '') {
          setFilteredTrips(allTrips);
      } else {
          const lower = text.toLowerCase();
          setFilteredTrips(allTrips.filter(t => 
              t.origin.toLowerCase().includes(lower) || 
              t.destination.toLowerCase().includes(lower)
          ));
      }
  };

  const handleTripClick = (trip: Trip) => {
    history.push({
      pathname: '/maindashboard/trip-details',
      state: { trip: trip, isDriver: false } 
    });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/maindashboard/home" icon={chevronBackOutline} text="" />
          </IonButtons>
          <IonTitle>Buscar Viaje</IonTitle>
          <IonButtons slot="end"><IonButton><IonIcon icon={filterOutline} /></IonButton></IonButtons>
        </IonToolbar>
        <IonToolbar className="search-toolbar">
            <IonSearchbar 
                placeholder="¿A dónde quieres ir?" 
                value={searchText}
                onIonInput={e => handleSearch(e.detail.value!)}
                className="custom-searchbar"
            />
        </IonToolbar>
      </IonHeader>

      <IonContent className="search-content">
        {loading ? (
          <div className="loading-container"><IonSpinner name="crescent" color="primary" /><p>Buscando rutas...</p></div>
        ) : filteredTrips.length === 0 ? (
          <div className="empty-results"><IonIcon icon={searchOutline} className="empty-icon" /><h3>No hay viajes disponibles</h3></div>
        ) : (
          <div className="results-list">
            <div className="results-header"><span>{filteredTrips.length} resultados disponibles</span></div>
            {filteredTrips.map(trip => {
                const total = parseInt(trip.seats.toString());
                const occupied = trip.passengersID ? trip.passengersID.length : 0;
                const remaining = total - occupied; 

                return (
                    <IonCard key={trip.id} className="search-trip-card" onClick={() => handleTripClick(trip)}>
                        <IonCardContent>
                            <div className="trip-main-info">
                                <div className="trip-time-price">
                                    <h2 className="time">{trip.time}</h2>
                                    <h2 className="price">${trip.price}</h2>
                                </div>
                                <div className="trip-locations">
                                    <div className="location-node"><div className="node-dot origin"></div><span className="location-text">{trip.origin}</span></div>
                                    <div className="location-connector"></div>
                                    <div className="location-node"><div className="node-dot destination"></div><span className="location-text">{trip.destination}</span></div>
                                </div>
                            </div>
                            <div className="trip-footer">
                                <div className="driver-preview"><IonIcon icon={carOutline} /><span>{trip.car || "Auto"}</span></div>
                                <div className="trip-badges">
                                    {/* Mostramos 'remaining', NO 'trip.seats' */}
                                    <IonBadge color={remaining === 1 ? "danger" : "success"} className="seats-badge">
                                        <IonIcon icon={peopleOutline} /> {remaining} lug.
                                    </IonBadge>
                                    <IonBadge color="light" className="date-badge">
                                        <IonIcon icon={calendarOutline} /> 
                                        {new Date(trip.date).toLocaleDateString('es-EC', {day: 'numeric', month: 'short'})}
                                    </IonBadge>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>
                );
            })}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default SearchTrips;