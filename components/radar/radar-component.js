import React, { useState } from 'react';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import { RadarChart } from 'react-vis';
import styles from './radar.module.scss';
import cx from 'classnames';

const colors = {
  learning: '#F49F0A',
  'want to learn': '#EFCA08',
  'not interested': '#A27E6F',
  expert: '#11403F',
  competent: '#2BA4A0',
  'basic knowledge': '#CFF2F2',
  'no knowledge': '#ddd'
};

export default function BasicRadarChart(props) {
  const { width, height, data, skills, isUnfiltered } = props;
  const [selectedValues, selectValues] = useState(data.map(d => d.name));
  const [hoveredCell, setHoveredCell] = useState(null);
  const domainNames = skills.map(s => s.skill);
  const domains = domainNames.map((skill) => ({
    name: skill,
    domain: [0, 11]
  }));

  const dataWithColors = data.map((d) => ({
    ...d,
    stroke: colors[d.name],
    fill: colors[d.name]
  }));
  const filteredSelectedData = dataWithColors.filter(d => selectedValues.includes(d.name));
  const handleLegendClick = (value) => {
    selectedValues.includes(value)
    ? selectValues(selectedValues.filter((v) => v !== value))
    : selectValues([...selectedValues, value]);
  };

  if (domains.length === 1) {
    domains.push({ name: '', domain: [0, 11] });
    domainNames.push('')
  }

  const getValues = (name) => {
    const valueData = filteredSelectedData.find(d => d.name === name);
    const domainNames = domains.map(d => d.name);
    if (!valueData) return null;
    return Object.keys(valueData)
      .filter((d) => domainNames.includes(d))
      .map((skill) => ({ skill, value: valueData[skill] }));
  }

  const completeDataWithZeros = filteredSelectedData.map(valueData => {
    const updatedValueData = { ...valueData };
    domainNames.forEach(name => {
      if (!valueData[name]) {
        updatedValueData[name] = 0;
      }
    })
    return updatedValueData;
  });
  return (
    <div className={styles.radar}>
      <RadarChart
        data={completeDataWithZeros}
        tickFormat={format('d')}
        startingAngle={0}
        domains={domains}
        width={width || 400}
        height={height || 300}
        margin={{ left: 100, right: 100, top: 100, bottom: 100 }}
        style={{
          polygons: {
            strokeWidth: 3,
            strokeOpacity: 1,
            fillOpacity: 0.5
          },
          labels: {
            fontSize: isUnfiltered ? 8 : 12,
          },
          axes: {
            line: {
              strokeWidth: 0.2,
              strokeOpacity: 0.5
            },
            text: {
              fillOpacity: 0.3
            }
          }
        }}
        onSeriesMouseOver={(data) => {
          setHoveredCell(data.event[0]);
        }}
        onSeriesMouseOut={() => setHoveredCell(null)}
      />
      <div className={styles.legend}>
        <p>Click to toggle legend items</p>
        {dataWithColors.map((d) => (
          <div className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: d.fill }}
            />
            <button
              className={cx(styles.legendButton, {
                [styles.active]: selectedValues.includes(d.name)
              })}
              onClick={() => handleLegendClick(d.name)}
            >
              {capitalize(d.name)}
            </button>
          </div>
        ))}
      </div>
      {hoveredCell && hoveredCell.name && getValues(hoveredCell.name) && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{hoveredCell.name}</div>
          {sortBy(getValues(hoveredCell.name), 'value')
            .reverse()
            .map((s) => (
              <div key={s.skill} className={styles.tooltipItem}>
                <span>{s.skill}</span>
                <span>{s.value}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}