import React, { useState } from 'react';
import { format } from 'd3-format';
import { RadarChart } from 'react-vis';
import styles from './radar.module.css';
import cx from 'classnames';

const wideFormat = format('.3r');

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
  console.log(data);
  const [selectedValues, selectValues] = useState(data.map(d => d.name));
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
  const filterSelectedData = dataWithColors.filter(d => selectedValues.includes(d.name));
  const handleLegendClick = (value) => {
    selectedValues.includes(value)
      ? selectValues(selectedValues.filter((v) => v !== value))
      : selectValues([...selectedValues, value]);
  };
  return (
    <>
      <div className={styles.legend}>
        <div className={styles.legendTitle}>Legend</div>
        {dataWithColors.map((d) => (
          <div className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: d.fill }}
            />
            <button
              className={cx(styles.legendButton, {[styles.active]: selectedValues.includes(d.name)})}
              onClick={() => handleLegendClick(d.name)}
            >
              {d.name}
            </button>
          </div>
        ))}
      </div>
      <RadarChart
        data={filterSelectedData}
        tickFormat={(t) => wideFormat(t)}
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
      />
    </>
  );
}