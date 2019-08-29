import { useState, useEffect } from 'react';
import httpFetch from '../fetch';
import config from '../config';

export default function Home() {
  const [services, setServices] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await httpFetch(config.apiPrefix + '/resources/services.json');
        if (result.ok) {
          setServices([await result.text()]);
        } else {
          setErrorMessage('Completed fetch but got bad status from resource: ' + result.status);
        }
      } catch (err) {
        setErrorMessage('Could not complete fetch: ' + err);
      }
    }
    fetchData();
  }, []);
  return <div>Welcome to Next.js! {services.length ? '' + services[0] : null} {errorMessage}</div>
}