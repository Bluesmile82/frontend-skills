import React from 'react';
import { format } from 'd3-format';
import { RadarChart } from 'react-vis';

const wideFormat = format('.3r');

export default function BasicRadarChart(props) {
  const { width, height, data } = props;
  // We need the domainNames of all categories, not only basic data
  const basicData = data.find(d => d.name === 'basic knowledge');
  const domainNames = Object.keys(basicData).filter(key => key !== 'name');
  const domains = domainNames.map(name => ({
    name,
    domain: [0, 18],
    getValue: (d) => d[name]
  }))

  return (
    <RadarChart
      data={data}
      tickFormat={(t) => wideFormat(t)}
      startingAngle={0}
      domains={domains}
      width={width || 400} // The width needs to be fixed
      height={height || 300}
      style={{
        polygons: {
          strokeWidth: 1,
          strokeOpacity: 1,
          fillOpacity: 0.5
        },
        labels: {
          textAnchor: 'middle'
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
  );
}