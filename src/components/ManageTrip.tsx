import React from 'react';
import {
    IonPage, // ¡IMPORTANTE: Agrega esto!
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonNote,
    IonFooter,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonFab,
    IonFabButton,
    IonSpinner,
} from '@ionic/react';
import {
    arrowBackOutline,
    createOutline,
    carOutline,
    star,
    checkmarkCircleOutline,
    ellipsisHorizontal,
    chatbubbleOutline,
    closeCircleOutline,
    homeOutline,
    searchOutline,
    personOutline,
    addOutline,
    timeOutline,
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import './ManageTrip.css';

const ManageTrip: React.FC = () => {
    const location = useLocation();
    const [tripData, setTripData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Simular carga de datos
        const timer = setTimeout(() => {
            // Obtener datos del state
            const state = location.state as {
                tripId?: string;
                tripType?: string;
                isDriver?: boolean;
                tripData?: any;
            } || {};

            console.log('Datos recibidos:', state);

            // Si hay datos en el state, úsalos
            if (state.tripData) {
                setTripData(state.tripData);
            } else {
                // Si no hay datos, usa datos de ejemplo
                setTripData({
                    id: '1',
                    origin: 'Campus Central (Puerta 2)',
                    destination: 'Plaza Mayor, Centro Histórico',
                    time: '18:30',
                    date: 'Hoy',
                    seats: 4,
                    availableSeats: 3,
                    price: 15,
                    driverName: 'Tú (Conductor)',
                    carModel: 'Toyota Corolla • Gris',
                    status: 'pending'
                });
            }
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [location]);

    // Datos de ejemplo para pasajeros
    const passengers = [
        {
            id: 1,
            name: 'Tú (Conductor)',
            role: 'Conductor',
            rating: 4.8,
            car: 'Toyota Corolla • Gris',
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfg876WuH6FSG7p-NBlnSBlAetbui_eXmak7T2W1HEk_aXsz9AiLv3BrYifpeVRfsDjvUXf_zCCKcXKbU6XZr2bcbKp-exHUNvHpcSbIvASHNkPIUa_mWnngveDIfaMhi7VFD8ZsNdoJzIdp1B8gD2Jo0bpdA1XoN3vwM82y9Wss9reOvBS_Cyu51Bg2D0XQp3Ob3Y5XKtOMTB3Aa6QxdjDUFU_RJ_-BmsDtDfYC2WwkMfG95Zf2Mjpby-pM_Wi-eHzhdpVu86WvSD',
            status: 'confirmed',
            isDriver: true,
        },
        {
            id: 2,
            name: 'Sofía Martínez',
            role: 'Pasajero',
            rating: 4.5,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZuIZI12lKNt1sAScyTNfIYU3zHFiNNoxB264ti_JOav2BfN7CHUzmDmTW-5CrxckgjH1OwsiesDuGN__B-J-CgUrZ0HEWymAAK8puhAl6vVN3WMhkkfy6LKggA0DOJ7tvSCmLBMtOWZ294i1n55KVso69ZzOxfmf6KqGQDKFMslCmbbym4BT_yJYZZJqSIWAWid4lLu-OkxlGLBZOfrrF3S2I0T1XfJyDxk7ytFjYO-1tv2kTn6HH4_mnTp0H5oJIOXsUa-sgtgXN',
            status: 'confirmed',
            isDriver: false,
        },
        {
            id: 3,
            name: 'Carlos Ruiz',
            role: 'Pasajero',
            rating: 4.9,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6NlVjYa1H_lyicfYlrtkXh40kDfbENyosSBsg-Y4BYUZU8Q0owPstzYpFTTUqzjhoCootRuyNBF6F9oynVAn0s-keURVHtVl8t17ms0EUqx5woAhpB_fTBpOJ25N8iRQscYpTzRF6rudfGbc11GEu2tOG5raIYTaOeEzJw0kZ9SnSxdV-o_zNfelsTEyIi_tDu3-v1jnvAedMJmNv-35fXeE1GRr_3gPU02PapfGiNB0E_1uO13p1uSSI_bPbVaUQ7vqzGUD3qz1G',
            status: 'confirmed',
            isDriver: false,
        },
        {
            id: 4,
            name: 'Ana García',
            role: 'Pasajero',
            rating: 4.7,
            image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvrb-UinGwLHMzP3TpFR5y9vcfdJbbP8JodoPxzFgfmK6jEudpvpBO6SoUgeHE3LX8Jh1l56On7o4cGYK-0rEomR1rHUk1a4DXpEcoEER_2Zg92JC0krz1nwVhUiCpMqFCDwQw3IdXDydOz9EroKGIJ7nC245rSH3IUxwqyinXRIvgV34lgjOere2bwKfhOnYl9TSBtVndXvObihH-xERKDnrzC2kr6ge3nmuqr1uOfreMNwEF3GgtE4Fz71Q55-EOj_QptHE9jgmM',
            status: 'confirmed',
            isDriver: false,
        },
    ];

    if (loading) {
        return (
            <IonPage>
                <IonContent className="ion-padding">
                    <div className="loadingContainer">
                        <IonSpinner name="crescent" />
                        <p>Cargando viaje...</p>
                    </div>
                </IonContent>
            </IonPage>
        );
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
                {/* Tarjeta del viaje */}
                {tripData && (
                    <IonCard className="tripCard">
                        <div
                            className="tripHeaderImage"
                            style={{
                                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBvrb-UinGwLHMzP3TpFR5y9vcfdJbbP8JodoPxzFgfmK6jEudpvpBO6SoUgeHE3LX8Jh1l56On7o4cGYK-0rEomR1rHUk1a4DXpEcoEER_2Zg92JC0krz1nwVhUiCpMqFCDwQw3IdXDydOz9EroKGIJ7nC245rSH3IUxwqyinXRIvgV34lgjOere2bwKfhOnYl9TSBtVndXvObihH-xERKDnrzC2kr6ge3nmuqr1uOfreMNwEF3GgtE4Fz71Q55-EOj_QptHE9jgmM")'
                            }}
                        >
                            <div className="imageOverlay"></div>
                        </div>

                        <IonCardContent>
                            <div className="tripStatusContainer">
                                <IonChip color="primary" className="statusChip">
                                    <span className="pulseDot"></span>
                                    <IonLabel>Pendiente</IonLabel>
                                </IonChip>

                                <IonChip className="timeChip">
                                    <IonIcon icon={timeOutline} />
                                    <IonLabel>{tripData.time} • {tripData.date}</IonLabel>
                                </IonChip>
                            </div>

                            <div className="routeContainer">
                                <div className="routeLine">
                                    <div className="routeDotStart"></div>
                                    <div className="routeLineMiddle"></div>
                                    <div className="routeDotEnd"></div>
                                </div>

                                <div className="routeDetails">
                                    <div className="routePoint">
                                        <IonNote className="routeLabel">Origen</IonNote>
                                        <IonCardTitle className="routeAddress">
                                            {tripData.origin}
                                        </IonCardTitle>
                                    </div>

                                    <div className="routePoint">
                                        <IonNote className="routeLabel">Destino</IonNote>
                                        <IonCardTitle className="routeAddress">
                                            {tripData.destination}
                                        </IonCardTitle>
                                    </div>
                                </div>
                            </div>
                        </IonCardContent>
                    </IonCard>
                )}

                {/* Sección de pasajeros */}
                <div className="section">
                    <div className="sectionHeader">
                        <IonTitle size="large" className="sectionTitle">
                            Pasajeros <span className="sectionSubtitle">({passengers.filter(p => p.status === 'confirmed').length}/{passengers.length})</span>
                        </IonTitle>
                        <IonButton fill="clear" size="small" className="viewAllButton">
                            Ver todos
                        </IonButton>
                    </div>

                    <div className="passengersList">
                        {passengers.map((passenger) => (
                            <IonCard key={passenger.id} className="passengerCard">
                                <IonCardContent>
                                    <div className="passengerContent">
                                        <div className="passengerAvatarContainer">
                                            <IonAvatar className="passengerAvatar">
                                                <img src={passenger.image} alt={passenger.name} />
                                            </IonAvatar>
                                            {passenger.isDriver && (
                                                <div className="driverBadge">
                                                    <IonIcon icon={carOutline} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="passengerInfo">
                                            <div className="passengerNameRow">
                                                <IonCardTitle className="passengerName">
                                                    {passenger.name}
                                                </IonCardTitle>
                                                {passenger.rating && (
                                                    <div className="ratingBadge">
                                                        <IonBadge color="warning">{passenger.rating}</IonBadge>
                                                        <IonIcon icon={star} className="starIcon" />
                                                    </div>
                                                )}
                                            </div>

                                            {passenger.car && (
                                                <IonCardSubtitle className="carInfo">
                                                    {passenger.car}
                                                </IonCardSubtitle>
                                            )}

                                            {/* Estado simplificado - solo conductor o pasajero */}
                                            <div className="passengerStatus">
                                                {passenger.isDriver ? (
                                                    <div className="driverStatus">
                                                        <IonIcon icon={carOutline} color="primary" />
                                                        <IonNote color="primary">Conductor</IonNote>
                                                    </div>
                                                ) : (
                                                    <div className="riderStatus">
                                                        <IonIcon icon={personOutline} color="medium" />
                                                        <IonNote color="medium">Pasajero</IonNote>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Botón para acciones (solo para pasajeros no conductores) */}
                                        {!passenger.isDriver && (
                                            <IonButton fill="clear" className="moreButton">
                                                <IonIcon slot="icon-only" icon={ellipsisHorizontal} />
                                            </IonButton>
                                        )}
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        ))}
                    </div>
                </div>

                {/* Botón de cancelar */}
                <div className="cancelSection">
                    <IonButton
                        expand="block"
                        fill="clear"
                        color="danger"
                        className="cancelButton"
                    >
                        <IonIcon slot="start" icon={closeCircleOutline} />
                        Cancelar este viaje
                    </IonButton>
                    <IonNote className="cancelNote">
                        Puedes cancelar sin penalización hasta 30 minutos antes de la salida.
                    </IonNote>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ManageTrip;