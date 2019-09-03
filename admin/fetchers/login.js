import httpFetch from '../fetch';
import config from '../config';
import { getInstalledCSRF } from '../setup';
import { throwMessageFromJSONError, encodeQuery } from './common';

export async function fetchLogin(username, password) {
  try {
    const params = {username, password};
    const result = await httpFetch(config.apiPrefix + '/auth/login.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'X-CSRF-Token': getInstalledCSRF(),
      },
      credentials: 'include',
      body: encodeQuery(params),
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