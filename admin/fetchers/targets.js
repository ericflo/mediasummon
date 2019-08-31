import httpFetch from '../fetch';
import config from '../config';

export async function fetchTargets(setTargets, setErrorMessage) {
    try {
      const result = await httpFetch(config.apiPrefix + '/resources/targets.json');
      if (result.ok) {
        const targets = await result.json();
        setTargets(targets);
      } else {
        setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);
      }
    } catch (err) {
      setErrorMessage('Could not complete fetch: ' + err);
    }
  }