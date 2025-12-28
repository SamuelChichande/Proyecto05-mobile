import { IonIcon } from "@ionic/react";
import {
  shieldCheckmarkOutline,
  calendarOutline,
  cashOutline,
  timeOutline,
} from "ionicons/icons";
import "./QuickActions.css";

const QuickActions = () => {
  return (
    <div className="quick-actions">
      <div className="action-item red">
        <div className="icon-wrapper">
          <IonIcon icon={shieldCheckmarkOutline} />
        </div>
        <span>Seguridad</span>
      </div>

      <div className="action-item blue">
        <div className="icon-wrapper">
          <IonIcon icon={calendarOutline} />
        </div>
        <span>Agenda</span>
      </div>

      <div className="action-item green">
        <div className="icon-wrapper">
          <IonIcon icon={cashOutline} />
        </div>
        <span>Pagos</span>
      </div>

      <div className="action-item purple">
        <div className="icon-wrapper">
          <IonIcon icon={timeOutline} />
        </div>
        <span>Historial</span>
      </div>
    </div>
  );
};

export default QuickActions;