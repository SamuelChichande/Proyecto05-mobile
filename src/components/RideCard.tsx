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
    car,
    starOutline,
    starHalf
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

const RideCard = ({ trip }: { trip: Trip }) => {
    const router = useIonRouter();

    const title = trip.title; //"HOY, 14:30PM"
    const timeTravel = trip.timeTravel; //"30min"
    const startPoint = trip.startPoint; //"Campus ESPOL"
    const endPoint = trip.endPoint; //"Centro Comercial El Dorado"
    const driverName = trip.driverName; //"Juan Perez"
    const vehicle = trip.vehicle; //"Toyota Corolla - ABC-1234"
    const rating = trip.rating; //"4.8"
    const tripCount = trip.tripCount; //"120 viajes"
    const priceValue = "$" + trip.priceValue; //"5.00"
    const priceUnit = "." + trip.priceUnit; //"00"

    const handleViewDetails = () => {
        router.push('/maindashboard/trip-details', 'forward', 'push');
    };

    return (
        <div className="rideCardNoImage">
            {/* Header */}
            <div className="rideCardHeader">
                <div>
                    <h3 className="rideCardTitle">{title}</h3>
                </div>
                <div className="rideCardTimeBadge">{timeTravel}</div>
            </div>

            {/* Ruta */}
            <div className="rideCardRouteSection">
                <div className="rideCardRoutePoints">
                    <div className="rideCardPoint">
                        <div className="rideCardPointDotStart"></div>
                        <span className="rideCardPointName">{startPoint}</span>
                    </div>

                    <IonIcon icon={navigate} className="rideCardRouteIcon" />

                    <div className="rideCardPoint">
                        <div className="rideCardPointDotEnd"></div>
                        <span className="rideCardPointName">{endPoint}</span>
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
                        <h4 className="rideCardDriverName">{driverName}</h4>
                        <div className="rideCardVehicleInfo">
                            <IonIcon icon={car} className="rideCardVehicleIcon" />
                            <span className="rideCardVehicleText">{vehicle}</span>
                        </div>
                    </div>

                    <div className="rideCardDriverRating">
                        <div className="rideCardRatingStars">
                            {[1, 2, 3, 4, 5].map((index) => {
                                let iconName = starOutline;

                                if (index <= Math.floor(parseFloat(trip.rating))) {
                                    // Estrella completa
                                    iconName = star;
                                } else if (index - 0.5 <= parseFloat(trip.rating)) {
                                    // Media estrella
                                    iconName = starHalf;
                                }
                                // Si no, queda starOutline (vacía)

                                return (
                                    <IonIcon
                                        key={index}
                                        icon={iconName}
                                        className={`rideCardStarIcon ${iconName !== starOutline ? 'filled' : ''}`}
                                    />
                                );
                            })}
                        </div>
                        <span className="rideCardTripCount">{tripCount}</span>
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
                        <span className="rideCardPriceValue">{priceValue}</span>
                        <span className="rideCardPriceUnit">{priceUnit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RideCard;