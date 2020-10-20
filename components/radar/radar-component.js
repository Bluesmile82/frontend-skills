import React, { useState } from 'react';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import { RadarChart } from 'react-vis';
import styles from './radar.module.css';
import cx from 'classnames';

const colors = {
  "competent": 'blue',
  "learning": 'red',
  "want to learn": 'magenta',
  "not interested": 'yellow',
  "basic knowledge": 'orange',
  "no knowledge": 'black',
  "expert": 'green',
 };

export default function BasicRadarChart(props) {
  const { width, height, data, skills } = props;
  const [selectedValues, selectValues] = useState(data.map(d => d.name));
  const [hoveredCell, setHoveredCell] = useState(null);
  const domainNames = skills.map(s => s.skill);
  const domains = domainNames.map(name => ({
    name,
    domain: [0, 14],
    getValue: (d) => d[name]
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

  const getValues = (name) => {
    const valueData = filteredSelectedData.find(d => d.name === name);
    const domainNames = domains.map(d => d.name);
    if (!valueData) return null;
    return Object.keys(valueData)
      .filter((d) => domainNames.includes(d))
      .map((skill) => ({ skill, value: valueData[skill] }));
  }

  return (
    <div className={styles.radar}>
      <RadarChart
        data={filteredSelectedData}
        tickFormat={format('d')}
        startingAngle={0}
        domains={domains}
        width={width || 400}
        height={height || 300}
        margin={{ left: 100, right: 100, top: 100, bottom: 100 }}
        style={{
          polygons: {
            strokeWidth: 1,
            strokeOpacity: 1,
            fillOpacity: 0.5
          },
          axes: {
            line: {
              fillOpacity: 0,
              strokeWidth: 0,
              strokeOpacity: 0
            },
            ticks: {
              fillOpacity: 0,
              strokeOpacity: 0
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
              {d.name}
            </button>
          </div>
        ))}
      </div>
      {hoveredCell && hoveredCell.name && getValues(hoveredCell.name) && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipTitle}>{hoveredCell.name}</div>
          {sortBy(getValues(hoveredCell.name), 'value').reverse().map((s) => (
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