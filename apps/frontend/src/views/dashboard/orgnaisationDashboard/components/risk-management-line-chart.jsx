import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const defaultMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const defaultRisks = [0, 0, 0, 0, 0, 0, 0, 0, 8, 1, 0, 0];

export default function RiskManagementAreaChart({
  months = defaultMonths,
  risks = defaultRisks,
}) {
  // Build data array for recharts
  const data = months.map((name, i) => ({ name, pv: risks[i] ?? 0 }));
  const maxRisk = Math.max(...risks, 10);
  // Round up to nearest 5 or 10 for a cleaner axis
  const yMax = maxRisk <= 10 ? 10 : Math.ceil(maxRisk / 5) * 5;

  return (
    <div>
      <ResponsiveContainer width="100%" height={326}>
        <AreaChart
          width={500}
          height={326}
          data={data}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: -40,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              {/* Top color - more opaque */}
              <stop offset="0%" stopColor="#BBDCFDBF" stopOpacity={0.75} />
              {/* Bottom color - transparent */}
              <stop offset="100%" stopColor="#FFFFFF00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="1 1"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            padding={{ left: 40, right: 40 }}
            dataKey="name"
            axisLine={false}
            tickLine={false}
          />
          <YAxis domain={[0, yMax]} axisLine={false} tickLine={false} />
          {/* <Tooltip /> */}
          <Area
            type="monotone"
            dataKey="pv"
            dot={{ r: 2, stroke: "#0040A3", fill: "#0040A3" }}
            stroke="#0040A3"
            fill="url(#colorUv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
