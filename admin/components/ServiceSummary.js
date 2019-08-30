import React from 'react';
import dayjs from 'dayjs';
import { fetchServiceSyncStart } from '../fetchers/services';

async function handleSyncClick(service, ev) {
  ev.stopPropagation()
  ev.preventDefault();
  const result = await fetchServiceSyncStart(service.metadata.id);
  console.log('result', result);
  return false;
}

export default function ServiceSummary({service}) {
  const sync = service.last_sync;
  const start = sync ? dayjs(sync.start).fromNow() : 'Never';
  const startString = sync ? sync.startString : null;
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
              Last synced: <time dateTime={startString}>{start}</time>
              {sync ? ' (' + (sync.fetch_count || 0) + ' downloaded)' : null}
            </p>
          </div>
        </div>
      </div>
      {service.needs_credentials ?
        <div className="uk-card-body uk-padding-remove-vertical uk-margin">
          <div className="uk-alert-warning" uk-alert="true">
            <p>It looks like your permission is required before we can sync this service for you. Clicking this button will send you to {service.metadata.name}&rsquo;s website, where you can grant permission to download these items for you, and you&rsquo;ll be returned here afterwards.</p>
            <p>
              <a href={service.credential_redirect_url} className="uk-button uk-button-primary">Grant Permission</a>
            </p>
          </div>
        </div> : null}
      <div className="uk-card-footer">
        <a href="#" className="uk-button uk-button-text">View details</a>
        <p className="uk-align-right">
          {service.current_sync || service.needs_credentials ? null :
            <a className="uk-button uk-button-primary" href="#" onClick={handleSyncClick.bind(this, service)}>Sync now</a>}
        </p>
      </div>
    </div>
  )
}