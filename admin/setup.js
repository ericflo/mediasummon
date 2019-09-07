import { useState, useEffect } from 'react';
import config from './config';
import { loadAuthToken } from './fetchers/common';
import { fetchCurrentUserConfig } from './fetchers/userconfig';
import Router from 'next/router';

var installed = false;
var installedCSRF = null;

export function ensureInstalled(token) {
  if (installed) {
    return;
  }

  // Load UIKit and tell it to use its 'Icons' plugin
  const UIKit = require('uikit');
  const Icons = require('uikit/dist/js/uikit-icons');
  UIKit.use(Icons);

  const dayjs = require('dayjs');
  const relativetime = require('dayjs/plugin/relativeTime');
  dayjs.extend(relativetime);

  var req = new XMLHttpRequest();
  req.addEventListener('load', function() {
    installedCSRF = req.getResponseHeader('x-csrf-token');
  });
  req.open('GET', config.apiPrefix, true);
  if (token) {
    req.setRequestHeader("Authorization", "Bearer " + token);
  }
  req.send(null);

  installed = true;
}

export function getInstalledCSRF() {
  return installedCSRF;
}

export function useRequiredUserConfig(isLogin) {
  const [state, setState] = useState({userConfig: undefined, token: undefined});
  useEffect(() => {
    async function fetchConfig() {
      try {
        const token = await loadAuthToken();
        const userConfig = await fetchCurrentUserConfig();
        setState({userConfig, token});
      } catch (err) {
        if (!isLogin) {
          Router.push('/login');
        }
      }
    }
    fetchConfig();
  }, []);
  return state;
}