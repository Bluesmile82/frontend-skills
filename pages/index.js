import React from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import dynamic from 'next/dynamic';

const Main = dynamic(() => import('../components/main/main'));

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Vizzuality frontend skills</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main />
    </div>
  );
}
