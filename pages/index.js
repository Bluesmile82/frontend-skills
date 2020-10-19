import React, { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import data from './data.json';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import dynamic from 'next/dynamic';

const Radar = dynamic(() => import('../components/radar/radar'));

const nameData = {}
const totalSkills = [];

data.forEach(d => {
  const updatedD = { ...d };
  const regex = /(.+)\[(.+)]/;
  Object.keys(updatedD).forEach((currentKey) => {
    const match = currentKey.match(regex);
    const category = match && match[1];
    const skill = match && trim(match[2].toLowerCase());
    const value = updatedD[currentKey]
      .split(',')
      .map((v) => trim(v.toLowerCase()));

    value.forEach(v => {
      if (v && skill) {
        totalSkills.push({
          category,
          skill,
          value: v,
          name: d['Your name']
        });
      }
    });
  });
})

const groupedSkills = groupBy(totalSkills, 'value')
const skillData = [];
Object.keys(groupedSkills).forEach((skill) => {
  const valueGrouped = groupBy(groupedSkills[skill], 'skill');
  const valueGroupedNumber = {};
  Object.keys(valueGrouped).forEach(key => {
    valueGroupedNumber[key] = valueGrouped[key].length;
  });
  skillData.push({
    name: skill,
    ...valueGroupedNumber
  });
});

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Vizzuality frontend</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Vizzuality Frontend skills</h1>
        <Radar
          width={600}
          height={600}
          data={skillData}
        />
        <div className={styles.description}>
          <ul>
            {Object.keys(nameData).map((name) => (
              <li key={name} className={styles.card}>
                <h2>{name}</h2>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
