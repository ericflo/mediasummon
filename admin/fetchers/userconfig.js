import httpFetch from '../fetch';
import config from '../config';
import { getInstalledCSRF } from '../setup';
import { throwMessageFromJSONError, withAuthHeaders, encodeQuery } from './common';

export async function fetchCurrentUserConfig() {
  try {
    const result = await httpFetch(config.apiPrefix + '/resources/config.json', {
      headers: withAuthHeaders({'Content-Type': 'application/json'}),
    });
    if (result.ok) {
      return await result.json();
    } else {
      await throwMessageFromJSONError(result);
    }
  } catch (err) {
    throw 'Could not complete fetch: ' + err;
  }
}

export async function fetchUpdateSecrets(service, clientID, clientSecret) {
  const params = {service: service, client_id: clientID, client_secret: clientSecret};
  const resp = await httpFetch(config.apiPrefix + '/resources/config/secrets.json', {
    method: 'POST',
    headers: withAuthHeaders({
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-CSRF-Token': getInstalledCSRF(),
    }),
    credentials: 'include',
    body: encodeQuery(params),
  });
  if (!resp.ok) {
    await throwMessageFromJSONError(resp);
  }
  const data = await resp.json();
  return data;
}