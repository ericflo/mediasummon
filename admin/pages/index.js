import '../node_modules/uikit/dist/css/uikit.min.css';
import '../static/css/global.css';
import { useState, useEffect, useCallback } from 'react';
import { ensureInstalled, useRequiredUserConfig } from '../setup';
import { fetchServices } from '../fetchers/services';
import { fetchTargets, fetchTargetRemove } from '../fetchers/targets';
import ServiceSummary from '../components/ServiceSummary';
import TargetSummary from '../components/TargetSummary';
import AddTargetModal from '../components/AddTargetModal';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

async function firstSetup(token, setTargets, setErrorMessage) {
  try {
    ensureInstalled(token);
    setTargets(await fetchTargets());
  } catch (err) {
    setErrorMessage('' + err);
  }
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
    firstSetup(token, setTargets, setErrorMessage);
  }, [userConfig, token, isAdding]);

  useEffect(() => {
    if (userConfig === undefined) {
      return;
    }
    var timer = null;
    async function updateServices() {
      try {
        setServices(await fetchServices());
        timer = setTimeout(updateServices, 1000);
      } catch (err) {
        setErrorMessage('' + err);
      }
    }
    timer = setTimeout(updateServices, 1000);
    return () => clearTimeout(timer);
  }, [userConfig]);

  const removeTargetClickCallback = useCallback(target => {
    handleTargetRemoveClick(target, targets, setTargets, setErrorMessage);
  }, [targets]);
  const addTargetClickCallback = useCallback(ev => {
    ev.preventDefault();
    setIsAdding(true);
  }, []);

  if (userConfig === undefined) {
    return <div uk-spinner="ratio: 3" className="uk-flex uk-flex-center uk-margin-xxlarge" />;
  }

  return (
    <div className="toplevel">
      <div className="content">
        <Navbar userConfig={userConfig} />
        <div className="content-inner uk-container">
          <Header title="Mediasummon" />
          <AddTargetModal setIsAdding={setIsAdding} enabled={isAdding} />
          {errorMessage ? 
            <div className="uk-alert-danger" uk-alert="true">
              <a className="uk-alert-close" uk-close="true"></a>
              <p><span uk-icon="warning" /> {errorMessage}</p>
            </div> : null}
          <div className="">
            <h3>Summoning your media to these locations</h3>
            {targets.length === 0 ? <div uk-spinner="ratio: 3" className="uk-flex uk-flex-center uk-margin-xxlarge" /> : null}
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
          <div className="uk-margin">
            <h3>Summoning media from these services</h3>
            {services.length === 0 ? <div uk-spinner="ratio: 3" className="uk-flex uk-flex-center uk-margin-xxlarge" /> : null}
            {services.map(service => {
              return <ServiceSummary key={service.metadata.id} service={service} />;
            })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}