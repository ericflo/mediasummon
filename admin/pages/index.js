import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect, useCallback } from 'react';
import { ensureInstalled } from '../setup';
import { loadAuthToken } from '../fetchers/common';
import { fetchServices } from '../fetchers/services';
import { fetchTargets, fetchTargetRemove } from '../fetchers/targets';
import { fetchCurrentUserConfig } from '../fetchers/userconfig';
import ServiceSummary from '../components/ServiceSummary';
import TargetSummary from '../components/TargetSummary';
import AddTargetModal from '../components/AddTargetModal';
import Header from '../components/Header';
import Router from 'next/router';

async function handleTargetRemoveClick(target, targets, setTargets, setErrorMessage) {
  const UIKit = require('uikit');
  try {
    await UIKit.modal.confirm('Are you sure you want to remove this sync target? (' + target.path + ')');
  } catch (err) {
    return;
  }
  try {
    const result = await fetchTargetRemove(target.url);
    setTargets(targets.filter(t => t.url !== target.url));
  } catch (err) {
    setErrorMessage('' + err);
  }
  return false;
}

async function fullSetup(token, setServices, setTargets, setErrorMessage) {
  try {
    ensureInstalled(token);
    setServices(await fetchServices());
    setTargets(await fetchTargets());
  } catch (err) {
    setErrorMessage('' + err);
  }
}

async function updateServices(setServices, setErrorMessage) {
  try {
    setServices(await fetchServices());
  } catch (err) {
    setErrorMessage('' + err);
  }
}

function useRequiredUserConfig() {
  const [state, setState] = useState({userConfig: undefined, token: undefined});
  useEffect(() => {
    async function fetchConfig() {
      try {
        const token = await loadAuthToken();
        const userConfig = await fetchCurrentUserConfig();
        setState({userConfig, token});
      } catch (err) {
        Router.push('/login');
      }
    }
    fetchConfig();
  }, []);
  return state;
}

export default function Home() {
  const [services, setServices] = useState([]);
  const [targets, setTargets] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const {userConfig, token} = useRequiredUserConfig();

  useEffect(() => {
    if (userConfig === undefined) {
      return;
    }
    fullSetup(token, setServices, setTargets, setErrorMessage);
  }, [userConfig, token, isAdding]);
  useEffect(() => {
    if (userConfig === undefined) {
      return;
    }
    const timer = setInterval(() => {
      updateServices(setServices, setErrorMessage);
    }, 1000);
    return () => clearInterval(timer);
  }, [userConfig]);
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