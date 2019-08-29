import React from 'react';

export default function ServiceSummary({service}) {
  return (
    <div className="uk-card uk-card-default uk-margin">
      <div className="uk-card-header">
        <div className="uk-grid-small uk-flex-middle" uk-grid="true">
          <div className="uk-width-auto">
            <img className="uk-border" width="40" height="40" src={'/static/images/logo-' + service.id + '.png'} />
          </div>
          <div className="uk-width-expand">
            <h3 className="uk-card-title uk-margin-remove-bottom">{service.name}</h3>
            <p className="uk-text-meta uk-margin-remove-top">
              Last synced: <time dateTime="2016-04-01T19:00">April 01, 2016</time>
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