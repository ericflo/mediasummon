import React from 'react';
import Link from 'next/link';

function Logo() {
  return (
    <React.Fragment>
      <Link href="/">
        <a>
          <img
            width="72"
            height="72"
            style={{padding: 8, marginLeft: 4}}
            src="/static/images/mediasummon-logo-transp.png"
            alt="Mediasummon Logo" />
        </a>
      </Link>
      <Link href="/">
        <a className="uk-navbar-item uk-logo">Mediasummon</a>
      </Link>
    </React.Fragment>
  );
}

function LoggedInNavbar(userConfig) {
  return (
    <nav className="uk-navbar-container" uk-navbar="true">
      <div className="uk-navbar-left">
        <Logo />
      </div>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav">
          <li>
            <Link href="/settings">
              <a>Settings</a>
            </Link>
          </li>
          <li>
            <Link href="/logout">
              <a>Logout</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

function LoggedOutNavbar() {
  return (
    <nav className="uk-navbar-container" uk-navbar="true">
      <div className="uk-navbar-left">
        <Logo />
      </div>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav">
          <li>
            <Link href="/login">
              <a>Login</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default function Navbar({ userConfig }) {
  return userConfig ? LoggedInNavbar(userConfig) : LoggedOutNavbar();
}