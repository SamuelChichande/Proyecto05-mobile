import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonCard, IonCardContent, IonSpinner, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import { settingsOutline, addOutline, chevronForwardOutline, carOutline, personOutline } from 'ionicons/icons';
// @ts-ignore
import { getTrips } from '../config/database';
import './MyTravels.css';

type TripType = 'driver' | 'passenger';
interface Trip { id: string; date: string; time: string; origin: string; destination: string; seats: number; price: string; userId: string; passengersID?: string[]; }

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
        const currentUserId = localStorage.getItem('idUser');
        
        console.log("--- DEBUG START ---");
        console.log("Tu ID de usuario (localStorage):", currentUserId);

        const result = await getTrips();

        if (result.status === 'success' && currentUserId) {
          const allTrips = result.data;
          const dList: Trip[] = [];
          const pList: Trip[] = [];
          const now = new Date();

          for (const key in allTrips) {
            const trip = allTrips[key];
            
            if (!trip.date || !trip.time) continue;

            const tripDateTime = new Date(`${trip.date.replace(/-/g, '/')} ${trip.time}`);
            const tripWithId = { id: key, ...trip };
            if (tripDateTime < now) {
              const isDriver = String(trip.userId).trim() === String(currentUserId).trim();
              const isPassenger = trip.passengersID && trip.passengersID.includes(currentUserId);

              if (isDriver) {
                console.log(`✅ Viaje encontrado como Conductor: ${trip.origin} -> ${trip.destination}`);
                dList.push(tripWithId);
              } else if (isPassenger) {
                console.log(`✅ Viaje encontrado como Pasajero: ${trip.origin} -> ${trip.destination}`);
                pList.push(tripWithId);
              } else {
                 console.log("Viaje pasado ajeno:", trip.userId); 
              }

            } else {
                 console.log("Viaje futuro ignorado:", trip.date);
            }
          }
          
          const sorter = (a: Trip, b: Trip) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime();
          setDriverTrips(dList.sort(sorter));
          setPassengerTrips(pList.sort(sorter));
          
          console.log(`Total Conductor: ${dList.length}, Total Pasajero: ${pList.length}`);
          console.log("--- DEBUG END ---");
        } else {
            console.warn("No se encontró idUser o falló la carga de viajes.");
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchAndFilterTrips();
  }, []);

  const handleCreateTrip = () => history.push('/maindashboard/create-trip');
  const handleTripClick = (trip: Trip, type: TripType) => history.push({ pathname: '/maindashboard/trip-history-details', state: { trip, tripType: type } });

  const renderTrips = (trips: Trip[], type: TripType) => {
    if (loading) return <div className="loading-container"><IonSpinner /><p>Cargando...</p></div>;
    if (trips.length === 0) return (
      <div className="empty-state">
        <IonIcon icon={type === 'driver' ? carOutline : personOutline} className="empty-state-icon" />
        <h3>No tienes viajes pasados como {type === 'driver' ? 'conductor' : 'pasajero'}</h3>
        {type === 'driver' && <IonButton fill="outline" onClick={handleCreateTrip}>Publicar Viaje</IonButton>}
      </div>
    );
    return (
      <div className="trips-list">
        {trips.map((trip) => (
          <IonCard key={trip.id} className={`trip-card ${type}-card`} onClick={() => handleTripClick(trip, type)}>
            <IonCardContent>
              <div className="trip-card-content">
                <div className="date-box">
                  <span className="date-day">{trip.date?.split('-')[2]}</span>
                  <span className="date-month">{new Date(trip.date).toLocaleString('es-ES', { month: 'short' }).toUpperCase()}</span>
                </div>
                <div className="trip-info">
                    <div className="trip-type-badge"><IonIcon icon={type === 'driver' ? carOutline : personOutline}/><span>{type === 'driver'?'Conductor':'Pasajero'}</span></div>
                    <h3 className="trip-route">{trip.origin} ➝ {trip.destination}</h3>
                    <p className="trip-details">{trip.time} • ${trip.price}</p>
                </div>
                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="my-trips-toolbar">
          <IonTitle className="my-trips-title">Mis Viajes</IonTitle>
          <IonButton fill="clear" slot="end"><IonIcon icon={settingsOutline} /></IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="my-trips-content ion-padding">
        <div className="trip-counters">
          <div className={`trip-counter ${activeSegment==='driver'?'active':''}`} onClick={()=>setActiveSegment('driver')}><IonIcon icon={carOutline}/><span>{driverTrips.length} como conductor</span></div>
          <div className={`trip-counter ${activeSegment==='passenger'?'active':''}`} onClick={()=>setActiveSegment('passenger')}><IonIcon icon={personOutline}/><span>{passengerTrips.length} como pasajero</span></div>
        </div>
        <IonSegment value={activeSegment} onIonChange={e=>setActiveSegment(e.detail.value as TripType)} className="trip-type-segment">
            <IonSegmentButton value="driver"><IonLabel>Como conductor</IonLabel></IonSegmentButton>
            <IonSegmentButton value="passenger"><IonLabel>Como pasajero</IonLabel></IonSegmentButton>
        </IonSegment>
        <div className="section-container"><h2 className="section-title">Viajes Pasados</h2>{renderTrips(activeSegment === 'driver' ? driverTrips : passengerTrips, activeSegment)}</div>
      </IonContent>
      <div className="fab-container"><IonButton className="create-trip-fab" onClick={handleCreateTrip}><IonIcon icon={addOutline} slot="start" />Publicar Viaje</IonButton></div>
    </IonPage>
  );
};

export default MyTravels;