import React, { useEffect, useState } from 'react';
import {
    IonContent, IonIcon, IonItem, IonAvatar,
    IonLabel, IonList, IonPage
} from '@ionic/react';
import { notifications } from 'ionicons/icons';

import './HomePage.css';
import RideCard from '../components/RideCard';
import QuickActions from '../components/QuickActions';

const HomePage: React.FC = () => {
    const [userName, setUserName] = useState<string>("Usuario");

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            const firstName = storedName.split(' ')[0];
            setUserName(firstName);
        }
    }, []);

    return (
        <IonPage>
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
                                {/* 3. Usamos la variable de estado aquí */}
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
                    <RideCard />
                    <h3>Accesos Rápidos</h3>
                    <QuickActions />
                </div>
            </IonContent>
        </IonPage>
    );
}

export default HomePage;