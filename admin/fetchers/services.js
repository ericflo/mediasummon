import httpFetch from '../fetch';
import config from '../config';

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