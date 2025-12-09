import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ImsLineChart = ({ data, options }) => {
  const { xKey, lineDataKeys, lineColors, width, height } = options;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        width={width}
        height={height}
        data={data}
        margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
      >
        <XAxis dataKey={xKey} />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {lineDataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={lineColors[index]}
            strokeWidth={2}
          />
        ))}
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ImsLineChart;
