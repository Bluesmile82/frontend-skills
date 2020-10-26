import React, { useState } from 'react';
import capitalize from 'lodash/capitalize';
import { SECTIONS, sectionCategories } from '../../data/sections';
import cx from 'classnames';
import dynamic from 'next/dynamic';

import styles from '../../styles/Home.module.scss';

const Radar = dynamic(() => import('../radar/radar'));

export default function BasicRadarChart(props) {
  const { uniqueSkills, groupedSkillsBySkill, categorySkills, skillData } = props;

  const [selectedCategory, selectCategory] = useState(null);
  const [selectedSection, selectSection] = useState(null);
  const [selectedSkill, selectSkill] = useState(null);

  const getFilteredSkills = (skills, section, category) => {
    let filteredSkills = skills;
    if (section) {
      filteredSkills = skills.filter(
        (skill) => sectionCategories[skill.category] === section
      );
    }
    if (category) {
      filteredSkills = skills.filter((skill) => skill.category === category);
    }
    return filteredSkills;
  };

  const filteredSkills = getFilteredSkills(
    uniqueSkills,
    selectedSection,
    selectedCategory
  );

  const SkilledNames = ({ selectedSkill, value }) => {
    if (!selectedSkill || !groupedSkillsBySkill[selectedSkill]) return null;
    const valueSkills = groupedSkillsBySkill[selectedSkill].filter(
      (s) => s.value === value
    );
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
  };

  return (
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
        width={800}
        height={800}
        data={skillData}
        skills={filteredSkills}
        isUnfiltered={!selectedSection && !selectedCategory}
      />
      <div className={styles.skillSection}>
        <label for="skill" className={styles.skillLabel}>
          Choose a skill
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
        <SkilledNames selectedSkill={selectedSkill} value={'basic knowledge'} />
        <SkilledNames selectedSkill={selectedSkill} value={'no knowledge'} />
        <SkilledNames selectedSkill={selectedSkill} value={'learning'} />
        <SkilledNames selectedSkill={selectedSkill} value={'want to learn'} />
        <SkilledNames selectedSkill={selectedSkill} value={'not interested'} />
      </div>
    </main>
  );
}