import React from 'react';
import {useCallback} from 'react';

export default function TargetSummary({target, onRemoveClick}) {
  const clickCallback = useCallback(ev => {
    ev.preventDefault();
    onRemoveClick(target);
  }, [target, onRemoveClick]);
  return (
    <div className="uk-card uk-card-default uk-card-hover uk-margin">
      <div className="uk-card-header">
        <div className="uk-grid-small uk-flex-middle" uk-grid="true">
          <div className="uk-width-auto">
            {target.kind === 'file' ?
              <span className="uk-border" uk-icon="icon: folder; ratio: 2" /> :
              <img width="40" height="40" className="uk-border" src="/static/images/logo-dropbox.png" alt="Dropbox logo" />}
            
          </div>
          <div className="uk-width-expand">
            <h3 className="uk-card-title uk-margin-remove-bottom uk-text-middle">{target.path}</h3>
          </div>
          <div className="uk-width-auto">
            <a className="uk-close-small" uk-close="true" onClick={clickCallback}></a>
          </div>
        </div>
      </div>
    </div>
  )
}