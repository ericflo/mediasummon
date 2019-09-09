import '../node_modules/uikit/dist/css/uikit.min.css';
import { useState, useEffect, useCallback } from 'react';
import { ensureInstalled, useRequiredUserConfig } from '../setup';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import ChangeUsernameForm from '../components/ChangeUsernameForm';
import ChangePasswordForm from '../components/ChangePasswordForm';
import OAuthAppForm from '../components/OAuthAppForm';

const kinds = [
  'google', 'gdrive', 'facebook', 'dropbox', 'instagram', 's3',
];

export default function Settings() {
  const {userConfig, token} = useRequiredUserConfig(true);
  const [errorMessage, setErrorMessage] = useState(null);
  // Ensure that the main stuff is installed on load or if auth token changes
  useEffect(() => {
    ensureInstalled(token);
  }, [token]);
  return (
    <div className="uk-container">
      <Navbar userConfig={userConfig} />
      <Header title="Mediasummon Settings" />
      {errorMessage ? 
        <div className="uk-alert-danger" uk-alert="true">
          <a className="uk-alert-close" uk-close="true"></a>
          <p><span uk-icon="warning" /> {errorMessage}</p>
        </div> : null}
      <ChangeUsernameForm userConfig={userConfig} setErrorMessage={setErrorMessage} />
      <ChangePasswordForm userConfig={userConfig} setErrorMessage={setErrorMessage} />
      <hr />
      {kinds.map(kind => (
        <div key={kind} className="uk-section uk-section-default uk-padding-remove-vertical">
          <h3>Set new secrets for {kind}</h3>
          <OAuthAppForm secretName={kind} />
        </div>
      ))}
    </div>
  );
}