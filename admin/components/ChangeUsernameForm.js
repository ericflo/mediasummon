import { useState, useEffect, useCallback } from 'react';
import { fetchUpdateUsername } from '../fetchers/userconfig';

async function handleSaveClick(username, setSaving, setErrorMessage) {
  try {
    setSaving(true);
    await fetchUpdateUsername(username);
    setSaving(false);
  } catch (err) {
    setErrorMessage('' + err);
    setSaving(false);
  }
}

export default function ChangeUsernameForm({ userConfig, setErrorMessage }) {
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const initialUsername = userConfig ? userConfig.username : undefined;
  // Any time userConfig.username changes, call setUsername
  useEffect(() => {
    if (initialUsername) {
      setUsername(initialUsername);
    }
  }, [initialUsername]);
  // Any time the username changes, setUsername to the new value
  const handleUsernameChange = useCallback(ev => {
    setUsername(ev.target.value);
  }, []);
  const handleSubmitNewUsername = useCallback(ev => {
    ev.preventDefault();
    handleSaveClick(username, setSaving, setErrorMessage);
  }, [username]);
  return (
    <div className="uk-section uk-section-default uk-padding-remove-vertical">
      <h3>Change your username</h3>
      <form className="uk-form-stacked" onSubmit={handleSubmitNewUsername}>
        <div className="uk-margin">
          <label className="uk-form-label">Username</label>
          <div className="uk-form-controls">
            <input className="uk-input" type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
          </div>
        </div>
        <input type="submit" className="uk-button uk-button-primary uk-align-right" onSubmit={handleSubmitNewUsername} value="Save Username" disabled={saving} />
      </form>
    </div>
  );
}