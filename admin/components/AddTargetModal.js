import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { fetchTargetAdd } from '../fetchers/targets';
import { fetchAppAuth } from '../fetchers/userconfig';
import OAuthAppForm from './OAuthAppForm';
import OAuthSetupPrompt from './OAuthSetupPrompt';

function dismissSelf(setProtocol, setPathVal, setIsAdding) {
  setProtocol('file');
  setPathVal('');
  setIsAdding(false);
}

async function handleSaveClick(url, setErrorMessage, setProtocol, setPathVal, setIsAdding) {
  try {
    await fetchTargetAdd(url);
    dismissSelf(setProtocol, setPathVal, setIsAdding);
  } catch (err) {
    setErrorMessage('' + err);
  }
}

function nameForProtocol(protocol) {
  switch (protocol) {
  case 'file':
    return 'Local Directory';
  case 'gdrive':
    return 'Google Drive';
  case 'dropbox':
    return 'Dropbox';
  case 's3':
    return 'S3';
  }
  return 'Unknown';
}

function placeholderForProtocol(protocol) {
  switch (protocol) {
  case 'file':
    return '/path/to/your/media/directory';
  case 'gdrive':
    return '/Mediasummon';
  case 'dropbox':
    return '/Mediasummon';
  case 's3':
    return 'bucketname';
  }
  return 'Unknown';
}

function initialPathForProtocol(protocol) {
  switch (protocol) {
  case 'gdrive':
    return '/Mediasummon';
  case 'dropbox':
    return '/Mediasummon';
  }
  return '';
}

async function refreshAppAuth(setAppAuth, setErrorMessage) {
  try {
    setAppAuth(await fetchAppAuth());
  } catch (err) {
    setErrorMessage(err);
  }
}

export default function AddTargetModal({ enabled, setIsAdding }) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [selfVal, setSelfVal] = useState(null);
  const [protocol, setProtocol] = useState('file');
  const [pathVal, setPathVal] = useState(initialPathForProtocol(protocol));
  const [appAuth, setAppAuth] = useState(undefined);
  const [configuring, setConfiguring] = useState(false);
  const closeListener = useCallback(() => {
    dismissSelf(setProtocol, setPathVal, setIsAdding);
  }, []);
  useEffect(() => {
    const showing = selfVal && enabled;
    var modal = null;
    if (selfVal) {
      modal = require('uikit').modal(selfVal);
      selfVal.addEventListener('hidden', closeListener);
    }
    if (modal && showing) {
      modal.show();
    }
    return () => {
      if (modal && showing) {
        modal.hide();
      }
    };
  }, [selfVal, enabled]);
  useEffect(() => {
    refreshAppAuth(setAppAuth, setErrorMessage);
  }, [enabled])
  const closeCallback = useCallback(ev => {
    ev.preventDefault();
    dismissSelf(setProtocol, setPathVal, setIsAdding);
  }, []);
  const refCallback = useCallback(ref => {
    setSelfVal(ref);
  }, []);
  const protocolChangeCallback = useCallback(ev => {
    setProtocol(ev.target.value);
    setConfiguring(false);
    setPathVal(initialPathForProtocol(ev.target.value));
  }, []);
  const pathValueChangeCallback = useCallback(ev => {
    setPathVal(ev.target.value);
  }, []);
  const saveCallback = useCallback(ev => {
    ev.preventDefault();
    const extra = protocol === 'file' ? '/' : '';
    handleSaveClick(protocol +'://' + extra + pathVal, setErrorMessage, setProtocol, setPathVal, setIsAdding);
  }, [protocol, pathVal]);
  const handleConfigureClick = useCallback(ev => {
    ev.preventDefault();
    setConfiguring(true);
  }, []);
  const handleSetShowing = useCallback(showing => {
    setConfiguring(showing);
    if (!showing) {
      refreshAppAuth(setAppAuth, setErrorMessage);
    }
  }, []);
  const protocolAuth = appAuth ? appAuth[protocol] : null;
  const tooltipString = protocolAuth ? protocolAuth.app_create_url.split('/')[2] : null;
  const saveEnabled = protocol === 'file' || (protocolAuth && !protocolAuth.needs_credentials);
  const showConfigure = configuring || !protocolAuth || protocolAuth.needs_credentials || protocolAuth.needs_app;
  return (
    <div uk-modal="true" ref={refCallback}>
      <div className="uk-modal-dialog">
        <button
          className="uk-modal-close-default"
          type="button"
          uk-close="true" />
        <div className="uk-modal-header">
          <h2 className="uk-modal-title">Summon your media to an additional location</h2>
        </div>
        <div className="uk-modal-body">
          {errorMessage ? 
            <div className="uk-alert-danger" uk-alert="true">
              <p><span uk-icon="warning" /> {errorMessage}</p>
            </div> : null}
          {configuring && protocolAuth ?
            <div className="uk-margin">
              {protocol === 's3' ? null :
                (protocolAuth.needs_app ?
                  <p>
                    Visit {protocol} to <a href={protocolAuth.app_create_url} uk-tooltip={tooltipString} target="_blank">create an app</a>, then return here and enter the credentials below:
                  </p> :
                  <p>
                    You already have credentials set up for {protocol}. If you would like to set new app credentials, head over to their site to <a href={protocolAuth.app_create_url} uk-tooltip={tooltipString} target="_blank">create or update your app</a>, then return here and enter the credentials below:
                  </p>)}
              <OAuthAppForm secretName={protocol} setShowing={handleSetShowing} />
            </div> : null}
          {!configuring && protocolAuth && (protocolAuth.needs_app || protocolAuth.needs_credentials) ?
            <div className="uk-margin">
              <OAuthSetupPrompt kind="target" name={protocol} item={protocolAuth} onConfigureClick={handleConfigureClick} />
            </div> : null}
          <p>Choose the location where you would like to save your media:</p>
          <form className="uk-form uk-flex" onSubmit={saveCallback}>
            <input type="submit" onSubmit={saveCallback} style={{display: 'none'}} />
            <span className="uk-width-auto" uk-form-custom="target: true">
              <input className="uk-input uk-width-auto" type="text" placeholder={nameForProtocol(protocol)} />
              <select className="uk-select" onChange={protocolChangeCallback} value={protocol}>
                <option value="file">{nameForProtocol('file')}</option>
                <option value="s3">{nameForProtocol('s3')}</option>
                <option value="dropbox">{nameForProtocol('dropbox')}</option>
                <option value="gdrive">{nameForProtocol('gdrive')}</option>
              </select>
            </span>
            <input
              type="text"
              className="uk-input uk-width-expand" 
              placeholder={placeholderForProtocol(protocol)}
              onChange={pathValueChangeCallback}
              value={pathVal}
              disabled={!saveEnabled} />
            {showConfigure ? null : <a href="#" onClick={handleConfigureClick} className="uk-flex uk-flex-right uk-padding-small uk-padding-remove-vertical uk-padding-remove-right" uk-icon="icon: cog" />}
          </form>
        </div>
        <div className="uk-modal-footer uk-text-right">
          <button className="uk-button uk-button-default" type="button" onClick={closeCallback}>Cancel</button>
          <button className="uk-button uk-button-primary" type="button" onClick={saveCallback} disabled={!saveEnabled}>Save</button>
        </div>
      </div>
    </div>
  )
}