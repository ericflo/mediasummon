import httpFetch from '../fetch';
import config from '../config';
import { getInstalledCSRF } from '../setup';

export async function fetchServices(setServices, setErrorMessage) {
  try {
    const result = await httpFetch(config.apiPrefix + '/resources/services.json');
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
      setServices(services);
    } else {
      setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);
    }
  } catch (err) {
    setErrorMessage('Could not complete fetch: ' + err);
  }
}

export async function fetchServiceSyncStart(serviceID) {
  console.log("getInstalledCSRF()", getInstalledCSRF());
  const url = config.apiPrefix + '/resources/service/sync.json?service='+serviceID;
  const resp = await httpFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getInstalledCSRF(),
    },
    credentials: 'include',
  });
  console.log('RESP', resp);
  const data = await resp.json();
  console.log('JSON', data);
  return data;
}