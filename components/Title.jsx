import Head from 'next/head';
import React from 'react';

const Title = ({ title }) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content="Social web site by Feruz Atamuradow" />
    <link rel="icon" href="/favicon.png" />
    {/* <link rel="stylesheet" type="text/css" href="/nprogress.css" /> */}
  </Head>
);

export default Title;
