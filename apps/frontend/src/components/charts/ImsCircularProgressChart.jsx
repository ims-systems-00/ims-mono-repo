import React from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

const ImsCircularProgressChart = ({ data, options }) => {
  const { progress, chartSize, colors, gradient, color } = options;
  const fill = gradient && color === "gradient" ? "url(#gradient)" : color;

  const chartContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: chartSize + "px",
  };

  return (
    <div style={chartContainerStyle}>
      <ResponsiveContainer width="100%" height="100%">
        <React.Fragment>
          <PieChart width={chartSize} height={chartSize}>
            <Pie
              data={data}
              cx={chartSize / 2}
              cy={chartSize / 2}
              startAngle={90}
              endAngle={-270}
              innerRadius={chartSize * 0.37}
              outerRadius={chartSize * 0.4}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell fill={fill} />
              <Cell fill="#f5f5f5" />
              <Label
                value={`${progress}%`}
                position="center"
                fill="#333"
                fontSize={20}
                fontWeight="bold"
              />
            </Pie>
          </PieChart>
          {gradient && color === "gradient" && (
            <svg width="0" height="0">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  {colors.map((color, index) => (
                    <stop
                      key={`stop-${index}`}
                      offset={`${(index * 100) / (colors.length - 1)}%`}
                      stopColor={color}
                    />
                  ))}
                </linearGradient>
              </defs>
            </svg>
          )}
        </React.Fragment>
      </ResponsiveContainer>
    </div>
  );
};

export default ImsCircularProgressChart;
