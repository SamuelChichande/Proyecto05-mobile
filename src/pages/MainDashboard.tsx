import React from 'react';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { Route, Redirect } from 'react-router';

import { homeSharp, carSharp, personSharp } from 'ionicons/icons';

import HomePage from './HomePage';

function MainDashboard() {
  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/" to="/home" />

          <Route path="/home" render={() => <HomePage />} exact={true} />
          <Route path="/trips" render={() => <HomePage />} exact={true} />
          <Route path="/profile" render={() => <HomePage />} exact={true} />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeSharp} />
            <IonLabel>Inicio</IonLabel>
          </IonTabButton>

          <IonTabButton tab="trips" href="/radio">
            <IonIcon icon={carSharp} />
            <IonLabel>Mis viajes</IonLabel>
          </IonTabButton>

          <IonTabButton tab="profile" href="/library">
            <IonIcon icon={personSharp} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}
export default MainDashboard;