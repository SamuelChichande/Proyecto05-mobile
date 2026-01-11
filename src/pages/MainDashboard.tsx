import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';

import { Route, Redirect } from 'react-router';

import { homeSharp, carSharp, personSharp } from 'ionicons/icons';

import HomePage from './HomePage';
import UserProfile from './UserProfile';
import MyTravels from './MyTravels';
import TripDetails from '../components/TripDetails';
import CreateTrip from './CreateTrip';
import TripHistoryDetails from '../components/TripHistoryDetails';
import ManageTrip from '../components/ManageTrip';

function MainDashboard() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/maindashboard" to="/maindashboard/home" />

        <Route exact path="/maindashboard/home" component={HomePage} />
        <Route exact path="/maindashboard/trips" component={MyTravels} />
        <Route exact path="/maindashboard/profile" component={UserProfile} />

        <Route exact path="/maindashboard/trip-details" component={TripDetails} />
        <Route exact path="/maindashboard/create-trip" component={CreateTrip} />
        <Route exact path="/maindashboard/trip-history-details" component={TripHistoryDetails} />
        <Route exact path="/maindashboard/manage-trip" component={ManageTrip} />
        <Route exact path="/maindashboard">
          <Redirect to="/maindashboard/home" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/maindashboard/home">
          <IonIcon icon={homeSharp} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>

        <IonTabButton tab="trips" href="/maindashboard/trips">
          <IonIcon icon={carSharp} />
          <IonLabel>Mis viajes</IonLabel>
        </IonTabButton>

        <IonTabButton tab="profile" href="/maindashboard/profile">
          <IonIcon icon={personSharp} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}
export default MainDashboard;