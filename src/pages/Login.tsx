import React, { useState } from 'react';
import {
    IonContent, IonIcon, IonText, IonItem, IonInput, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonLabel, IonSegment, IonSegmentButton, IonButton, IonList
} from '@ionic/react';
import { schoolSharp, mailSharp, lockClosed, eye, eyeOff, arrowForwardOutline, person, checkmarkCircleSharp } from 'ionicons/icons';

import './Login.css';

const Login: React.FC = () => {
    const [selectedSegment, setSelectedSegment] = useState<string>('default');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSegmentChange = (event: CustomEvent) => {
        setSelectedSegment(event.detail.value);
        setPassword('');  // Reset password when switching between login and register
        setConfirmPassword('');  // Reset confirm password
        setShowPassword(false);  // Reset showPassword to hidden
        setShowConfirmPassword(false);  // Reset showConfirmPassword to hidden
    };

    const loginForm = (
        <div className="login-container">
            <span className="label">CORREO INSTITUCIONAL</span>
            <IonItem className="input-item" lines="none">
                <IonIcon icon={mailSharp} slot="start" />
                <IonInput
                    type="email"
                    placeholder="email@espol.edu.ec"
                />
            </IonItem>

            <span className="label">CONTRASEÑA</span>
            <IonItem className="input-item" lines="none">
                <IonIcon icon={lockClosed} slot="start" />
                <IonInput
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                />
                <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                    <IonIcon icon={showPassword ? eyeOff : eye} />
                </IonButton>
            </IonItem>

            <span className="forgot-password">¿Olvidaste tu contraseña?</span>

            <IonButton className="continue-button" expand="block">
                Continuar
                <IonIcon slot="end" icon={arrowForwardOutline} />
            </IonButton>
        </div>
    );

    const registerForm = (
        <div className="register-container">
            <span className="label">NOMBRE COMPLETO <sub>(opcional)</sub></span>
            <IonItem className="input-item" lines="none">
                <IonIcon icon={person} slot="start" />
                <IonInput
                    type="text"
                    placeholder="Ej. Juan Perez"
                />
            </IonItem>
            <span className="label">CORREO INSTITUCIONAL</span>
            <IonItem className="input-item" lines="none">
                <IonIcon icon={mailSharp} slot="start" />
                <IonInput
                    type="email"
                    placeholder="email@espol.edu.ec"
                />
            </IonItem>
            <span className="label">CONTRASEÑA</span>
            <IonItem className="input-item" lines="none">
                <IonIcon icon={lockClosed} slot="start" />
                <IonInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 8 caracteres"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value!)}
                />
                <IonButton fill="clear" slot="end" onClick={() => setShowPassword(!showPassword)}>
                    <IonIcon icon={showPassword ? eyeOff : eye} />
                </IonButton>
            </IonItem>
            <span className="label">CONFIRMAR CONTRASEÑA</span>
            <IonItem className="input-item" lines="none">
                <IonIcon icon={checkmarkCircleSharp} slot="start" />
                <IonInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                />
                <IonButton fill="clear" slot="end" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <IonIcon icon={showConfirmPassword ? eyeOff : eye} />
                </IonButton>
            </IonItem>

            <IonButton className="continue-button" expand="block">
                Registrarse
                <IonIcon slot="end" icon={arrowForwardOutline} />
            </IonButton>
        </div>
    );

    return (
        <IonContent className="ion-padding">
            <div className="centered-content">
                <IonIcon icon={schoolSharp} className="icon-bordered"></IonIcon>
                <IonText>
                    <h2><strong>CarpoolConnect</strong></h2>
                    <sub>Conecta con tu comunidad Politecnica</sub>
                </IonText>
                <IonCard className="custom-card">
                    <IonCardHeader className="ion-text-center">
                        <IonSegment value={selectedSegment} class="custom-segment" swipeGesture={true} onIonChange={handleSegmentChange}>
                            <IonSegmentButton value="default" class="segment-btn">
                                <IonLabel>Ingresar</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="segment2" class="segment-btn">
                                <IonLabel>Registro</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonCardHeader>

                    <IonCardContent>
                        {selectedSegment === 'default' ? registerForm : loginForm}
                    </IonCardContent>

                </IonCard>
            </div>
        </IonContent>
    );
};

export default Login;