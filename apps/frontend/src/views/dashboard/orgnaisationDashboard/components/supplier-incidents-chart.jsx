import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Group A", value: 1 },
  { name: "Group B", value: 0 },
];
const COLORS = ["#0040A3", "#28A745"];

export default function SupplierIncidentsChart() {
  return (
    <div>
      <ResponsiveContainer width="100%" height={185}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={140}
            outerRadius={180}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
