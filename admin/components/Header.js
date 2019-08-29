import React from 'react';
import Head from 'next/head';

export default function Header({ title }) {
  return (
    <React.Fragment>
      <Head>
        <title>{title || 'Mediasummon'}</title>
      </Head>
      {title ?
        <h2>{title}</h2> : null}
    </React.Fragment>
  )
}