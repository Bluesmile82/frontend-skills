import { createElement } from 'react';
import MainComponent from './main-component';
import data from '../../data/data.json';
import groupBy from 'lodash/groupBy';
import trim from 'lodash/trim';
import uniqBy from 'lodash/uniqBy';

function MainContainer() {
  const totalSkills = [];
  const allSkills = [];
  data.forEach((d) => {
    const regex = /(.+)\[(.+)]/;
    const parseText = (text) => trim(text.toLowerCase());
    Object.keys(d).forEach((currentKey) => {
      const match = currentKey.match(regex);
      const category = match && parseText(match[1]);
      let skill = match && parseText(match[2]);
      if (!skill) return;
      const value = d[currentKey].split(',').map(parseText);
      const existingSkills = allSkills.filter((s) => s.skill === skill);
      const isSameSkillDifferentCategory =
        existingSkills.length &&
        !existingSkills.find((s) => s.category === category);
      if (isSameSkillDifferentCategory) {
        skill = `${skill} (${category})`;
      }

      allSkills.push({ skill, category });

      value.forEach((v) => {
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
  });
  const groupedSkills = groupBy(totalSkills, 'value');
  const skillData = [];
  Object.keys(groupedSkills).forEach((skill) => {
    const valueGrouped = groupBy(groupedSkills[skill], 'skill');
    const valueGroupedNumber = {};
    Object.keys(valueGrouped).forEach((key) => {
      valueGroupedNumber[key] = valueGrouped[key].length;
    });
    skillData.push({
      name: skill,
      ...valueGroupedNumber
    });
  });
  const uniqueSkills = uniqBy(allSkills, (v) => [v.skill, v.category].join());
  const groupedSkillsBySkill = groupBy(totalSkills, 'skill');
  const categorySkills = groupBy(uniqueSkills, 'category');

  const dataProps = {
    skillData,
    uniqueSkills,
    groupedSkillsBySkill,
    categorySkills
  };
  return createElement(MainComponent, dataProps);
}

export default MainContainer;

