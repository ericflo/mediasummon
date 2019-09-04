import httpFetch from '../fetch';
import config from '../config';
import { getInstalledCSRF } from '../setup';
import { throwMessageFromJSONError, withAuthHeaders } from './common';

export async function fetchTargets() {
  try {
    const result = await httpFetch(config.apiPrefix + '/resources/targets.json', {
      headers: withAuthHeaders({'Content-Type': 'application/json'}),
    });
    if (result.ok) {
      const targets = await result.json();
      for (let i = 0; i < targets.length; ++i) {
        const target = targets[i];
        const split = target.url.split('://');
        target.kind = split[0];
        target.path = decodeURIComponent(target.kind === 'file' ? split[1].substring(1) :  split[1]);
      }
      return targets
    } else {
      await throwMessageFromJSONError(result);
    }
  } catch (err) {
    throw 'Could not complete fetch: ' + err;
  }
}

async function fetchTargetOperation(operation, url) {
  const apiURL = config.apiPrefix + '/resources/target/' + operation + '.json?url=' + encodeURIComponent(url);
  var resp = null;
  try {
    resp = await httpFetch(apiURL, {
      method: 'POST',
      headers: withAuthHeaders({
        'Content-Type': 'application/json',
        'X-CSRF-Token': getInstalledCSRF(),
      }),
      credentials: 'include',
    });
    if (!resp.ok) {
      await throwMessageFromJSONError(resp);
    }
  } catch (err) {
    throw 'Could not complete fetch: ' + err;
  }
  try {
    return await resp.json();
  } catch (err) {
    throw 'Could not parse JSON: ' + err;
  }
}

export async function fetchTargetRemove(url) {
  return fetchTargetOperation('remove', url);
}

export async function fetchTargetAdd(url) {
  return fetchTargetOperation('add', url);
}