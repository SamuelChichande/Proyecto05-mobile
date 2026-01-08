import React from 'react';
import { useLocation } from 'react-router-dom'; // Importante para recibir los datos
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonIcon, IonBadge
} from '@ionic/react';
import { 
  locationOutline, timeOutline, calendarOutline, 
  carOutline, chevronBackOutline, alertCircleOutline 
} from 'ionicons/icons';
import './TripHistoryDetails.css';

const TripHistoryDetails: React.FC = () => {
  const location = useLocation<{ trip: any }>();
  const trip = location.state?.trip;

  // Si por alguna razón no hay datos del viaje, mostramos un aviso
  if (!trip) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <IonBackButton defaultHref="/maindashboard/trips" />
          <p>No se encontró información del viaje.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton icon={chevronBackOutline} defaultHref="/maindashboard/trips" />
          </IonButtons>
          <IonTitle>Detalles del Viaje</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="status-banner completed">
          <IonIcon icon={alertCircleOutline} />
          <span>Este viaje ya ha finalizado</span>
        </div>

        <div className="trip-route-container">
          <div className="route-point">
            <div className="dot origin"></div>
            <div className="route-text">
              <p className="label">ORIGEN</p>
              {/* INFO DE FIREBASE */}
              <h3>{trip.origin}</h3>
            </div>
          </div>
          <div className="route-line"></div>
          <div className="route-point">
            <IonIcon icon={locationOutline} className="dest-icon" />
            <div className="route-text">
              <p className="label">DESTINO</p>
              {/* INFO DE FIREBASE */}
              <h3>{trip.destination}</h3>
            </div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <IonIcon icon={calendarOutline} />
            <div>
              <p>FECHA</p>
              <span>{trip.date}</span>
            </div>
          </div>
          <div className="info-item">
            <IonIcon icon={timeOutline} />
            <div>
              <p>HORA</p>
              <span>{trip.time}</span>
            </div>
          </div>
        </div>

        <div className="driver-info-card">
          <div className="driver-header">
            <IonIcon icon={carOutline} />
            <span>Precio Pagado: ${trip.price}</span>
          </div>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', color: '#888' }}>
            Asientos publicados: {trip.seats}
          </p>
        </div>

        <div className="history-footer">
          <p className="ion-text-center" style={{color: '#888', fontSize: '0.8rem'}}>
            ID del Viaje: {trip.id}<br/>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TripHistoryDetails;