import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect, useCallback } from 'react';
import { ensureInstalled } from '../setup';
import Header from '../components/Header';
import { fetchLogin } from '../fetchers/login';
import { setAuthToken } from '../fetchers/common';
import Router from 'next/router';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [usernameField, setUsernameField] = useState(null);
  const [passwordField, setPasswordField] = useState(null);
  useEffect(() => {
    ensureInstalled(null);
  }, []);
  const loginCallback = useCallback(ev => {
    ev.preventDefault();
    async function cb() {
      const username = usernameField.value;
      const password = passwordField.value;
      try {
        const resp = await fetchLogin(username, password);
        setAuthToken(resp.token);
        Router.push('/');
      } catch (err) {
        setErrorMessage('' + err);
      }
    }
    cb();
  }, [usernameField, passwordField]);
  const usernameLoaded = useCallback(ref => {
    setUsernameField(ref);
  }, []);
  const passwordLoaded = useCallback(ref => {
    setPasswordField(ref);
  }, []);
  return (
    <div className="uk-container">
      <Header title="Mediasummon" />
      {errorMessage ? 
        <div className="uk-alert-danger" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p><span uk-icon="warning" /> {errorMessage}</p>
        </div> : null}
      <div className="uk-section uk-section-default uk-padding-remove-top">
        <h3>Login to Mediasummon</h3>
        <form className="uk-form-stacked" onSubmit={loginCallback}>
          <div className="uk-margin">
            <label className="uk-form-label">Username</label>
            <div className="uk-form-controls">
              <input className="uk-input" type="text" placeholder="Username" ref={usernameLoaded} />
            </div>
          </div>
          <div className="uk-margin">
            <label className="uk-form-label">Password</label>
            <div className="uk-form-controls">
              <input className="uk-input" type="password" placeholder="" ref={passwordLoaded} />
            </div>
          </div>
          <input type="submit" onSubmit={loginCallback} value="Login" />
        </form>
      </div>
    </div>
  );
}