import httpFetch from '../fetch';
import config from '../config';
import { getInstalledCSRF } from '../setup';

export async function fetchTargets(setTargets, setErrorMessage) {
  try {
    const result = await httpFetch(config.apiPrefix + '/resources/targets.json');
    if (result.ok) {
      const targets = await result.json();
      for (let i = 0; i < targets.length; ++i) {
        const target = targets[i];
        const split = target.url.split('://');
        target.kind = split[0];
        target.path = decodeURIComponent(split[1].substring(1));
      }
      setTargets(targets);
    } else {
      setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);
    }
  } catch (err) {
    setErrorMessage('Could not complete fetch: ' + err);
  }
}

export async function fetchTargetRemove(url, setErrorMessage) {
  const apiURL = config.apiPrefix + '/resources/target/remove.json?url=' + encodeURIComponent(url);
  var resp = null;
  try {
    resp = await httpFetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getInstalledCSRF(),
      },
      credentials: 'include',
    });
    if (!resp.ok) {
      setErrorMessage('Completed fetch but got bad status from resource: ' + resp.status);
      return;
    }
  } catch (err) {
    setErrorMessage('Could not complete fetch: ' + err);
    return;
  }
  try {
    const data = await resp.json();
    return data;
  } catch (err) {
    setErrorMessage('Could not parse JSON: ' + err);
  }
}