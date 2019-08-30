import React from 'react';
import dayjs from 'dayjs';

export default function ServiceSummary({service}) {
  const lastSyncStart = service.last_sync ? dayjs(service.last_sync.start).fromNow() : 'Never';
  const lastSyncStartString = service.last_sync ? service.last_sync.startString : null;
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
              Last synced: <time dateTime={lastSyncStartString}>{lastSyncStart}</time>
            </p>
          </div>
        </div>
      </div>
      <div className="uk-card-footer">
        <a href="#" className="uk-button uk-button-text">View details</a>
      </div>
    </div>
  )
}