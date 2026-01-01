import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonChip,
  IonAvatar,
  IonAlert
} from '@ionic/react';
import {
  arrowBackOutline,
  settingsOutline,
  carOutline,
  personOutline,
  timeOutline,
  peopleOutline,
  chatbubbleOutline,
  chevronForwardOutline,
  addOutline,
  checkmarkCircleOutline,
  alertCircleOutline
} from 'ionicons/icons';
import './MyTravels.css';

const MyTravels: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<'upcoming' | 'past'>('upcoming');
  const [showAlert, setShowAlert] = useState(false);

  const passengers = [
    { id: 1, name: 'Sarah', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwaQrRtv4JSbcGwwIWzKQAorkiXac1961En5uBRwaccKw5v7avmvqA-YklBoFRYZO39P-wDpgUz7C37iV6sOoQL41xpJ-s1M9-tT3rnJ7zyA2eGCOeEsVU0xGgluwLAFte6pS6h7gA38XvGs7e2PpQUaglyikTBUXtqyMBsvLlUN7DRSLXjh9AgEqHTeHR14XTLKzEUi1RTGfOAK5oUChVB9TSWXcswaPhXxfIrKhOl5krd-A5C3DdMaqTqYOA9M6pO3wmO0Fqlg2_' },
    { id: 2, name: 'Mike', photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCisTCVpruqxTB8ywFlpynNJm4LbH-NN0cakGTkaGPuJ0HixWhka3E4rtdAEPt8eOW9797vBSdlktPZAkY0_xZYWUq59fokDk9hhVCeU-mlMMuWdYTN6HWn1kIDfZkfPSuIbdeqFCdrSzrNqYDlxDP197Vs3KPybq90htWSe0y0K04PncbrAoSBKtIT095QF0Ayc_0rhyK14uoMzqWwVlr9UjMKyymatCMnh28Hnqas-AdSDSyGtvbrdfG0LF3NPscxX1E_RY8jJK2t' }
  ];

  const handleCreateTrip = () => {
    // Navegar a la pantalla de crear viaje
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="my-trips-toolbar">
          <IonButton fill="clear" slot="start" className="back-button">
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
          
          <IonTitle className="my-trips-title">Mis Viajes</IonTitle>
          
          <IonButton fill="clear" slot="end" className="settings-button">
            <IonIcon slot="icon-only" icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="my-trips-content">
        {/* Segment Buttons */}
        <div className="segment-container">
          <IonSegment 
            value={selectedSegment} 
            onIonChange={e => setSelectedSegment(e.detail.value as any)}
            className="custom-segment"
          >
            <IonSegmentButton value="upcoming" className="segment-button">
              <IonLabel>Próximos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="past" className="segment-button">
              <IonLabel>Pasados</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Section: Hoy */}
        <div className="section-container">
          <h2 className="section-title">Hoy</h2>
          
          {/* Card 1: Driver Role */}
          <IonCard className="trip-card driver-card">
            <div className="card-header-image">
              <div 
                className="map-image"
                style={{ 
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC7R-10Ar0P9vlSF1cHMqpPBmJfVS6CIl5-fVanD9Kg2p08WF_ZCQyoAVNXN39Xus-N-SmtreMZ1ZFhn0xZcRLMaefRK7gq7RzDXdLz-D86yra5Jvv8KrkSLsuHGvDF5cUh3SrCRv0FiRCOxzWivrR_VBLQ96ZSMT8mSuB9uKdhF_HJPGBlkMq7Tp2ZLx0Ngl9kCAKX1ImSCa70gk7nWS_9zAXGguwohgngB3R16TYK-cb0uV9lKcV0D166Pu-P1DbQEzXR7WNtNj9j")' 
                }}
              />
              <div className="image-overlay"></div>
              
              <div className="card-badges">
                <IonChip className="driver-badge">
                  <IonIcon icon={carOutline} />
                  <span>Conductor</span>
                </IonChip>
                <IonChip className="confirmed-badge">
                  <IonIcon icon={checkmarkCircleOutline} />
                  <span>Confirmado</span>
                </IonChip>
              </div>
              
              <div className="card-header-info">
                <p className="trip-date">Jueves, 24 Oct</p>
                <h3 className="trip-route">Madrid <span className="route-arrow">➝</span> Valencia</h3>
              </div>
            </div>
            
            <IonCardContent className="card-content">
              {/* Time and Duration */}
              <div className="time-section">
                <div className="time-info">
                  <span className="time-label">Salida</span>
                  <span className="time-value">14:00</span>
                </div>
                
                <div className="duration-section">
                  <div className="duration-line">
                    <div className="line-start"></div>
                    <div className="line-end"></div>
                  </div>
                  <span className="duration-text">3h 30m</span>
                </div>
                
                <div className="time-info">
                  <span className="time-label">Llegada</span>
                  <span className="time-value">17:30</span>
                </div>
              </div>
              
              {/* Passengers and Price */}
              <div className="passengers-section">
                <div className="passengers-info">
                  <div className="passengers-avatars">
                    {passengers.map((passenger, index) => (
                      <IonAvatar key={passenger.id} className={`passenger-avatar ${index > 0 ? 'avatar-overlap' : ''}`}>
                        <img src={passenger.photo} alt={passenger.name} />
                      </IonAvatar>
                    ))}
                    <div className="more-passengers">+1</div>
                  </div>
                  <span className="passengers-count">3 Pasajeros</span>
                </div>
                
                <div className="price-section">
                  <span className="trip-price">25,00€</span>
                </div>
              </div>
              
              {/* Action Button */}
              <IonButton expand="block" className="view-passengers-btn">
                <IonIcon icon={peopleOutline} slot="start" />
                Ver Pasajeros
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Section: Mañana */}
        <div className="section-container">
          <h2 className="section-title">Mañana</h2>
          
          {/* Card 2: Passenger Role */}
          <IonCard className="trip-card passenger-card">
            <IonCardContent>
              <div className="card-header-row">
                <IonChip className="passenger-badge">
                  <IonIcon icon={personOutline} />
                  <span>Pasajero</span>
                </IonChip>
                
                <div className="status-badge pending">
                  <IonIcon icon={alertCircleOutline} />
                  <span>Pendiente de aprobación</span>
                </div>
              </div>
              
              <div className="card-content-row">
                <div className="trip-info">
                  <h3 className="trip-route">Barcelona ➝ Zaragoza</h3>
                  <p className="trip-details">09:30 • Toyota Prius • Conductor: Alex</p>
                </div>
                
                <div className="car-thumbnail">
                  <div 
                    className="car-image"
                    style={{ 
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdFC0pBCtu57Xlf87DORUm8E1cbVxQlxdmHl9J6CQBdHj5miIMaJHJv3Z0bsI2k-rOu35-aLB2yatIlSG_TwsPIcDyo0txk0z4GaVqfNnT3lwyOEVBE58rnZuKSG9VVugJV3demBwkHQG26LjulbGB3fdcKG2Z0lzEbfjimMxm9H1vEmaC8TygwzlKVfyjhwvZIv-CBWJRHrX4hAtmL-WTCM4R2WXigReyEg9_BODwY-ilR0gW5k4GGc8bel94YxfsCrnVDEFH7pJi")' 
                    }}
                  />
                </div>
              </div>
              
              <div className="card-footer-row">
                <span className="trip-price">18,50€</span>
                
                <div className="action-buttons">
                  <IonButton fill="clear" className="chat-btn">
                    <IonIcon icon={chatbubbleOutline} />
                  </IonButton>
                  <IonButton className="details-btn">
                    Detalles
                  </IonButton>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
          
          {/* Card 3: Upcoming Simple */}
          <IonCard className="trip-card upcoming-card">
            <IonCardContent>
              <div className="upcoming-content">
                <div className="date-box">
                  <span className="date-month">Oct</span>
                  <span className="date-day">28</span>
                </div>
                
                <div className="upcoming-info">
                  <h3 className="trip-route">Sevilla ➝ Málaga</h3>
                  <p className="trip-details">18:00 • 1 Asiento</p>
                </div>
                
                <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
              </div>
            </IonCardContent>
          </IonCard>
        </div>
        
        <div className="spacer"></div>
      </IonContent>

      {/* Floating Action Button */}
      <div className="fab-container">
        <IonButton className="create-trip-fab" onClick={handleCreateTrip}>
          <IonIcon icon={addOutline} slot="start" />
          Publicar Viaje
        </IonButton>
      </div>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Crear Viaje"
        message="Esta función te llevará a la pantalla de crear un nuevo viaje."
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel'
          },
          {
            text: 'Continuar',
            handler: () => {
              // Aquí iría la navegación a la pantalla de crear viaje
              console.log('Navegar a crear viaje');
            }
          }
        ]}
      />
    </IonPage>
  );
};

export default MyTravels;