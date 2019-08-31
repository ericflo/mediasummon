import React from 'react';
import { useState, useEffect, useCallback } from 'react';

function nameForProtocol(protocol) {
  switch (protocol) {
  case 'file':
    return 'Local Directory';
  case 'gdrive':
    return 'Google Drive';
  case 'dropbox':
    return 'Dropbox';
  case 's3':
    return 'S3';
  }
  return 'Unknown';
}

export default function AddTargetModal({ enabled, setIsAdding }) {
  const [selfVal, setSelfVal] = useState(null);
  const [protocol, setProtocol] = useState('file');
  useEffect(() => {
    const showing = selfVal && enabled;
    if (showing) {
      require('uikit').modal(selfVal).show();
    }
    return () => {
      if (showing) {
        require('uikit').modal(selfVal).hide();
      }
    };
  }, [selfVal, enabled]);
  const closeCallback = useCallback(ev => {
    ev.preventDefault();
    setIsAdding(false);
  }, [selfVal]);
  const refCallback = useCallback(ref => {
    setSelfVal(ref);
  }, []);
  const protocolChangeCallback = useCallback(ev => {
    setProtocol(ev.target.value);
  }, []);
  return (
    <div uk-modal="true" ref={refCallback}>
      <div className="uk-modal-dialog">
        <button
          className="uk-modal-close-default"
          type="button"
          uk-close="true"
          onClick={closeCallback} />
        <div className="uk-modal-header">
          <h2 className="uk-modal-title">Summon your media to a new location</h2>
        </div>
        <div className="uk-modal-body">
          <p>Choose the additional location where you would like to save your media</p>
          <form className="uk-form uk-flex">
            <span className="uk-width-auto" uk-form-custom="target: true">
              <input className="uk-input uk-width-auto" type="text" placeholder={nameForProtocol(protocol)} />
              <select className="uk-select" onChange={protocolChangeCallback}>
                <option value="file">{nameForProtocol('file')}</option>
                {/*
                <option value="gdrive">{nameForProtocol('gdrive')}</option>
                <option value="dropbox">{nameForProtocol('dropbox')}</option>
                <option value="s3">{nameForProtocol('s3')}</option>
                */}
              </select>
            </span>
            <input className="uk-input uk-width-expand" type="text" placeholder="/path/to/your/media/directory" />
            
          </form>
        </div>
        <div className="uk-modal-footer uk-text-right">
          <button className="uk-button uk-button-default" type="button" onClick={closeCallback}>Cancel</button>
          <button className="uk-button uk-button-primary" type="button">Save</button>
        </div>
      </div>
    </div>
  )
}