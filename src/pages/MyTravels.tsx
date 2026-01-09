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
  IonText
} from '@ionic/react';
import {
  settingsOutline,
  addOutline,
  chevronForwardOutline,
  carOutline
} from 'ionicons/icons';

// @ts-ignore - Esto elimina el error de falta de declaración de tipos para el JS
import { getTrips } from '../config/database';

import './MyTravels.css';

const MyTravels: React.FC = () => {
  const [userTrips, setUserTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    const fetchAndFilterTrips = async () => {
      try {
        setLoading(true);
        const currentUserId = localStorage.getItem('userId');
        const result = await getTrips();

        if (result.status === 'success') {
          const allTrips = result.data;
          const filtered: any[] = [];

          const now = new Date(); // Fecha y hora actual

          for (const key in allTrips) {
            const trip = allTrips[key];

            const dateFormatted = trip.date.replace(/-/g, '/');
            const tripDateTime = new Date(`${dateFormatted} ${trip.time}`);

            const now = new Date();

            if (trip.userId === currentUserId && tripDateTime < now) {
              filtered.push({ id: key, ...trip });
            }
          }
          setUserTrips(filtered);
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
        <div className="section-container">
          <h2 className="section-title">Viajes Pasados</h2>

          {loading ? (
            <div className="ion-text-center ion-padding" style={{ marginTop: '20px' }}>
              <IonSpinner name="crescent" color="primary" />
              <IonText color="medium"><p>Buscando tus viajes...</p></IonText>
            </div>
          ) : userTrips.length > 0 ? (
            /* Renderizado de viajes filtrados por tu ID de usuario */
              userTrips.map((trip) => (
                <IonCard
                  key={trip.id}
                  className="trip-card upcoming-card"
                  onClick={() => history.push({
                    pathname: '/maindashboard/trip-history-details',
                    state: { trip: trip }
                  })}
>
                <IonCardContent>
                  <div className="upcoming-content">
                    <div className="date-box">
                      {/* Formateo de fecha desde el string de Firebase */}
                      <span className="date-day">{trip.date?.split('-')[2] || '??'}</span>
                      <span className="date-month">
                        {trip.date ? new Date(trip.date).toLocaleString('es-ES', { month: 'short' }).toUpperCase() : 'MES'}
                      </span>
                    </div>

                    <div className="upcoming-info">
                      <h3 className="trip-route">{trip.origin} ➝ {trip.destination}</h3>
                      <p className="trip-details">
                        {trip.time} • {trip.seats} plazas • ${trip.price}
                      </p>
                    </div>

                    <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            /* Estado vacío si el usuario no tiene viajes con su ID */
            <div className="ion-text-center ion-padding" style={{ marginTop: '40px' }}>
              <IonIcon icon={carOutline} style={{ fontSize: '64px', color: '#ccc' }} />
              <h3 style={{ color: '#888' }}>No tienes viajes propios</h3>
              <p style={{ color: '#aaa' }}>Los viajes que publiques aparecerán aquí.</p>
              <IonButton fill="outline" style={{ marginTop: '20px' }} onClick={handleCreateTrip}>
                Publicar Viaje
              </IonButton>
            </div>
          )}
        </div>

        <div className="spacer" style={{ height: '80px' }}></div>
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