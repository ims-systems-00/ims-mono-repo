import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const defaultData = {
  contractValueByStage: [
    { stage: "Live", count: 10 },
    { stage: "Prospect", count: 20 },
    { stage: "Warm lead", count: 30 },
    { stage: "Qualified", count: 40 },
    { stage: "Proposal", count: 0 },
  ],
};

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

export default function VerticalChartCRM({ stats = defaultData }) {
  const data = (
    stats?.contractValueByStage || defaultData.contractValueByStage
  ).map((item) => ({
    name: item.stage,
    count: item.count || 0,
  }));

  return (
    <div className="">
      <div style={{ height: "280px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
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
            <Tooltip
              formatter={(value, name, props) => [value, "Count"]}
              labelFormatter={(label) => `Stage: ${label}`}
            />
            <Bar
              dataKey="count"
              barSize={20}
              fill="#0040a3"
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
