import React, { createContext, useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import data from '../data/data.json';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import dynamic from 'next/dynamic';
import { uniqBy } from 'lodash';
import cx from 'classnames';
const Radar = dynamic(() => import('../components/radar/radar'));

const nameData = {}
const totalSkills = [];
const allSkills = [];
data.forEach(d => {
  const updatedD = { ...d };
  const regex = /(.+)\[(.+)]/;
  const parseText = (text) => trim(text.toLowerCase());
  Object.keys(updatedD).forEach((currentKey) => {
    const match = currentKey.match(regex);
    const category = match && parseText(match[1]);
    const skill = match && parseText(match[2]);
    const value = updatedD[currentKey]
      .split(',')
      .map(parseText);

    if (skill) {
      allSkills.push({ skill, category });
    }

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
const SECTIONS = {
  core: 'core',
  specialization: 'specialization',
  integration: 'integration',
}
const sectionCategories = {
  presentational: SECTIONS.core,
  connections: SECTIONS.core,
  'git and repositories management': SECTIONS.core,
  'building and automation tools': SECTIONS.core,
  'accessibility and seo': SECTIONS.core,
  javascript: SECTIONS.core,
  'front end frameworks (react not included)': SECTIONS.core,
  'react library': SECTIONS.core,
  Quality: SECTIONS.specialization,
  'Quality, testing and best practices': SECTIONS.specialization,
  'visualization libraries': SECTIONS.specialization,
  'animation, 3d, and fancy': SECTIONS.specialization,
  mobile: SECTIONS.specialization,
  performance: SECTIONS.specialization,
  design: SECTIONS.integration,
  devops: SECTIONS.integration,
  'data science': SECTIONS.integration,
  'back end and apis': SECTIONS.integration,
  'client interaction and pm': SECTIONS.integration,
  testing: SECTIONS.integration
};

const uniqueSkills = uniqBy(allSkills, 'skill');
const categorySkills = groupBy(uniqueSkills, 'category');

export default function Home() {
  const [selectedCategory, selectCategory] = useState(null);
  const [selectedSection, selectSection] = useState(null);
  let filteredSkills = uniqueSkills;
  if (selectedSection) {
    filteredSkills = uniqueSkills.filter(
      (skill) => sectionCategories[skill.category] === selectedSection
    );
  }
  if (selectedCategory) {
    filteredSkills = uniqueSkills.filter(
      (skill) => skill.category === selectedCategory
    );
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Vizzuality frontend</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Vizzuality Frontend skills</h1>
        <div className={styles.sections}>
          {categorySkills &&
            Object.keys(SECTIONS).map((section) => (
              <div className={cx(styles.section, styles[section])}>
                <button
                  className={cx(styles.sectionTitle, {
                    [styles.blue]: section === selectedSection
                  })}
                  onClick={() =>
                    selectSection(
                      selectedSection === section ? null : section
                    )
                  }
                >
                  {section}
                </button>
                <div className={styles.categories}>
                  {Object.keys(categorySkills)
                    .filter((category) => sectionCategories[category] === section)
                    .map((category) => (
                      <button
                        className={cx({
                          [styles.blue]: category === selectedCategory
                        })}
                        onClick={() =>
                          selectCategory(
                            selectedCategory === category ? null : category
                          )
                        }
                      >
                        {category}
                      </button>
                    ))}
                </div>
              </div>
            ))}
        </div>
        <Radar
          width={600}
          height={600}
          data={skillData}
          skills={filteredSkills}
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
