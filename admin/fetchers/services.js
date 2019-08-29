import httpFetch from '../fetch';
import config from '../config';

export async function fetchServices(setServices, setErrorMessage) {
  try {
    const result = await httpFetch(config.apiPrefix + '/resources/services.json');
    if (result.ok) {
      setServices(await result.json());
    } else {
      setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);
    }
  } catch (err) {
    setErrorMessage('Could not complete fetch: ' + err);
  }
}