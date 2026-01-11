import React from 'react';
import {
    IonButton,
    IonAvatar,
    IonIcon,
    useIonRouter
} from '@ionic/react';
import {
    navigate,
    star,
    car,
    starOutline,
    starHalf,
    person // Agregar icono de persona
} from 'ionicons/icons';
import './RideCard.css';

interface Trip {
    id?: string; // Opcional para compatibilidad
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
    // Nuevas propiedades opcionales
    tripType?: 'passenger' | 'driver';
    passengersCount?: number;
    availableSeats?: number;
    isDriver?: boolean;
}

interface RideCardProps {
    trip: Trip;
    tripType?: 'passenger' | 'driver'; // Prop opcional
}

const RideCard = ({ trip, tripType = 'passenger' }: RideCardProps) => {
    const router = useIonRouter();

    // Determinar si es conductor (puede venir de tripType o de isDriver)
    const isDriverTrip = tripType === 'driver' || trip.isDriver;
    
    const title = trip.title;
    const timeTravel = trip.timeTravel;
    const startPoint = trip.startPoint;
    const endPoint = trip.endPoint;
    const driverName = isDriverTrip ? "Tú" : trip.driverName; // Cambiar nombre si es conductor
    const vehicle = trip.vehicle;
    const rating = trip.rating;
    const tripCount = trip.tripCount;
    const priceValue = "$" + trip.priceValue;
    const priceUnit = "." + trip.priceUnit;

    const handleViewDetails = () => {
        // Pasar parámetros según el tipo de viaje
        const state = {
            tripId: trip.id,
            tripType: tripType,
            isDriver: isDriverTrip
        };
        //router.push('/maindashboard/trip-details', 'forward', 'push', state);
        //router.push('/maindashboard/trip-details', 'forward', 'push');
        router.push('/maindashboard/manage-trip', 'forward', 'push');
    };

    return (
        <div className={`rideCardNoImage ${isDriverTrip ? 'driver-trip' : 'passenger-trip'}`}>
            {/* Badge de tipo de viaje */}
            {isDriverTrip && (
                <div className="trip-type-badge driver-badge">
                    <IonIcon icon={car} /> Como conductor
                </div>
            )}
            
            {/* Header */}
            <div className="rideCardHeader">
                <div>
                    <h3 className="rideCardTitle">{title}</h3>
                    {isDriverTrip && trip.passengersCount !== undefined && (
                        <div className="trip-stats">
                            <span className="passenger-count">
                                <IonIcon icon={person} /> {trip.passengersCount} pasajeros
                            </span>
                            {trip.availableSeats !== undefined && (
                                <span className="available-seats">
                                    • {trip.availableSeats} asientos disponibles
                                </span>
                            )}
                        </div>
                    )}
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
                                    iconName = star;
                                } else if (index - 0.5 <= parseFloat(trip.rating)) {
                                    iconName = starHalf;
                                }

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
                    onClick={handleViewDetails}
                >
                    {isDriverTrip ? "Gestionar viaje" : "Ver detalles"}
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