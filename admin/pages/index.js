import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect } from 'react';
import { ensureInstalled } from '../setup';
import { fetchServices } from '../fetchers/services';
import { fetchTargets } from '../fetchers/targets';
import ServiceSummary from '../components/ServiceSummary';
import TargetSummary from '../components/TargetSummary';
import Header from '../components/Header';

export default function Home() {
  const [services, setServices] = useState([]);
  const [targets, setTargets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    ensureInstalled();
    fetchServices(setServices, setErrorMessage);
    fetchTargets(setTargets, setErrorMessage);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      fetchServices(setServices, setErrorMessage);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="uk-container">
      <Header title="Your Mediasummon Dashboard" />
      {errorMessage ? 
        <div className="uk-alert-danger" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p><span uk-icon="warning" /> {errorMessage}</p>
        </div> : null}
      <div className="uk-section uk-section-default uk-padding-remove-top">
        <h3>Target locations to sync media to</h3>
        {targets.map(target => {
          return <TargetSummary key={target.url} target={target} />;
        })}
      </div>
      <div className="uk-section uk-section-default uk-padding-remove">
        <h3>Services to sync</h3>
        {services.map(service => {
          return <ServiceSummary key={service.metadata.id} service={service} />;
        })}
      </div>
    </div>
  );
}