import httpFetch from '../fetch';
import config from '../config';
import { getInstalledCSRF } from '../setup';
import { throwMessageFromJSONError, withAuthHeaders } from './common';

export async function fetchServices() {
  try {
    const result = await httpFetch(config.apiPrefix + '/resources/services.json', {
      headers: withAuthHeaders({'Content-Type': 'application/json'}),
    });
    if (result.ok) {
      const services = await result.json();
      for (let i = 0; i < services.length; ++i) {
        const service = services[i];
        const sync = service.last_sync;
        if (!sync) {
          continue;
        }
        sync.startString = sync.start;
        sync.start = Date.parse(sync.start);
        if (sync.end) {
          sync.endString = sync.end;
          sync.end = Date.parse(sync.end);
        }
      }
      return services;
    } else {
      await throwMessageFromJSONError(result);
    }
  } catch (err) {
    throw 'Could not complete fetch: ' + err;
  }
}

export async function fetchServiceSyncStart(serviceID) {
  const url = config.apiPrefix + '/resources/service/sync.json?service='+serviceID;
  const resp = await httpFetch(url, {
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
  const data = await resp.json();
  return data;
}