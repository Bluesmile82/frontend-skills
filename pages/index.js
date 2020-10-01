import React from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import data from './data.json';
import dynamic from 'next/dynamic';
const Radar = dynamic(() => import('../components/radar/radar'));

const nameData = {}
data.forEach(d => {
  const updatedD = { ...d };
  const regex = /(.+)\[(.+)]/;
  delete updatedD['Your name'];
  const nameSkills = []
  Object.keys(updatedD).forEach((currentKey) => {
    const match = currentKey.match(regex);
    const category = match && match[1];
    const skill = match && match[2];
    const value = updatedD[currentKey].split(',');
    nameSkills.push({
      category,
      skill,
      value
    });
  });
  nameData[d['Your name']] = nameSkills;
})

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <Radar width={600} height={600} />
        <div className={styles.description}>
          <ul>
            {Object.keys(nameData).map((name) => (
              <li key={name} className={styles.card}>
                <h2>{name}</h2>
                {/* <div>
                  {nameData[name].map((s) => (
                    <ul>
                      <li key={name}>
                        {s.category}
                        {' / '}
                        {s.skill}
                        {' = '}
                        {s.value.join(' and ')}
                      </li>
                    </ul>
                  ))}
                </div> */}
                <Radar width={300} height={300} />
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
