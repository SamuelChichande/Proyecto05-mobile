import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonChip,
  IonAlert,
  IonList
} from '@ionic/react';
import {
  closeOutline,
  locationOutline,
  calendarOutline,
  timeOutline,
  peopleOutline,
  removeOutline,
  addOutline,
  pawOutline,
  bagOutline,
  banOutline,
  arrowForwardOutline,
  helpOutline,
  trendingDownOutline,
  carSharp
} from 'ionicons/icons';
import './CreateTrip.css';
// @ts-ignore
import { saveTrip } from '../config/database';

const CreateTrip: React.FC = () => {
  // 1. Estados (useState)
  const [seats, setSeats] = useState(3); // Plazas disponibles
  const [price, setPrice] = useState(''); // Precio por pasajero
  const [date, setDate] = useState('2023-10-25'); // Fecha del viaje
  const [car, setCar] = useState(''); // Tipo de vehículo
  const [time, setTime] = useState('08:30'); // Hora del viaje
  const [origin, setOrigin] = useState(''); // Lugar de origen
  const [destination, setDestination] = useState(''); // Lugar de destino
  const [showAlert, setShowAlert] = useState(false); // Alerta de viaje publicado
  const [originPredictions, setOriginPredictions] = useState<any[]>([]); // Sugerencias de origen
  const [destinationPredictions, setDestinationPredictions] = useState<any[]>([]); // Sugerencias de destino
  const [timeTravel, setTimeTravel] = useState<string>(''); // Duración del viaje
  const [distanceKm, setDistanceKm] = useState<string>(''); // Distancia en km
  const [googleReady, setGoogleReady] = useState(false); // Estado para verificar si Google Maps está cargado

  let formatTime = '';
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const autocompleteServiceRef = React.useRef<any>(null);
  const history = useHistory();
  const storedId = localStorage.getItem('idUser');
  const loadGoogleMapsScript = () => {
    if ((window as any).google) {
      setGoogleReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setGoogleReady(true);
    };

    document.body.appendChild(script);
  };


  // 2. Hooks (useEffect)
  React.useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  React.useEffect(() => {
    if (googleReady && !autocompleteServiceRef.current) {
      autocompleteServiceRef.current =
        new (window as any).google.maps.places.AutocompleteService();
    }
  }, [googleReady]);

  // 3. Funciones auxiliares (AQUÍ VA LA PARTE 4)
  const resetForm = () => {
    setOrigin('');
    setDestination('');
    setDate('2023-10-25');
    setTime('08:30');
    setSeats(3);
    setPrice('');
    setCar('');
    setTimeTravel('');
    setDistanceKm('');
  };

  const formatTimeForDisplay = (time24h: string) => {
    if (!time24h) return "";
    
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
};

  const getPredictions = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (!value || !autocompleteServiceRef.current) {
      setter([]);
      return;
    }

    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: 'es' }, // o 'ec'
        types: ['geocode']
      },
      (results: any[]) => {
        setter(results || []);
      }
    );
  };

  const calculateTimeTravel = (origin: string, destination: string) => {
    if (!(window as any).google) return;

    const service = new (window as any).google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: (window as any).google.maps.UnitSystem.METRIC,
      },
      (response: any, status: string) => {
        if (status !== 'OK') {
          console.error('Error Distance Matrix:', status);
          return;
        }

        const element = response.rows[0].elements[0];

        if (element.status === 'OK') {
          setTimeTravel(element.duration.text);   // ej: "1 h 15 min"
          setDistanceKm(element.distance.text);   // ej: "420 km"

          console.log('Duration:', element.duration.text);
          console.log('Distance:', element.distance.text);
        }
      }
    );
  };


  // 4. Handlers existentes (publish, seats, etc.)
  const handleDecreaseSeats = () => {
    if (seats > 1) setSeats(seats - 1);
  };

  const handleIncreaseSeats = () => {
    if (seats < 8) setSeats(seats + 1);
  };

  const handlePublish = async (idUser: String) => {
    if (!origin || !destination || !date || !time || !seats || !price || !car || !idUser || !timeTravel) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const result = await saveTrip(origin, destination, date, formatTime, timeTravel, seats, car, price, idUser);
      if (result.status != 'success') {
        throw new Error(result.message);
      }
    } catch (error) {
      alert('No se pudo publicar el viaje. Inténtalo de nuevo más tarde.');
      return;
    }
    resetForm();
    setShowAlert(true);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar className="create-trip-toolbar">
          <IonButton fill="clear" slot="start" className="close-button" onClick={() => history.goBack()}>
            <IonIcon slot="icon-only" icon={closeOutline} />
          </IonButton>

          <IonTitle className="create-trip-title">Publicar viaje</IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent className="create-trip-content">
        {/* Formulario */}
        <div className="form-container">
          {/* Grupo de ruta */}
          <div className="route-card">
            {/* Origen */}
            <div className="route-item">
              <div className="route-icon">
                <div className="origin-dot"></div>
              </div>
              <div className="route-input">
                <IonLabel className="route-label">ORIGEN</IonLabel>
                <IonInput
                  className="route-input-field"
                  placeholder="¿De dónde sales?"
                  value={origin}
                  onIonChange={(e) => {
                    const value = e.detail.value!;
                    setOrigin(value);
                    getPredictions(value, setOriginPredictions);
                  }}
                />
              </div>
            </div>

            {originPredictions.length > 0 && (
              <IonList className="autocomplete-list">
                {originPredictions.map((p) => (
                  <IonItem
                    key={p.place_id}
                    button
                    onClick={() => {
                      setOrigin(p.description);
                      setOriginPredictions([]);

                      if (destination) {
                        calculateTimeTravel(p.description, destination);
                      }

                    }}
                  >
                    {p.description}
                  </IonItem>
                ))}
              </IonList>
            )}


            {/* Línea conectora */}
            <div className="route-connector">
              <div className="connector-line"></div>
            </div>

            {/* Destino */}
            <div className="route-item">
              <div className="route-icon">
                <IonIcon icon={locationOutline} className="destination-icon" />
              </div>
              <div className="route-input">
                <IonLabel className="route-label">DESTINO</IonLabel>
                <IonInput
                  className="route-input-field"
                  placeholder="¿A dónde vas?"
                  value={destination}
                  onIonChange={(e) => {
                    const value = e.detail.value!;
                    setDestination(value);
                    getPredictions(value, setDestinationPredictions);
                  }}
                />
              </div>
            </div>

            {destinationPredictions.length > 0 && (
              <IonList className="autocomplete-list">
                {destinationPredictions.map((p) => (
                  <IonItem
                    key={p.place_id}
                    button
                    onClick={() => {
                      setDestination(p.description);
                      setDestinationPredictions([]);

                      if (origin) {
                        calculateTimeTravel(origin, p.description);
                      }

                    }}
                  >
                    {p.description}
                  </IonItem>
                ))}
              </IonList>
            )}
          </div>


          {/* Fecha y Hora */}
          <IonGrid className="datetime-grid">
            <IonRow>
              <IonCol>
                <div className="datetime-card">
                  <div className="datetime-header">
                    <IonIcon icon={calendarOutline} />
                    <span>FECHA</span>
                  </div>
                  <input
                    type="date"
                    className="datetime-input"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      formatTime = formatTimeForDisplay(e.target.value);
                    }}
                  />
                </div>
              </IonCol>

              <IonCol>
                <div className="datetime-card">
                  <div className="datetime-header">
                    <IonIcon icon={timeOutline} />
                    <span>HORA</span>
                  </div>
                  <input
                    type="time"
                    className="datetime-input"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Plazas disponibles */}
          <div className="seats-card">
            <div className="seats-header">
              <div className="seats-icon">
                <IonIcon icon={peopleOutline} />
              </div>
              <span className="seats-label">Plazas disponibles</span>
            </div>

            <div className="seats-control">
              <IonButton
                fill="clear"
                className="seats-button"
                onClick={handleDecreaseSeats}
                disabled={seats <= 1}
              >
                <IonIcon icon={removeOutline} />
              </IonButton>

              <span className="seats-count">{seats}</span>

              <IonButton
                fill="clear"
                className="seats-button"
                onClick={handleIncreaseSeats}
                disabled={seats >= 8}
              >
                <IonIcon icon={addOutline} />
              </IonButton>
            </div>
          </div>

          {/* Tipo de vehiculo */}
          <div className="typecar-card">
            <div className="datetime-header">
              <IonIcon icon={carSharp} />
              <span>TIPO DE VEHICULO</span>
            </div>
            <input
              type="text"
              placeholder='Toyota Corolla - ABC-1234'
              className="typecar-input"
              value={car}
              onChange={(e) => setCar(e.target.value)}
            />
          </div>


          {/* Precio */}
          <div className="price-card">
            <IonLabel className="price-label">Precio por pasajero</IonLabel>

            <div className="price-input-container">
              <IonIcon icon={trendingDownOutline} className="price-currency" />

              <IonInput
                type="number"
                className="price-input"
                placeholder="0.00"
                value={price}
                onIonChange={(e) => setPrice(e.detail.value!)}
              />

              <div className="price-recommended">
                <IonIcon icon={trendingDownOutline} className="recommended-icon" />
                <span>Recomendado</span>
              </div>
            </div>

            <p className="price-suggestion">Precio sugerido: 15.00€ - 20.00€</p>
          </div>

        </div>
        {/* Botón fijo */}
        <IonButton
          className="publish-button"
          expand="block"
          onClick={() => handlePublish(storedId!)}
        >
          <span>Publicar Viaje</span>
          <IonIcon icon={arrowForwardOutline} />
        </IonButton>


      </IonContent>



      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Viaje Publicado"
        message="Tu viaje ha sido publicado exitosamente."
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default CreateTrip;