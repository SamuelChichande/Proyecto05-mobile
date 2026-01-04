import React, { useEffect, useState } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons, 
  IonButton, IonIcon, IonBadge, IonList, IonItem, 
  IonLabel, IonToggle, IonBackButton 
} from '@ionic/react';
import { 
  chevronBackOutline, createOutline, star, 
  personOutline, cardOutline, locationOutline, 
  notificationsOutline, shieldCheckmarkOutline, 
  personRemoveOutline
} from 'ionicons/icons';

import './UserProfile.css';

const UserProfile: React.FC = () => {
  // 1. Estado para el nombre completo
  const [fullName, setFullName] = useState<string>("Usuario");

  useEffect(() => {
    // 2. Recuperamos el nombre completo guardado en el Login
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            {/* 3. Cambiado a IonBackButton para mejor navegación en Ionic */}
            <IonBackButton defaultHref="/maindashboard/home" icon={chevronBackOutline} />
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
              alt="Perfil"
            />
          </div>
          {/* 4. Mostramos el nombre dinámico aquí */}
          <h2>{fullName}</h2>
          <div className="status-container">
            <IonBadge color="primary" className="custom-badge">Pasajero Verificado</IonBadge>
          </div>
        </div>

        {/* ... Resto del código se mantiene igual ... */}
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
          {/* ... otros items ... */}
        </IonList>
        
        {/* ... resto de la vista ... */}
        <div className="footer-actions">
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