import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  { name: "HR", opportunities: 4, improvements: 2 },
  { name: "Finance", opportunities: 3, improvements: 1 },
];

// const CustomYAxisTick = (props: any) => {
//   const { x, y, payload } = props;
//   const maxLength = 20;
//   //   const name = payload.value.length > maxLength ? `${payload.value.slice(0, maxLength)}...` : payload.value;
//   return (
//     <text x={0} y={y} dx={0} textAnchor="start" style={{ fontSize: "12px", color: "#6c757d" }}>
//       {payload.value}
//     </text>
//   );
// };

export default function ContinualImprovementChart({ data = defaultData }) {
  return (
    <div style={{ height: "280px", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 15,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient
              id="gradientImprovements"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#FF6900" />
              <stop offset="100%" stopColor="#FFFFFF1F" />
            </linearGradient>
            <linearGradient
              id="gradientOpportunities"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#0040A3" />
              <stop offset="100%" stopColor="#FFFFFF1F" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          {/* <Tooltip /> */}
          <Bar
            dataKey="improvements"
            fill="url(#gradientImprovements)"
            barSize={17}
            radius={[0, 2, 2, 0]}
            name="Improvements implemented"
          />
          <Bar
            dataKey="opportunities"
            fill="url(#gradientOpportunities)"
            barSize={17}
            radius={[0, 2, 2, 0]}
            name="Improvements identified"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
