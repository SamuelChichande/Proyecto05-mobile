import React, { useEffect, useState } from 'react';
import {
    IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
    IonButton, IonIcon, IonLabel, IonAvatar, IonBadge,
    IonCard, IonCardContent, IonCardTitle,
    IonChip, IonNote, IonButtons
} from '@ionic/react';
import {
    arrowBackOutline, timeOutline, carOutline, star,
    closeCircleOutline, personOutline, ellipsisHorizontal
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
// @ts-ignore
import { getUserById, deleteTrip } from '../config/database';
import './ManageTrip.css';

const ManageTrip: React.FC = () => {
    const location = useLocation<{ trip: any }>();
    const tripData = location.state?.trip;

    if (!tripData) {
        return (
            <IonPage>
                <IonHeader><IonToolbar><IonButtons slot="start"><IonButton routerLink="/maindashboard/home"><IonIcon icon={arrowBackOutline} /></IonButton></IonButtons><IonTitle>Error</IonTitle></IonToolbar></IonHeader>
                <IonContent className="ion-padding"><p>No se cargó la información.</p></IonContent>
            </IonPage>
        );
    }

    const originDisplay = tripData.origin || tripData.startPoint;
    const destDisplay = tripData.destination || tripData.endPoint;
    const timeDisplay = tripData.time || tripData.timeTravel;
    const passengersCount = tripData.passengersID ? tripData.passengersID.length : 0;
    const tripId = tripData.id || 'unknown';
    const userId = localStorage.getItem('idUser') || '1';

    const [passengers, setPassengers] = useState<any[]>([
        {
            id: userId,
            name: 'Tú (Conductor)',
            role: 'Conductor',
            rating: tripData?.rating || 0.0,
            image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            isDriver: true,
        }
    ]);

    useEffect(() => {
        const loadPassengerData = async () => {
            if (!tripData?.passengersID) return;

            const updatedPassengers = [...passengers]; // Copia del conductor inicial
            
            for (let i = 0; i < tripData.passengersID.length; i++) {
                const pid = tripData.passengersID[i];
                try {
                    const res = await getUserById(pid);
                    if (res.status === 'success') {
                        const pInfo = res.data;
                        updatedPassengers.push({
                            id: pid,
                            name: pInfo.name || `Pasajero ${i + 1}`,
                            role: 'Pasajero',
                            rating: pInfo.rating || null,
                            image: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                            isDriver: false,
                        });
                    } else {
                        console.error("Error loading passenger data for ID:", pid);
                    }
                } catch (error) {
                    console.error("Exception loading passenger data for ID:", pid, error);
                }
            }
            
            setPassengers(updatedPassengers);
        };

        loadPassengerData();
    }, [tripData]);

    const handleCancelTrip = () => {
        try {
            deleteTrip(tripId);
            alert("Viaje cancelado exitosamente.");
            window.dispatchEvent(new Event('trip-cancelled'));
            window.location.href = '/maindashboard/home';
        } catch (error) {
            console.error("Error cancelando el viaje:", error);
            alert("Error al cancelar el viaje. Intenta nuevamente.");
        }
    }

    return (
        <IonPage>
            <IonHeader className="header">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/maindashboard/home">
                            <IonIcon slot="icon-only" icon={arrowBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className="title">Gestionar Viaje</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen className="ion-padding">
                <IonCard className="tripCard">
                    <div className="tripHeaderImage" style={{ backgroundImage: 'url("https://img.freepik.com/free-vector/city-skyline-concept-illustration_114360-8923.jpg")' }}>
                        <div className="imageOverlay"></div>
                    </div>

                    <IonCardContent>
                        <div className="tripStatusContainer">
                            <IonChip color="primary" className="statusChip"><span className="pulseDot"></span><IonLabel>Activo</IonLabel></IonChip>
                            <IonChip className="timeChip"><IonIcon icon={timeOutline} /><IonLabel>{timeDisplay} • {tripData.date}</IonLabel></IonChip>
                        </div>

                        <div className="routeContainer">
                            <div className="routeLine"><div className="routeDotStart"></div><div className="routeLineMiddle"></div><div className="routeDotEnd"></div></div>
                            <div className="routeDetails">
                                <div className="routePoint"><IonNote className="routeLabel">Origen</IonNote><IonCardTitle className="routeAddress">{originDisplay}</IonCardTitle></div>
                                <div className="routePoint"><IonNote className="routeLabel">Destino</IonNote><IonCardTitle className="routeAddress">{destDisplay}</IonCardTitle></div>
                            </div>
                        </div>
                    </IonCardContent>
                </IonCard>

                <div className="section">
                    <div className="sectionHeader">
                        <IonTitle size="large" className="sectionTitle">
                            Pasajeros <span className="sectionSubtitle">({passengersCount}/{tripData.seats || 4})</span>
                        </IonTitle>
                    </div>

                    <div className="passengersList">
                        {passengers.map((passenger) => (
                            <IonCard key={passenger.id} className="passengerCard">
                                <IonCardContent>
                                    <div className="passengerContent">
                                        <div className="passengerAvatarContainer">
                                            <IonAvatar className="passengerAvatar"><img src={passenger.image} alt={passenger.name} /></IonAvatar>
                                            {passenger.isDriver && <div className="driverBadge"><IonIcon icon={carOutline} /></div>}
                                        </div>
                                        <div className="passengerInfo">
                                            <div className="passengerNameRow">
                                                <IonCardTitle className="passengerName">{passenger.name}</IonCardTitle>
                                                {passenger.rating && <div className="ratingBadge"><IonBadge color="warning">{passenger.rating}</IonBadge><IonIcon icon={star} className="starIcon" /></div>}
                                            </div>
                                            <div className="passengerStatus">
                                                {passenger.isDriver ?
                                                    <div className="driverStatus"><IonIcon icon={carOutline} color="primary" /><IonNote color="primary">Conductor</IonNote></div> :
                                                    <div className="riderStatus"><IonIcon icon={personOutline} color="medium" /><IonNote color="medium">Pasajero</IonNote></div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>
                </div>

                <div className="cancelSection">
                    <IonButton
                        fill="solid"
                        color="danger"
                        shape="round"
                        className="cancel-trip-btn"
                        onClick={handleCancelTrip}
                    >
                        <IonIcon slot="start" icon={closeCircleOutline} />
                        Cancelar este viaje
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};
export default ManageTrip;