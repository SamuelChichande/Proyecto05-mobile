import React from 'react';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonIcon,
    IonButton,
    IonAvatar,
    IonBadge,
    IonFooter
} from '@ionic/react';
import { 
    shareOutline, 
    chevronBackOutline, 
    star, 
    checkmarkCircle, 
    chatbubbleEllipsesOutline,
    locationOutline,
    radioButtonOffOutline,
    carOutline,
    banOutline,
    pawOutline,
    musicalNotesOutline,
    snowOutline
} from 'ionicons/icons';
import './TripDetails.css';

const TripDetails: React.FC = () => {
    return (
        <IonPage id="trip-details-page">
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/maindashboard/home" icon={chevronBackOutline} />
                    </IonButtons>
                    <IonTitle>Detalles del Viaje</IonTitle>
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon slot="icon-only" icon={shareOutline} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                {/* Map Section Placeholder */}
                <div className="map-container">
                    <div className="map-overlay">
                        <div className="time-badge">
                            <IonIcon icon={carOutline} />
                            <span>3h 45m</span>
                        </div>
                    </div>
                </div>

                {/* Route Timeline */}
                <div className="timeline-container">
                    <div className="timeline-item">
                        <div className="timeline-icon">
                            <IonIcon icon={radioButtonOffOutline} color="primary" />
                            <div className="timeline-line"></div>
                        </div>
                        <div className="timeline-content">
                            <h3>08:30 AM</h3>
                            <p className="city">Madrid</p>
                            <p className="location">Estación Atocha, Puerta 3</p>
                        </div>
                    </div>
                    
                    <div className="timeline-item">
                        <div className="timeline-icon">
                            <IonIcon icon={locationOutline} color="primary" />
                        </div>
                        <div className="timeline-content">
                            <h3>12:45 PM</h3>
                            <p className="city">Valencia</p>
                            <p className="location">Estación del Norte</p>
                        </div>
                    </div>
                </div>

                <hr className="divider" />

                {/* Driver Profile */}
                <section className="section">
                    <h3>Conductor</h3>
                    <div className="driver-card">
                        <div className="driver-header">
                            <div className="avatar-wrapper">
                                <IonAvatar className="driver-avatar">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZR9jH_vmlzMZEZVBrafZtNif4Y7SaWVHcE-T33XHJm7pe8PoyY9EtN0r3sFq4ZSr0r4oJdwtYA9MHovk1uRGsie5y0cSq7FgIFVN2LDBQrKlIAElaAwBh4wi5YTcJZhUhHS49iUacEscVrtwkTQHuxTvwjS87dNoVZnkuUqIY2n5BFoa3iRW5nr7GUdqHErLsj-0MCfavk-cgl-z_r5mlFMenC-pUucQccu1bF54HrjmSqpL6TqbBRMv_42xwV-LTwU672g2kt-PL" alt="Carlos" />
                                </IonAvatar>
                                <div className="rating-badge">
                                    4.9 <IonIcon icon={star} />
                                </div>
                            </div>
                            <div className="driver-info">
                                <div className="name-row">
                                    <h4>Carlos M.</h4>
                                    <IonIcon icon={checkmarkCircle} color="secondary" />
                                </div>
                                <p>Toyota Prius • Azul Oscuro</p>
                                <IonBadge color="success">Super Driver</IonBadge>
                            </div>
                            <IonButton fill="clear" color="medium" className="chat-btn">
                                <IonIcon slot="icon-only" icon={chatbubbleEllipsesOutline} />
                            </IonButton>
                        </div>
                        <p className="driver-bio">
                            ¡Hola! Soy puntual y me gusta la buena música. Hago paradas cortas si es necesario. ¡Bienvenidos!
                        </p>
                    </div>
                </section>

                {/* Passengers */}
                <section className="section">
                    <div className="section-header">
                        <h3>Pasajeros</h3>
                        <span>2/4 ocupados</span>
                    </div>
                    <div className="passengers-list">
                        <div className="passenger-item">
                            <IonAvatar><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHNyLyCpa2STTwB8LYmaYeX5mBOPqRVjKvBihWHWQE40l6npAZQ5Z7RbbQP40IVOCXElt8Dyg59_-nslAY9X8sUJahlA79RNquT_zql5yuPx0CSYA8mNJDTYZ0ejxzdXQihcREqKyTnD0kPpixeEl_FN8zaMZxyzjj6Deq7aDAHFx7c64YG-rff3OOuRaAbOKqN6Wm9EFEHRmNDH7wAODUpPElWxtDuT3XGRzqLHmXkRwSe42WzLJc7V4-VO9dwkJXYPCTSMmPTtQ6" alt="Ana" /></IonAvatar>
                            <span>Ana</span>
                        </div>
                        <div className="passenger-item">
                            <IonAvatar><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoeLf4S0km2j9TG3o3pMffQA13ZDmNDMD_c-beIj1ursUyBjE37_03_yxSEb5nA_ZTBa_SArvjcQ0VZGUGWoLVNdwXy0swbfGjZEUOhiAKl6b7_IN9CrwxUSwGotQtt-d36l4Gj4RwcfCXmixvy8eooW_KbwLobGsHRi0y7W5i3EPVmcASkqvi4RapbSqRic56_la3tK87sreBL0Q_Mzuh6n2UhQ0Ds9oFnCi1woaIGJVVFR-my_Gm7GUegKKqtCrhg9Uj8HT2dxck" alt="Luis" /></IonAvatar>
                            <span>Luis</span>
                        </div>
                        <div className="passenger-item empty">
                            <div className="empty-seat"></div>
                            <span>Libre</span>
                        </div>
                    </div>
                </section>

                {/* Preferences */}
                <section className="section">
                    <h3>Preferencias</h3>
                    <div className="tags-container">
                        <span className="chip"><IonIcon icon={banOutline} /> Sin fumar</span>
                        <span className="chip"><IonIcon icon={pawOutline} /> Mascotas OK</span>
                        <span className="chip"><IonIcon icon={musicalNotesOutline} /> Música</span>
                        <span className="chip"><IonIcon icon={snowOutline} /> A/C</span>
                    </div>
                </section>
            </IonContent>

            <IonFooter className="ion-no-border trip-footer">
                <div className="footer-content">
                    <div className="price-section">
                        <p>Precio total por 1 pasajero</p>
                        <span className="price-value">25,00 €</span>
                    </div>
                    <div className="action-row">
                        <IonButton fill="clear" className="footer-chat-btn">
                            <IonIcon slot="icon-only" icon={chatbubbleEllipsesOutline} />
                        </IonButton>
                        <IonButton expand="block" className="book-btn">
                            Reservar Asiento
                        </IonButton>
                    </div>
                </div>
            </IonFooter>
        </IonPage>
    );
};

export default TripDetails;