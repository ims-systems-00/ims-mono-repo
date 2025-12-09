import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  {
    name: "Page A",
    value: 90,
  },
  {
    name: "Page B",
    value: 60,
  },
  {
    name: "Page C",
    value: 20,
  },
  {
    name: "Page D",
    value: 27,
  },
  {
    name: "Page E",
    value: 18,
  },
];

const CustomYAxisTick = (props) => {
  const { y, payload } = props;
  //   const name = payload.value.length > maxLength ? `${payload.value.slice(0, maxLength)}...` : payload.value;
  return (
    <text
      x={0}
      y={y}
      dx={0}
      textAnchor="start"
      style={{ fontSize: "12px", color: "#6c757d" }}
    >
      {payload.value}
    </text>
  );
};

export default function VerticalChart({
  data = defaultData,
  barColor = "#0040a3",
}) {
  return (
    <div className="">
      <div style={{ height: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            width={500}
            height={300}
            data={data}
            margin={{
              top: 15,
              right: 30,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="1 1" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={<CustomYAxisTick />}
              interval={0}
              type="category"
            />
            {/* <Tooltip /> */}
            {/* <Legend /> */}
            <Bar
              dataKey="value"
              barSize={20}
              fill={barColor}
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
