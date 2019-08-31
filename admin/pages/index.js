import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect, useCallback } from 'react';
import { ensureInstalled } from '../setup';
import { fetchServices } from '../fetchers/services';
import { fetchTargets, fetchTargetRemove } from '../fetchers/targets';
import ServiceSummary from '../components/ServiceSummary';
import TargetSummary from '../components/TargetSummary';
import AddTargetModal from '../components/AddTargetModal';
import Header from '../components/Header';

async function handleTargetRemoveClick(target, targets, setTargets, setErrorMessage) {
  const UIKit = require('uikit');
  try {
    await UIKit.modal.confirm('Are you sure you want to remove this sync target? (' + target.path + ')');
  } catch (err) {
    return;
  }
  try {
    const result = await fetchTargetRemove(target.url, setErrorMessage);
    console.log('remove result', result);
    setTargets(targets.filter(t => t.url !== target.url));
  } catch (err) {
    setErrorMessage('' + err);
  }
  return false;
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [targets, setTargets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  useEffect(() => {
    ensureInstalled();
    fetchServices(setServices, setErrorMessage);
    fetchTargets(setTargets, setErrorMessage);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      if (targets.length) {
        fetchServices(setServices, setErrorMessage);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targets]);
  const removeTargetClickCallback = useCallback(target => {
    handleTargetRemoveClick(target, targets, setTargets, setErrorMessage);
  }, [targets]);
  const addTargetClickCallback = useCallback(ev => {
    ev.preventDefault();
    setIsAdding(true);
  }, []);
  return (
    <div className="uk-container">
      <Header title="Mediasummon" />
      <AddTargetModal setIsAdding={setIsAdding} enabled={isAdding} />
      {errorMessage ? 
        <div className="uk-alert-danger" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p><span uk-icon="warning" /> {errorMessage}</p>
        </div> : null}
      <div className="uk-section uk-section-default uk-padding-remove-top">
        <h3>Summoning your media to these locations</h3>
        {targets.map(target => {
          return (
            <TargetSummary
              key={target.url}
              target={target}
              onRemoveClick={removeTargetClickCallback} />
          );
        })}
        <div className="uk-flex uk-flex-center">
          <a
            href="#"
            uk-icon="icon: plus-circle; ratio: 2" 
            onClick={addTargetClickCallback} />
        </div>
      </div>
      <div className="uk-section uk-section-default uk-padding-remove">
        <h3>Summoning media from these services</h3>
        {services.map(service => {
          return <ServiceSummary key={service.metadata.id} service={service} />;
        })}
      </div>
    </div>
  );
}