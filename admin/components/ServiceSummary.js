import React from 'react';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { fetchServiceSyncStart } from '../fetchers/services';
import { fetchUpdateSecrets } from '../fetchers/userconfig';

async function handleSyncClick(service) {
  await fetchServiceSyncStart(service.metadata.id);
}

async function handleSaveClick(name, clientID, clientSecret, setConfiguring) {
  await fetchUpdateSecrets(name, clientID, clientSecret);
  setConfiguring(false);
}

export default function ServiceSummary({service}) {
  const [configuring, setConfiguring] = useState(false);
  const [clientID, setClientID] = useState(undefined);
  const [clientSecret, setClientSecret] = useState(undefined);
  const sync = service.last_sync;
  const start = sync ? dayjs(sync.start).fromNow() : 'Never';
  const next = (sync && sync.end) ? dayjs(sync.end).add(service.hours_per_sync, 'hour') : dayjs();
  const nextString = next ? ('' + next) : '';
  const startString = sync ? sync.startString : null;
  const syncCallback = useCallback(ev => {
    ev.stopPropagation();
    handleSyncClick(service);
  }, [service]);
  const handleConfigureClicked = useCallback(ev => {
    ev.preventDefault();
    setConfiguring(true);
  }, []);
  const handleCancelClicked = useCallback(ev => {
    ev.preventDefault();
    setConfiguring(false);
  }, []);
  const handleSaveClicked = useCallback(ev => {
    ev.preventDefault();
    const id = clientID ? clientID.value : null;
    const secret = clientSecret ? clientSecret.value : null;
    handleSaveClick(service.metadata.id, id, secret, setConfiguring);
  }, [clientID, clientSecret]);
  const clientIDLoaded = useCallback(ref => {
    setClientID(ref);
  }, []);
  const clientSecretLoaded = useCallback(ref => {
    setClientSecret(ref);
  }, []);
  return (
    <div className="uk-card uk-card-default uk-card-hover uk-margin">
      <div className="uk-card-header">
        <div className="uk-grid-small uk-flex-middle" uk-grid="true">
          <div className="uk-width-auto">
            <img className="uk-border" width="40" height="40" src={'/static/images/logo-' + service.metadata.id + '.png'} />
          </div>
          <div className="uk-width-expand">
            <h3 className="uk-card-title uk-margin-remove-bottom">{service.metadata.name}</h3>
            <p className="uk-text-meta uk-margin-remove-top">
              Last synced: <time dateTime={startString}>{start}</time>{' '}
              {sync ? '(' + (sync.fetch_count || 0) + ' downloaded) ' :  null}
              — Next sync: <time dateTime={nextString}>{next.fromNow()}</time>
            </p>
          </div>
          {configuring || (!service.needs_credentials && !service.needs_app) ? null : <a href="#" onClick={handleConfigureClicked} uk-icon="icon: cog" />}
        </div>
      </div>
      {configuring ?
        <div className="uk-card-body uk-padding-remove-vertical uk-margin">
          <p>
            Visit {service.metadata.name} to <a href={service.app_create_url} target="_blank">create an app</a>, then return here and enter the credentials below:
          </p>
          <form className="uk-form-stacked" onSubmit={handleSaveClicked}>
            <div className="uk-margin">
              <label className="uk-form-label">Client ID</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" placeholder="Client ID" ref={clientIDLoaded} />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label">Client Secret</label>
              <div className="uk-form-controls">
                <input className="uk-input" type="text" placeholder="Client Secret" ref={clientSecretLoaded} />
              </div>
            </div>
            <div className="uk-align-right">
              <a href="#" className="uk-button" onClick={handleCancelClicked}>Cancel</a>
              <input type="submit" className="uk-button uk-button-primary" onSubmit={handleSaveClicked} value="Save" />
            </div>
          </form>
        </div> : null}
      {!configuring && service.needs_app ?
        <div className="uk-card-body uk-padding-remove-vertical uk-margin">
          <div className="uk-alert-warning" uk-alert="true">
            <p>Before you can download your photos, first you have to set up access. Please visit {service.metadata.name} and <a href={service.app_create_url} target="_blank">create an app</a>, then return here and enter the credentials in settings.</p>
            <div className="uk-panel">
              <p className="uk-align-right">
                <a href={service.credential_redirect_url} className="uk-button uk-button-primary" onClick={handleConfigureClicked}>Configure {service.metadata.name}</a>
              </p>
            </div>
          </div>
        </div> : null}
      {!configuring && !service.needs_app && service.needs_credentials ?
        <div className="uk-card-body uk-padding-remove-vertical uk-margin">
          <div className="uk-alert-primary" uk-alert="true">
            <p>It looks like your permission is required before we can sync this service for you. Clicking this button will send you to {service.metadata.name}&rsquo;s website, where you can grant permission to download these items for you, and you&rsquo;ll be returned here afterwards.</p>
            <div className="uk-panel">
              <p className="uk-align-right">
                <a href={service.credential_redirect_url} className="uk-button uk-button-primary">Grant Permission</a>
              </p>
            </div>
          </div>
        </div> : null}
      <div className="uk-card-footer">
        <a href="#" className="uk-button uk-button-text">View details</a>
        <p className="uk-align-right">
          {service.needs_credentials ? null :
            <button className="uk-button uk-button-primary" disabled={service.current_sync} onClick={syncCallback}>
              {service.current_sync ? 'Syncing...' : 'Sync now'}
            </button>}
        </p>
      </div>
    </div>
  )
}