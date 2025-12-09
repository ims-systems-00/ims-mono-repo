import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const ImsPaddingPieChart = ({ data, options }) => {
  const { colors, padding, width, height, dataKey, outerRadius, innerRadius } =
    options;

  // Define a custom Tooltip content function
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0]; // Assuming a single data point
      return (
        <div className="custom-tooltip">
          <p>{`${dataPoint.name} :${dataPoint.value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={padding}
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        {/* Use the custom Tooltip */}
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ImsPaddingPieChart;
