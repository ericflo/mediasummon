import React from 'react';
import { useState, useCallback } from 'react';
import { fetchUpdateSecrets } from '../fetchers/userconfig';

async function handleSaveClick(secretName, clientID, clientSecret, setShowing) {
  await fetchUpdateSecrets(secretName, {client_id: clientID, client_secret: clientSecret});
  setShowing(false);
}

export default function OAuthAppForm({secretName, setShowing}) {
  const [clientID, setClientID] = useState(undefined);
  const [clientSecret, setClientSecret] = useState(undefined);
  
  const handleCancelClicked = useCallback(ev => {
    ev.preventDefault();
    setShowing(false);
  }, []);
  const handleSaveClicked = useCallback(ev => {
    ev.preventDefault();
    const id = clientID ? clientID.value : null;
    const secret = clientSecret ? clientSecret.value : null;
    handleSaveClick(secretName, id, secret, setShowing);
  }, [secretName, clientID, clientSecret]);

  const clientIDLoaded = useCallback(ref => {
    setClientID(ref);
  }, []);
  const clientSecretLoaded = useCallback(ref => {
    setClientSecret(ref);
  }, []);

  return (
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
  );
}