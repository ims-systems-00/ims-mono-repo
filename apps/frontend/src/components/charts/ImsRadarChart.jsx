import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const ImsRadarChart = ({ data, options }) => {
  const { dataKey, angles, width, height, borderColor, domain } = options;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        width={width}
        height={height}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey={dataKey} />
        <PolarRadiusAxis angle={10} domain={domain} />
        {angles?.map((angle, index) => (
          <Radar
            key={angle.key}
            name={angle.label}
            dataKey={angle.key}
            stroke={borderColor}
            fill={angle.color}
            fillOpacity={0.6}
          />
        ))}
        <circle
          cx="50%"
          cy="50%"
          r="90%"
          fill="none"
          stroke={borderColor}
          strokeWidth="4"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ImsRadarChart;
