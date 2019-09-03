import Link from 'next/link';

function LoggedInNavbar(userConfig) {
  return (
    <nav className="uk-navbar-container" uk-navbar="true">
      <div className="uk-navbar-left">
        <ul className="uk-navbar-nav">
          <li>
            <Link href="/">
              <a>Dashboard</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="uk-navbar-right">
        <ul className="uk-navbar-nav">
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