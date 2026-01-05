import React from 'react';
import {
    IonButton,
    IonAvatar,
    IonIcon,
    useIonRouter // IMPORTANTE: Hook para navegar
} from '@ionic/react';
import {
    navigate,
    star,
    car
} from 'ionicons/icons';
import './RideCard.css';

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

const RideCard: React.FC<{ trip: Trip }> = ({ trip }) => {
    // 1. Inicializamos el router de Ionic
    const router = useIonRouter();

    // 2. Definimos la función de navegación
    const handleViewDetails = () => {
        // Navega a la ruta que definimos en MainDashboard
        router.push('/maindashboard/trip-details', 'forward', 'push');
    };

    return (
        <div className="rideCardNoImage">
            {/* Header */}
            <div className="rideCardHeader">
                <div>
                    <h3 className="rideCardTitle">{trip.title}</h3>
                </div>
                <div className="rideCardTimeBadge">{trip.timeTravel}</div>
            </div>

            {/* Ruta */}
            <div className="rideCardRouteSection">
                <div className="rideCardRoutePoints">
                    <div className="rideCardPoint">
                        <div className="rideCardPointDotStart"></div>
                        <span className="rideCardPointName">{trip.startPoint}</span>
                    </div>

                    <IonIcon icon={navigate} className="rideCardRouteIcon" />

                    <div className="rideCardPoint">
                        <div className="rideCardPointDotEnd"></div>
                        <span className="rideCardPointName">{trip.endPoint}</span>
                    </div>
                </div>
                <div className="rideCardRouteLine"></div>
            </div>

            {/* Información del conductor */}
            <div className="rideCardDriverInfo">
                <IonAvatar className="rideCardDriverAvatar">
                    <img alt="Driver" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZuIZI12lKNt1sAScyTNfIYU3zHFiNNoxB264ti_JOav2BfN7CHUzmDmTW-5CrxckgjH1OwsiesDuGN__B-J-CgUrZ0HEWymAAK8puhAl6vVN3WMhkkfy6LKggA0DOJ7tvSCmLBMtOWZ294i1n55KVso69ZzOxfmf6KqGQDKFMslCmbbym4BT_yJYZZJqSIWAWid4lLu-OkxlGLBZOfrrF3S2I0T1XfJyDxk7ytFjYO-1tv2kTn6HH4_mnTp0H5oJIOXsUa-sgtgXN" />
                </IonAvatar>

                <div className="rideCardDriverDetails">
                    <div className="rideCardDriverHeader">
                        <h4 className="rideCardDriverName">{trip.driverName}</h4>
                        <div className="rideCardVehicleInfo">
                            <IonIcon icon={car} className="rideCardVehicleIcon" />
                            <span className="rideCardVehicleText">{trip.vehicle}</span>
                        </div>
                    </div>

                    <div className="rideCardDriverRating">
                        <div className="rideCardRatingStars">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <IonIcon key={index} icon={star} className="rideCardStarIcon" />
                            ))}
                        </div>
                        <span className="rideCardRatingText">{trip.rating}</span>
                        <span className="rideCardTripCount">{trip.tripCount}</span>
                    </div>
                </div>
            </div>

            {/* Footer con precio y botón */}
            <div className="rideCardFooter">
                <IonButton
                    fill="solid"
                    color="primary"
                    className="rideCardActionButton"
                    onClick={handleViewDetails} /* 3. VINCULACIÓN AQUÍ */
                >
                    Ver detalles
                </IonButton>

                <div className="rideCardPrice">
                    <p className="rideCardPriceLabel">Precio estimado</p>
                    <div>
                        <span className="rideCardPriceValue">{trip.priceValue}</span>
                        <span className="rideCardPriceUnit">{trip.priceUnit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideCard;