import React, { useState } from 'react';
import {
    IonContent, IonIcon, IonItem, IonAvatar,
    IonLabel, IonList, IonPage, IonButton, useIonRouter
} from '@ionic/react';
import { notifications, car } from 'ionicons/icons';

import './HomePage.css';
import RideCard from '../components/RideCard';
import QuickActions from '../components/QuickActions';

interface Trip {
    title: string;
    timeTravel: string;
    startPoint: string;
    endPoint: string;
    driverName: string;
    vehicle: string;
    rating: string;
    tripCount: string;
    priceValue: string;
    priceUnit: string;
}

const HomePage: React.FC = () => {
    const userName = "Alex";
    const router = useIonRouter();

    const [nextTrip, setNextTrip] = useState<Trip | null>(null);

    return (
        <IonPage> {/* AGREGADO: Obligatorio para que la vista cambie */}
            <IonContent className="ion-padding">
                <IonList inset={true} style={{ 'background': 'transparent', 'margin': '0' }}>
                    <IonItem className="welcome-item">
                        <IonAvatar className="welcome-avatar">
                            <img
                                alt="Avatar"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwr_zZjgvmu4BccwDNIHic8K5dyehw7cSYA&s"
                            />
                        </IonAvatar>
                        <div className="welcome-content">
                            <sub className="welcome-subtitle">
                                BIENVENIDO
                            </sub>
                            <IonLabel className="welcome-title">
                                Hola, {userName}
                            </IonLabel>
                        </div>
                        <IonIcon
                            icon={notifications}
                            slot='end'
                            size='large'
                            className="notification-icon"
                        />
                    </IonItem>
                </IonList>
                <div className="dashboard-container">
                    <h3>Tu Próximo Viaje</h3>
                    {nextTrip ? (
                        <RideCard trip={nextTrip} />
                    ) : (
                        <div className="no-trips-message">
                            <IonIcon icon={car} size="large" color="medium" />
                            <h4>No tiene viajes establecidos</h4>
                            <IonButton fill="outline" onClick={() => router.push('/maindashboard/create-trip')}>
                                Crear un viaje
                            </IonButton>
                        </div>
                    )}
                    <h3>Accesos Rápidos</h3>
                    <QuickActions />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default HomePage;