import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ImsBarChart = ({ data, options }) => {
  const { xKey, barKeys, colors, width, height } = options;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p>{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey={xKey} />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        {barKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index]} />
        ))}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Legend />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ImsBarChart;
