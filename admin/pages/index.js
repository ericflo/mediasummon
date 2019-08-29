import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect } from 'react';
import { ensureUIKitInstalled } from '../setup';
import {fetchServices} from '../fetchers/services';
import ServiceSummary from '../components/ServiceSummary';
import Header from '../components/Header';

export default function Home() {
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    ensureUIKitInstalled();
    fetchServices(setServices, setErrorMessage);
  }, []);
  return (
    <div className="uk-container">
      <Header title="Your Mediasummon Dashboard" />
      {errorMessage ? 
        <div className="uk-alert-danger" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p><span uk-icon="warning" /> {errorMessage}</p>
        </div> : null}
      <div className="uk-section uk-section-default uk-padding-remove">
        <h3>Services to sync</h3>
        {services.map(service => {
          return <ServiceSummary key={service.id} service={service} />;
        })}
      </div>
    </div>
  );
}