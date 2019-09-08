import React from 'react';

export default function OAuthSetupPrompt({name, kind, item, onConfigureClick}) {
  const action = kind === 'service' ? 'download' : 'upload';
  return (
    <React.Fragment>
      {item.needs_app?
        <div className="uk-alert-warning" uk-alert="true">
          <p>Before you can {action} your photos, first you have to set up access. Please
          visit {name} and <a href={item.app_create_url} target="_blank">create an app</a>,
          then return here and enter the credentials in settings. Be sure to set the return url to:{' '}
          <code>{document.location.protocol + '//' + document.location.host + '/auth/'+name+'/return'}</code></p>
          <div className="uk-panel">
            <p className="uk-align-right">
              <a href={item.credential_redirect_url} className="uk-button uk-button-primary" onClick={onConfigureClick}>Configure {name}</a>
            </p>
          </div>
        </div> : null}
      {!item.needs_app && item.needs_credentials ?
        <div className="uk-alert-primary" uk-alert="true">
          <p>It looks like your permission is required before we can sync this {kind} for you.
          Clicking this button will send you to {name}&rsquo;s website, where you can grant
          permission, and you&rsquo;ll be returned here afterwards.</p>
          <div className="uk-panel">
            <p className="uk-align-right">
              <a href={item.credential_redirect_url} className="uk-button uk-button-primary">Grant Permission</a>
            </p>
          </div>
        </div> : null}
    </React.Fragment>
  )
}