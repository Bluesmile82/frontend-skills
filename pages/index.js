import React, { createContext, useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.scss'
import data from '../data/data.json';
import { SECTIONS, sectionCategories } from '../data/sections';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import capitalize from 'lodash/capitalize';
import dynamic from 'next/dynamic';
import uniqBy from 'lodash/uniqBy';
import cx from 'classnames';
const Radar = dynamic(() => import('../components/radar/radar'));

const nameData = {}
const totalSkills = [];
const allSkills = [];
data.forEach(d => {
  const regex = /(.+)\[(.+)]/;
  const parseText = (text) => trim(text.toLowerCase());
  Object.keys(d).forEach((currentKey) => {
    const match = currentKey.match(regex);
    const category = match && parseText(match[1]);
    let skill = match && parseText(match[2]);
    if (!skill) return;
    const value = d[currentKey]
      .split(',')
      .map(parseText);
    const existingSkills = allSkills.filter(s => s.skill === skill);
    const isSameSkillDifferentCategory = existingSkills.length && !existingSkills.find(s => s.category === category);
    if (isSameSkillDifferentCategory) {
      skill = `${skill} (${category})`;
    }

    allSkills.push({ skill, category });

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
const groupedSkillsBySkill = groupBy(totalSkills, 'skill');
const uniqueSkills = uniqBy(allSkills, (v) => [v.skill, v.category].join());
const categorySkills = groupBy(uniqueSkills, 'category');

const SkilledNames = ({ selectedSkill, value }) => {
  if (!selectedSkill || !groupedSkillsBySkill[selectedSkill]) return null;
  const valueSkills = groupedSkillsBySkill[selectedSkill].filter((s) => s.value === value);
  if (!valueSkills) return null;
  return (
    <div className={styles.developerSkill}>
      <div className={styles.developerSkillTitle}>{capitalize(value)}</div>
      <div>
        {valueSkills.map((s) => (
          <div>{s.name}</div>
        ))}
      </div>
    </div>
  );
}

const getFilteredSkills = (skills, section, category) => {
  let filteredSkills = skills;
  if (section) {
    filteredSkills = skills.filter(
      (skill) => sectionCategories[skill.category] === section
    );
  }
  if (category) {
    filteredSkills = skills.filter(
      (skill) => skill.category === category
    );
  }
  return filteredSkills
};

export default function Home() {
  const [selectedCategory, selectCategory] = useState(null);
  const [selectedSection, selectSection] = useState(null);
  const [selectedSkill, selectSkill] = useState(null);

  const filteredSkills = getFilteredSkills(uniqueSkills, selectedSection, selectedCategory);

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
                    selectSection(selectedSection === section ? null : section)
                  }
                >
                  {section}
                </button>
                <div className={styles.categories}>
                  {Object.keys(categorySkills)
                    .filter(
                      (category) => sectionCategories[category] === section
                    )
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
          isUnfiltered={!selectedSection && !selectedCategory}
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
        <div className={styles.skillSection}>
          <label for="skill" className={styles.skillLabel}>
            Choose a skill:
          </label>
          <input
            list="skills"
            name="skill"
            id="skill"
            onChange={(v) => selectSkill(v.target.value)}
          />
          <datalist id="skills">
            {uniqueSkills
              .map((s) => s.skill)
              .map((skill) => (
                <option value={skill} />
              ))}
          </datalist>
        </div>
        <div className={styles.skillNames}>
          <SkilledNames selectedSkill={selectedSkill} value={'expert'} />
          <SkilledNames selectedSkill={selectedSkill} value={'competent'} />
          <SkilledNames selectedSkill={selectedSkill} value={'want to learn'} />
          <SkilledNames
            selectedSkill={selectedSkill}
            value={'not interested'}
          />
        </div>
      </main>
    </div>
  );
}
