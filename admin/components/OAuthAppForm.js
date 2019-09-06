import React from 'react';
import { useState, useCallback } from 'react';
import { fetchUpdateSecrets } from '../fetchers/userconfig';

async function handleSaveClick(secretName, params, setShowing) {
  await fetchUpdateSecrets(secretName, params);
  setShowing(false);
}

export default function OAuthAppForm({secretName, setShowing}) {
  const [clientID, setClientID] = useState(undefined);
  const [clientSecret, setClientSecret] = useState(undefined);
  const [region, setRegion] = useState(undefined);
  
  const handleCancelClicked = useCallback(ev => {
    ev.preventDefault();
    setShowing(false);
  }, []);
  const handleSaveClicked = useCallback(ev => {
    ev.preventDefault();
    const id = clientID ? clientID.value : null;
    const secret = clientSecret ? clientSecret.value : null;
    const reg = region ? region.value : null;
    var params = null;
    if (secretName === 's3') {
      params = {aws_access_key_id: id, aws_secret_access_key: secret, region: reg};
    } else {
      params = {client_id: id, client_secret: secret};
    }
    handleSaveClick(secretName, params, setShowing);
  }, [secretName, clientID, clientSecret]);
  const clientIDLoaded = useCallback(ref => {
    setClientID(ref);
  }, []);
  const clientSecretLoaded = useCallback(ref => {
    setClientSecret(ref);
  }, []);
  const regionLoaded = useCallback(ref => {
    setRegion(ref);
  }, []);
  return (
    <form className="uk-form-stacked" onSubmit={handleSaveClicked}>
      {secretName === 's3' ?
        <React.Fragment>
          <div className="uk-margin">
            <label className="uk-form-label">AWS Access Key ID</label>
            <div className="uk-form-controls">
              <input className="uk-input" type="text" placeholder="AWS Access Key ID" ref={clientIDLoaded} />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label">AWS Secret Access Key</label>
            <div className="uk-form-controls">
              <input className="uk-input" type="text" placeholder="AWS Secret Access Key" ref={clientSecretLoaded} />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label">Region</label>
            <div className="uk-form-controls">
              <input className="uk-input" type="text" placeholder="Region" ref={regionLoaded} />
            </div>
          </div>
        </React.Fragment> :
        <React.Fragment>
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
        </React.Fragment>}
      <div className="uk-flex uk-flex-right">
        <a href="#" className="uk-button" onClick={handleCancelClicked}>Cancel</a>
        <input type="submit" className="uk-button uk-button-primary" onSubmit={handleSaveClicked} value="Save" />
      </div>
    </form>
  );
}