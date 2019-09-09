import { useState, useEffect, useCallback } from 'react';
import { fetchUpdatePassword } from '../fetchers/userconfig';

async function handleSaveClick(password, setSaving, setErrorMessage) {
  try {
    setSaving(true);
    await fetchUpdatePassword(password);
    setSaving(false);
  } catch (err) {
    setErrorMessage('' + err);
    setSaving(false);
  }
}

export default function ChangePasswordForm({ userConfig, setErrorMessage }) {
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  // Any time the password changes, setPassword to the new value
  const handlePasswordChange = useCallback(ev => {
    setPassword(ev.target.value);
  }, []);
  const handleSubmitNewPassword = useCallback(ev => {
    ev.preventDefault();
    handleSaveClick(password, setSaving, setErrorMessage);
  }, [password]);
  return (
    <div className="uk-section uk-section-default uk-padding-remove-vertical">
      <h3>Change your password</h3>
      <form className="uk-form-stacked" onSubmit={handleSubmitNewPassword}>
        <div className="uk-margin">
          <label className="uk-form-label">Password</label>
          <div className="uk-form-controls">
            <input className="uk-input" type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
          </div>
        </div>
        <input type="submit" className="uk-button uk-button-primary uk-align-right" onSubmit={handleSubmitNewPassword} value="Save Password" disabled={saving} />
      </form>
    </div>
  );
}