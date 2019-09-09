import '../node_modules/uikit/dist/css/uikit.min.css';
import '../static/css/global.css';
import { useEffect } from 'react';
import { setAuthToken } from '../fetchers/common';
import Router from 'next/router';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Logout() {
  useEffect(() => {
    setAuthToken(null);
    Router.push('/');
  }, []);
  return (
    <div className="toplevel">
      <div className="content">
        <Navbar />
        <div className="uk-container uk-margin">
          <Header title="Logging out of Mediasummon" />
          <div className="uk-section uk-section-default uk-padding-remove-top">
            <h3>Logging you out...</h3>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}