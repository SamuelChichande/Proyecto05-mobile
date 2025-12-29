import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';

import { Route, Redirect } from 'react-router';

import { homeSharp, carSharp, personSharp } from 'ionicons/icons';

import HomePage from './HomePage';
import UserProfile from './UserProfile';

function MainDashboard() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Redirect exact path="/maindashboard" to="/maindashboard/home" />

        <Route path="/maindashboard/home" render={() => <HomePage />} exact={true} />
        <Route path="/maindashboard/trips" render={() => <HomePage />} exact={true} />
        <Route path="/maindashboard/profile" render={() => <HomePage />} exact={true} />
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