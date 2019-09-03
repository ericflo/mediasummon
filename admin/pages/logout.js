import '../node_modules/uikit/dist/css/uikit.min.css';
import { useEffect } from 'react';
import { setAuthToken } from '../fetchers/common';
import Router from 'next/router';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function Logout() {
  useEffect(() => {
    setAuthToken(null);
    Router.push('/');
  }, []);
  return (
    <div className="uk-container">
      <Navbar />
      <Header title="Mediasummon - Logout" />
      <div className="uk-section uk-section-default uk-padding-remove-top">
        <h3>Logging you out...</h3>
      </div>
    </div>
  );
}