import React, { useEffect, useState } from 'react';
import {
  IonContent, IonHeader, IonPage, IonToolbar, IonTitle, IonButtons,
  IonButton, IonIcon, IonBadge, IonList, IonItem,
  IonLabel, IonToggle, IonBackButton, IonSpinner
} from '@ionic/react';
import {
  chevronBackOutline, createOutline, star,
  personOutline, cardOutline, locationOutline,
  notificationsOutline, shieldCheckmarkOutline,
  personRemoveOutline, logOutOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';


import './UserProfile.css';

const UserProfile: React.FC = () => {
  // 1. Estado para el nombre completo
  const [fullName, setFullName] = useState<string>("Usuario");
  const [rating, setRating] = useState<number>(0.0);
  const [tripCount, setTripCount] = useState<number>(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // 2. Recuperamos el nombre completo guardado en el Login
    const storedName = localStorage.getItem('userName');
    const storedRating = localStorage.getItem('rating');
    const storedTripCount = localStorage.getItem('DriverTripsCount') || "0";
    if (storedName) {
      setFullName(storedName);
    }
    if (storedRating) {
      setRating(parseFloat(storedRating));
    }
    if (storedTripCount) {
      setTripCount(parseInt(storedTripCount, 10));
    }
  }, []);

  const handleLogout = () => {
    try {
      setLoggingOut(true);
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      /*
        console.error('Error en reset:', error);
        // Fallback simple
        localStorage.clear();
        window.location.href = '/';
        */
    }
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            {/* 3. Cambiado a IonBackButton para mejor navegación en Ionic */}
            <IonBackButton defaultHref="/maindashboard/home" icon={chevronBackOutline} />
          </IonButtons>
          <IonTitle className="ion-text-center">Mi Perfil</IonTitle>
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
            <IonBadge color="primary" className="custom-badge">Usuario Verificado</IonBadge>
          </div>
        </div>

        {/* ... Resto del código se mantiene igual ... */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{rating} <IonIcon icon={star} className="star-icon" /></span>
            <span className="stat-label">CALIFICACIÓN</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{tripCount}</span>
            <span className="stat-label">VIAJES</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">0</span>
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
          <IonButton fill="clear" color="danger" className="logout-btn" onClick={handleLogout}>
            {loggingOut ? (
              <>
                <IonSpinner name="crescent" slot="start" />
                Cerrando sesión...
              </>
            ) : (
              <>
                <IonIcon icon={logOutOutline} slot="start" />
                Cerrar Sesión
              </>
            )}

          </IonButton>
          <p className="version-text">Versión 2.4.0 (Build 102)</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserProfile;