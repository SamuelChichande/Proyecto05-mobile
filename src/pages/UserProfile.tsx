import React from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons, 
  IonButton, IonIcon, IonBadge, IonList, IonItem, 
  IonLabel, IonToggle 
} from '@ionic/react';
import { 
  chevronBackOutline, createOutline, checkmarkCircle, star, 
  personOutline, cardOutline, locationOutline, 
  notificationsOutline, shieldCheckmarkOutline, 
  personRemoveOutline
} from 'ionicons/icons';

import './UserProfile.css';

const UserProfile: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="dark" onClick={() => window.history.back()}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle className="ion-text-center">Mi Perfil</IonTitle>
          <IonButtons slot="end">
            <IonButton color="primary">
              <IonIcon icon={createOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="profile-header-container">
          <div className="avatar-wrapper">
            <img 
              className="profile-image"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwr_zZjgvmu4BccwDNIHic8K5dyehw7cSYA&s" 
              alt="Carlos"
            />
          </div>
          <h2>Carlos Rodriguez</h2>
          <div className="status-container">
            <IonBadge color="primary" className="custom-badge">Pasajero Verificado</IonBadge>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">4.9 <IonIcon icon={star} className="star-icon" /></span>
            <span className="stat-label">CALIFICACIÓN</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">124</span>
            <span className="stat-label">VIAJES</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">3</span>
            <span className="stat-label">AÑOS</span>
          </div>
        </div>

        <h3 className="section-title">CUENTA</h3>
        <IonList inset={true} className="custom-list">
          <IonItem button detail={true} lines="full">
            <div className="icon-box blue" slot="start">
              <IonIcon icon={personOutline} />
            </div>
            <IonLabel>
              <h2>Datos Personales</h2>
              <p>Email, Teléfono</p>
            </IonLabel>
          </IonItem>
          
          <IonItem button detail={true} lines="full">
            <div className="icon-box green" slot="start">
              <IonIcon icon={cardOutline} />
            </div>
            <IonLabel>
              <h2>Métodos de Pago</h2>
              <p>Visa •••• 4242</p>
            </IonLabel>
          </IonItem>

          <IonItem button detail={true} lines="none">
            <div className="icon-box purple" slot="start">
              <IonIcon icon={locationOutline} />
            </div>
            <IonLabel>
              <h2>Lugares Guardados</h2>
              <p>Casa, Trabajo</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <h3 className="section-title">CONFIGURACIÓN</h3>
        <IonList inset={true} className="custom-list">
          <IonItem lines="full">
            <div className="icon-box gray" slot="start">
              <IonIcon icon={notificationsOutline} />
            </div>
            <IonLabel>Notificaciones</IonLabel>
            <IonToggle slot="end" color="primary" defaultChecked />
          </IonItem>

          <IonItem button detail={true} lines="full">
            <div className="icon-box gray" slot="start">
              <IonIcon icon={shieldCheckmarkOutline} />
            </div>
            <IonLabel>Privacidad y Seguridad</IonLabel>
          </IonItem>

          <IonItem button detail={true} lines="none">
            <div className="icon-box gray" slot="start">
              <IonIcon icon={personRemoveOutline} />
            </div>
            <IonLabel>Usuarios Bloqueados</IonLabel>
          </IonItem>
        </IonList>

              <div className="footer-actions">
                  {/* Quitamos expand="block" para que respete el ancho del CSS */}
                  <IonButton fill="clear" color="danger" className="logout-btn">
                      Cerrar Sesión
                  </IonButton>
                  <p className="version-text">Versión 2.4.0 (Build 102)</p>
              </div>
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;