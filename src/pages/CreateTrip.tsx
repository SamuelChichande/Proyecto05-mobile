import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonLabel, IonInput, IonGrid, IonRow, IonCol, IonAlert
} from '@ionic/react';
import {
  closeOutline, locationOutline, calendarOutline, timeOutline,
  peopleOutline, removeOutline, addOutline, trendingDownOutline, arrowForwardOutline
} from 'ionicons/icons';
import './CreateTrip.css';
// @ts-ignore
import { saveTrip } from '../config/database';

const CreateTrip: React.FC = () => {
  const [seats, setSeats] = useState(3);
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('2026-01-20');
  const [time, setTime] = useState('08:30');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleDecreaseSeats = () => { if (seats > 1) setSeats(seats - 1); };
  const handleIncreaseSeats = () => { if (seats < 8) setSeats(seats + 1); };

  const handlePublish = async () => {
    const currentUserId = localStorage.getItem('idUser');

    if (!currentUserId) {
        alert("Error: No se identificó al usuario. Inicia sesión nuevamente.");
        return;
    }

    const result = await saveTrip(
        origin, 
        destination, 
        date, 
        time, 
        "0 min",
        seats, 
        "Vehículo Registrado",
        price, 
        currentUserId,
        []
    );

    if (result.status === 'success') {
        setShowAlert(true);
        // Disparar evento para recargar HomePage
        window.dispatchEvent(new Event('trip-created'));
    } else {
        alert("Error al publicar: " + result.message);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="create-trip-toolbar">
          <IonButton fill="clear" slot="start" className="close-button" onClick={() => history.goBack()}>
            <IonIcon slot="icon-only" icon={closeOutline} />
          </IonButton>
          <IonTitle className="create-trip-title">Publicar viaje</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="create-trip-content">
        <div className="form-container">
          <div className="route-card">
            <div className="route-item">
              <div className="route-icon"><div className="origin-dot"></div></div>
              <div className="route-input">
                <IonLabel className="route-label">ORIGEN</IonLabel>
                <IonInput className="route-input-field" placeholder="¿De dónde sales?" value={origin} onIonChange={(e) => setOrigin(e.detail.value!)} />
              </div>
            </div>
            <div className="route-connector"><div className="connector-line"></div></div>
            <div className="route-item">
              <div className="route-icon"><IonIcon icon={locationOutline} className="destination-icon" /></div>
              <div className="route-input">
                <IonLabel className="route-label">DESTINO</IonLabel>
                <IonInput className="route-input-field" placeholder="¿A dónde vas?" value={destination} onIonChange={(e) => setDestination(e.detail.value!)} />
              </div>
            </div>
          </div>

          <IonGrid className="datetime-grid">
            <IonRow>
              <IonCol>
                <div className="datetime-card">
                  <div className="datetime-header"><IonIcon icon={calendarOutline} /><span>FECHA</span></div>
                  <input type="date" className="datetime-input" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </IonCol>
              <IonCol>
                <div className="datetime-card">
                  <div className="datetime-header"><IonIcon icon={timeOutline} /><span>HORA</span></div>
                  <input type="time" className="datetime-input" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>

          <div className="seats-card">
            <div className="seats-header">
              <div className="seats-icon"><IonIcon icon={peopleOutline} /></div>
              <span className="seats-label">Plazas disponibles</span>
            </div>
            <div className="seats-control">
              <IonButton fill="clear" onClick={handleDecreaseSeats} disabled={seats <= 1}><IonIcon icon={removeOutline} /></IonButton>
              <span className="seats-count">{seats}</span>
              <IonButton fill="clear" onClick={handleIncreaseSeats} disabled={seats >= 8}><IonIcon icon={addOutline} /></IonButton>
            </div>
          </div>

          <div className="price-card">
            <IonLabel className="price-label">Precio por pasajero</IonLabel>
            <div className="price-input-container">
              <IonIcon icon={trendingDownOutline} className="price-currency" />
              <IonInput type="number" className="price-input" placeholder="0.00" value={price} onIonChange={(e) => setPrice(e.detail.value!)} />
              <div className="price-recommended"><IonIcon icon={trendingDownOutline} /><span>Recomendado</span></div>
            </div>
            <p className="price-suggestion">Precio sugerido: 1.50$ - 2.50$</p>
          </div>
        </div>

        <IonButton className="publish-button" expand="block" onClick={handlePublish}>
          <span>Publicar Viaje</span>
          <IonIcon icon={arrowForwardOutline} />
        </IonButton>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => { setShowAlert(false); history.goBack(); }}
        header="Viaje Publicado"
        message="Tu viaje ha sido publicado exitosamente."
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default CreateTrip;