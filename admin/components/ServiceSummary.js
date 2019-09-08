import React from 'react';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { fetchServiceSyncStart } from '../fetchers/services';
import OAuthAppForm from './OAuthAppForm';
import OAuthSetupPrompt from './OAuthSetupPrompt';

async function handleSyncClick(service) {
  await fetchServiceSyncStart(service.metadata.id);
}

export default function ServiceSummary({service}) {
  const [configuring, setConfiguring] = useState(false);
  const sync = service.last_sync;
  const start = sync ? dayjs(sync.start).fromNow() : 'Never';
  const next = (sync && sync.end) ? dayjs(sync.end).add(service.hours_per_sync, 'hour') : dayjs();
  const nextString = next ? ('' + next) : '';
  const startString = sync ? sync.startString : null;
  const syncCallback = useCallback(ev => {
    ev.stopPropagation();
    handleSyncClick(service);
  }, [service]);
  const handleConfigureClick = useCallback(ev => {
    ev.preventDefault();
    setConfiguring(true);
  }, []);
  const tooltipString = service.app_create_url.split('/')[2];
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
          {configuring || (!service.needs_credentials && !service.needs_app) ? null : <a href="#" onClick={handleConfigureClick} uk-icon="icon: cog" />}
        </div>
      </div>
      {configuring ?
        <div className="uk-card-body uk-padding-remove-vertical uk-margin">
          {service.needs_app ?
            <p>
              Visit {service.metadata.name} to
              <a href={service.app_create_url} uk-tooltip={tooltipString} target="_blank">create an app</a>,{' '}
              then return here and enter the credentials below. Be sure to set the return url to{' '}
              <code>{document.location.protocol + '//' + document.location.host + '/auth/'+service.metadata.id+'/return'}</code>
            </p> :
            <p>
              You already have credentials set up for {service.metadata.name}. If you would like to set new{' '}
              app credentials, head over to their site to{' '}
              <a href={service.app_create_url} uk-tooltip={tooltipString} target="_blank">create or update your app</a>,{' '}
              then return here and enter the credentials below. Be sure to set the return url to{' '}
              <code>{document.location.protocol + '//' + document.location.host + '/auth/'+service.metadata.id+'/return'}</code>
            </p>}
          <OAuthAppForm secretName={service.metadata.id} setShowing={setConfiguring} />
        </div> : null}
      {!configuring && (service.needs_app || service.needs_credentials) ?
        <div className="uk-card-body uk-padding-remove-vertical uk-margin">
          <OAuthSetupPrompt kind="service" name={service.metadata.name} item={service} onConfigureClick={handleConfigureClick} />
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