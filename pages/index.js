import React, { useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import data from './data.json';
import dynamic from 'next/dynamic';
const Radar = dynamic(() => import('../components/radar/radar'));

const learningClassification = {
  "Want to learn": 0,
  "Learning": 1,
}

const learningInitial = {
  "Want to learn": 0,
  "Learning": 0,
}

const expertiseInitial = {
  "No knowledge": 0,
  "Basic knowledge": 0,
  "Competent": 0,
  "Expert": 0,
}

const notInterestedClassification = {
  "Not interested": 1
}

const nameData = {}
const expertiseData = [];
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
    const expertiseSkill = expertiseData.find(e => e.skill === skill);
    if (expertiseSkill) {
      Object.keys(expertiseInitial).filter(e => value.includes(e)).forEach((level) => {
        const expertiseSkillIndex = expertiseData.indexOf(expertiseSkill);
        expertiseData[expertiseSkillIndex] = { ...expertiseSkill, [level]: expertiseSkill[level] + 1 };
      });
    } else {
      expertiseData.push({ skill, ...expertiseInitial});
    }
  });
  const total = Object.keys(expertiseData).filter(Boolean)
  nameData[d['Your name']] = nameSkills;
})

export default function Home() {
  const [selection, setSelection] = useState('Expert');
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Vizzuality Frontend skills</h1>
        {Object.keys(expertiseInitial).map(e => (
          <button onClick={() => setSelection(e)}>{e}</button>
        ))}
        <Radar
          width={600}
          height={600}
          data={expertiseData}
          selectionFunction={(d) => d[selection]}
        />
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
                {/* <Radar width={300} height={300} /> */}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
