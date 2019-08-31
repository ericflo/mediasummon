import React from 'react';

export default function TargetSummary({target, onRemoveClick}) {
  return (
    <div className="uk-card uk-card-default uk-card-hover uk-margin">
      <div className="uk-card-header">
        <div className="uk-grid-small uk-flex-middle" uk-grid="true">
          <div className="uk-width-auto">
            <span className="uk-border" uk-icon="icon: folder; ratio: 2" />
          </div>
          <div className="uk-width-expand">
            <h3 className="uk-card-title uk-margin-remove-bottom uk-text-middle">{target.path}</h3>
          </div>
          <div className="uk-width-auto">
            <a className="uk-close-small" uk-close="true" onClick={onRemoveClick}></a>
          </div>
        </div>
      </div>
    </div>
  )
}