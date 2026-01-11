import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonIcon, IonButton, IonLoading,
  IonChip, IonLabel, IonCard, IonCardContent
} from '@ionic/react';
import { 
  locationOutline, timeOutline, calendarOutline, 
  carOutline, chevronBackOutline, cashOutline, peopleOutline,
  checkmarkCircle, alertCircleOutline, closeCircleOutline
} from 'ionicons/icons';
// @ts-ignore
import { joinTrip } from '../config/database'; 
import './TripDetails.css';

const TripDetails: React.FC = () => {
  const location = useLocation<{ trip: any }>();
  const history = useHistory();
  
  const trip = location.state?.trip;
  const currentUserId = localStorage.getItem('idUser');
  const [loading, setLoading] = useState(false);

  if (!trip) {
      return (
          <IonPage>
              <IonHeader><IonToolbar><IonButtons slot="start"><IonBackButton defaultHref="/maindashboard/home" /></IonButtons><IonTitle>Error</IonTitle></IonToolbar></IonHeader>
              <IonContent className="ion-padding"><p>No hay información del viaje.</p></IonContent>
          </IonPage>
      );
  }

  const originDisplay = trip.origin || trip.startPoint;
  const destDisplay = trip.destination || trip.endPoint;
  const dateDisplay = trip.date;
  const timeDisplay = trip.time || trip.timeTravel; 

  const isDriver = trip.userId === currentUserId || trip.isDriver === true;
  
  // Verificamos si soy pasajero
  const passengers = trip.passengersID || [];
  const isPassenger = passengers.includes(currentUserId);
  
  const totalSeats = parseInt(trip.seats || "4"); 
  const occupied = passengers.length;
  const remainingSeats = totalSeats - occupied;

  const handleJoinTrip = async () => {
    if (!currentUserId) { alert("Inicia sesión primero"); return; }
    setLoading(true);
    
    const result = await joinTrip(trip.id, currentUserId);
    setLoading(false);

    if (result.status === 'success') {
      alert("¡Reserva exitosa!");
      window.dispatchEvent(new Event('trip-created')); 
      history.push('/maindashboard/home');
    } else {
      alert("Error: " + result.message);
    }
  };

  const renderFooterAction = () => {
    if (isDriver) {
        return (
            <div className="status-box driver">
                <IonIcon icon={carOutline} />
                <p>Eres el conductor</p>
                <IonButton fill="outline" routerLink="/maindashboard/manage-trip" style={{marginTop: 10}}>
                    Gestionar
                </IonButton>
            </div>
        );
    }

    if (isPassenger) return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IonButton 
                color="danger" 
                fill="solid" 
                shape="round"
                className="cancel-btn-custom"
              >
                Cancelar Reserva
              </IonButton>
          </div>
      );

    if (remainingSeats <= 0) {
        return <div className="status-box full"><IonIcon icon={alertCircleOutline} /><p>Viaje Lleno</p></div>;
    }

    return (
      <IonButton expand="block" className="action-btn" onClick={handleJoinTrip}>
        Reservar Asiento (${trip.price || trip.priceValue})
      </IonButton>
    );
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/maindashboard/home" icon={chevronBackOutline} text="" />
          </IonButtons>
          <IonTitle>Detalles</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isPassenger && (
            <div className="confirmed-banner-container">
                <div className="confirmed-badge">
                    <IonIcon icon={checkmarkCircle}/>
                    <span>Viaje Confirmado</span>
                </div>
            </div>
        )}

        <div className="trip-route-container">
          <div className="route-point">
            <div className="dot origin"></div>
            <div className="route-text"><p className="label">ORIGEN</p><h3>{originDisplay}</h3></div>
          </div>
          <div className="route-line"></div>
          <div className="route-point">
            <IonIcon icon={locationOutline} className="dest-icon" />
            <div className="route-text"><p className="label">DESTINO</p><h3>{destDisplay}</h3></div>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item"><IonIcon icon={calendarOutline} /><div><p>FECHA</p><span>{dateDisplay}</span></div></div>
          <div className="info-item"><IonIcon icon={timeOutline} /><div><p>HORA</p><span>{timeDisplay}</span></div></div>
        </div>

        <div className="driver-info-card">
          <div className="driver-header"><IonIcon icon={carOutline} /><span>{trip.car || trip.vehicle || "Vehículo"}</span></div>
          <div className="driver-header" style={{marginTop: '10px'}}>
             <IonIcon icon={peopleOutline} />
             <span>{remainingSeats} asientos libres</span>
          </div>
        </div>

        {!isPassenger && !isDriver && (
            <div className="price-container-center">
                <IonIcon icon={cashOutline} />
                <span className="price-big">${trip.price || trip.priceValue}</span>
            </div>
        )}

        <div className="footer-action">{renderFooterAction()}</div>
        <IonLoading isOpen={loading} message="Procesando..." />
      </IonContent>
    </IonPage>
  );
};

export default TripDetails;