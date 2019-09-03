import httpFetch from '../fetch';
import config from '../config';
import { throwMessageFromJSONError, withAuthHeaders } from './common';

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