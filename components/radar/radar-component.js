import React from 'react';
import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Point } from '@visx/point';
import { Line, LineRadial } from '@visx/shape';

// const expertiseClassification = {
//   'No knowledge': 0,
//   'Basic knowledge': 1,
//   Competent: 2,
//   Expert: 3
// };

const orange = '#ff9933';
export const pumpkin = '#f5810c';
const silver = '#d9d9d9';
export const background = '#FFF';

const degrees = 360;

const genAngles = (length) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle: i * (degrees / length)
  }));

const genPoints = (length, radius) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step)
  }));
};

function genPolygonPoints(
  dataArray,
  scale,
  getValue
) {
  const step = (Math.PI * 2) / dataArray.length;
  const points = new Array(dataArray.length).fill({
    x: 0,
    y: 0
  });
  const pointString = new Array(dataArray.length + 1)
    .fill('')
    .reduce((res, _, i) => {
      if (i > dataArray.length) return res;
      const xVal = scale(getValue(dataArray[i - 1])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i - 1])) * Math.cos(i * step);
      points[i - 1] = { x: xVal, y: yVal };
      res += `${xVal},${yVal} `;
      return res;
    });

  return { points, pointString };
}

const defaultMargin = { top: 40, left: 80, right: 80, bottom: 80 };

export default function Example({
  width,
  height,
  levels = 1,
  data,
  margin = defaultMargin,
  selectionFunction
}) {
  const y = selectionFunction || (d => d.Expert);

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear({
    range: [0, Math.PI * 2],
    domain: [degrees, 0]
  });

  const yScale = scaleLinear(
    {
      range: [0, radius],
      domain: [0, Math.max(...data.map(y))]
    }
  );

  const webs = genAngles(data.length);
  const points = genPoints(data.length, radius);
  const polygonPoints = genPolygonPoints(data, yScale, y);
  const zeroPoint = new Point({ x: 0, y: 0 });

  return width < 10 ? null : (
    <svg width={width} height={height}>
      <rect fill={background} width={width} height={height} rx={14} />
      <Group top={height / 2 - margin.top} left={width / 2}>
        {[...new Array(levels)].map(
          (_, i) => (
              <>
                <LineRadial
                  key={`web-${i}`}
                  data={webs}
                  angle={(d) => radialScale(d.angle)}
                  radius={((i + 1) * radius) / levels}
                  fill="none"
                  stroke={silver}
                  strokeWidth={5}
                  strokeOpacity={0.8}
                  strokeLinecap="round"
                />
              </>
            )
        )}
        {[...new Array(data.length)].map((_, i) => console.log(i) || (
          <>
            <Line
              key={`radar-line-${i}`}
              from={zeroPoint}
              to={points[i]}
              stroke={silver}
            />
          </>
        ))}
        <polygon
          points={polygonPoints.pointString}
          fill={orange}
          fillOpacity={0.3}
          stroke={orange}
          strokeWidth={1}
        />
        {polygonPoints.points.map((point, i) => (
          <circle
            key={`radar-point-${i}`}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={pumpkin}
          />
        ))}
      </Group>
    </svg>
  );
}
