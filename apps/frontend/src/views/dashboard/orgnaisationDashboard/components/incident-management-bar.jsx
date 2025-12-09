import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const defaultIncidentStats = [
  { name: "Internal 1", total: 0, resolved: 0 },
  { name: "Internal 2", total: 0, resolved: 0 },
];

export default function IncidentManagementBar({
  incidentStats = defaultIncidentStats,
}) {
  return (
    <div className="" style={{ minHeight: "260px" }}>
      <div style={{ height: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={incidentStats}
            margin={{
              top: 5,
              right: 30,
              left: -30,
              bottom: -5,
            }}
          >
            <CartesianGrid
              strokeDasharray="1 1"
              horizontal={true}
              vertical={false}
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            {/* <Tooltip /> */}
            {/* <Legend /> */}
            <Bar
              dataKey="total"
              barSize={18}
              fill="#0040a3"
              radius={[4, 4, 0, 0]}
              name="Total"
            />
            <Bar
              dataKey="resolved"
              barSize={18}
              fill="#28A745"
              radius={[4, 4, 0, 0]}
              name="Resolved"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
