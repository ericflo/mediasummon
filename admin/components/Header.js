import React from 'react';
import Head from 'next/head';

export default function Header({ title }) {
  return (
    <React.Fragment>
      <Head>
        <title>{title || 'Mediasummon'}</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
        <link rel="manifest" href="/static/icons/site.webmanifest" />
        <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="shortcut icon" href="/static/icons/favicon.ico" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="msapplication-config" content="/static/icons/browserconfig.xml" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      {title ? <h2>{title}</h2> : null}
    </React.Fragment>
  )
}