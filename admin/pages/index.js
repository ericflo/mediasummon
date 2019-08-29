import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import httpFetch from '../fetch';
import config from '../config';
import { ensureUIKitInstalled } from '../setup';
import ServiceSummary from '../components/ServiceSummary';

export default function Home() {
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    ensureUIKitInstalled();
    async function fetchData() {
      try {
        const result = await httpFetch(config.apiPrefix + '/resources/services.json');
        if (result.ok) {
          setServices(await result.json());
        } else {
          setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);
        }
      } catch (err) {
        setErrorMessage('Could not complete fetch: ' + err);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="uk-container">
      <Head>
        <title>Your Mediasummon Dashboard</title>
      </Head>
      <h2>Your Mediasummon Dashboard</h2>
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